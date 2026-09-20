// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static shouldKeepListening: boolean = false;
  private static baseText: string = '';
  private static currentSessionTranscript: string = '';
  private static lastReportedFullText: string = '';
  private static restartTimer: any = null;

  static isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  static getIsListening(): boolean {
    return this.isListening;
  }

  static getLatestTranscript(): string {
    return this.lastReportedFullText;
  }

  static startListening(callbacks: SpeechCallbacks, initialText: string = ''): boolean {
    if (!this.isSpeechSupported()) {
      callbacks.onError?.('Speech recognition is not supported in this browser. You can still type directly!');
      return false;
    }

    // Stop any existing instance cleanly
    this.stopListening();

    this.shouldKeepListening = true;
    this.baseText = initialText.trim() ? initialText.trim() + ' ' : '';
    this.currentSessionTranscript = '';
    this.lastReportedFullText = initialText;

    const setupRecognition = () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true; // Continuous listening across multiple sentences
        this.recognition.interimResults = true; // Real-time interim results
        this.recognition.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          callbacks.onStart?.();
        };

        this.recognition.onresult = (event: any) => {
          let sessionTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            sessionTranscript += event.results[i][0].transcript;
          }

          this.currentSessionTranscript = sessionTranscript;
          const fullText = (this.baseText + sessionTranscript).trim();
          this.lastReportedFullText = fullText;
          callbacks.onResult?.(fullText, false);
        };

        this.recognition.onerror = (event: any) => {
          // 'no-speech' or 'aborted' occurs during user pauses/thinking; do NOT stop listening!
          if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
          }
          if (event.error === 'network') {
            console.warn('Speech recognition temporary network hiccup, maintaining transcript.');
            return;
          }
          console.warn('Speech recognition warning:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.shouldKeepListening = false;
            this.isListening = false;
            callbacks.onError?.('Microphone permission denied. Please allow microphone access in your browser.');
          } else if (event.error === 'audio-capture') {
            this.shouldKeepListening = false;
            this.isListening = false;
            callbacks.onError?.('No microphone detected. Please check your audio input settings.');
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          // If the user hasn't explicitly stopped listening, debounced restart!
          if (this.shouldKeepListening) {
            if (this.currentSessionTranscript) {
              this.baseText = (this.baseText + this.currentSessionTranscript).trim() + ' ';
              this.currentSessionTranscript = '';
            }
            if (this.restartTimer) clearTimeout(this.restartTimer);
            this.restartTimer = setTimeout(() => {
              if (this.shouldKeepListening) {
                try {
                  this.recognition?.start();
                } catch (e) {
                  console.debug('Continuous recognition restart notice:', e);
                }
              }
            }, 120);
            return;
          }
          callbacks.onEnd?.();
        };

        this.recognition.start();
        return true;
      } catch (err: any) {
        console.error('Failed to initialize speech recognition:', err);
        callbacks.onError?.(err?.message || 'Failed to start microphone');
        this.isListening = false;
        this.shouldKeepListening = false;
        return false;
      }
    };

    return setupRecognition();
  }

  static stopListening(): string {
    this.shouldKeepListening = false;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    return this.lastReportedFullText;
  }

  static speakText(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and hashtags for clean speech
      const cleanText = text.replace(/[*#_`>]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

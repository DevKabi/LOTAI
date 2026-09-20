import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Platform detection
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent);
  const isMobile = typeof window !== 'undefined' && (isIOS || isAndroid || window.innerWidth < 768);

  // Check standalone display mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');

      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      if (e.matches) setIsInstalled(true);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Intercept beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsModalOpen(false);
      console.log('[LOTAI PWA] App was successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    // If native prompt is available (Chrome, Edge, Android)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[LOTAI PWA] User accepted installation prompt');
          setIsInstalled(true);
          setDeferredPrompt(null);
        } else {
          console.log('[LOTAI PWA] User dismissed installation prompt');
        }
      } catch (err) {
        console.warn('[LOTAI PWA] Error triggering install prompt:', err);
      }
      setIsModalOpen(false);
      return;
    }

    // Otherwise open the guided install modal (especially for iOS Safari or instructions)
    setIsModalOpen(true);
  }, [deferredPrompt]);

  // Is installable if not already installed and not running in standalone mode
  const isInstallable = !isStandalone && (Boolean(deferredPrompt) || isIOS || !isInstalled);

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    isMobile,
    isDismissed,
    setIsDismissed,
    isModalOpen,
    setIsModalOpen,
    promptInstall,
    hasNativePrompt: Boolean(deferredPrompt)
  };
}

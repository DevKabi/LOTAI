import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { UserProfile, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'lotai_demo_auth_active';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_USER_STORAGE_KEY) === 'true';
  });

  // Fetch or upsert user profile from 'profiles' table
  const fetchProfile = async (userId: string, userEmail: string, userMetaName?: string, userAvatar?: string) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Record does not exist, insert initial profile
        const newProfile: UserProfile = {
          id: userId,
          email: userEmail,
          name: userMetaName || userEmail.split('@')[0],
          avatar_url: userAvatar || null,
          created_at: new Date().toISOString()
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (!insertError && inserted) {
          setProfile(inserted);
        } else {
          setProfile(newProfile);
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Error retrieving profile from Supabase:', err);
      // Fallback local representation
      setProfile({
        id: userId,
        email: userEmail,
        name: userMetaName || userEmail.split('@')[0],
        avatar_url: userAvatar || null,
        created_at: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    // If running in demo mode
    if (isDemoUser) {
      const demoProfile: UserProfile = {
        id: 'demo-user-id',
        email: 'alex.mercer@lotai.app',
        name: 'Alex Mercer',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      };
      setProfile(demoProfile);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        );
      }
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        );
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoUser]);

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add credentials to .env or use Demo Mode.') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Sign Up with Email, Password, and Name
  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add credentials to .env or use Demo Mode.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          full_name: name || email.split('@')[0]
        }
      }
    });

    if (error) return { error };

    const needsEmailConfirmation = Boolean(data.user && !data.session);
    return { error: null, needsEmailConfirmation };
  };

  // Sign In / Sign Up with Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add credentials to .env or use Demo Mode.') };
    }

    const redirectUrl = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    return { error };
  };

  // Password Reset Email
  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add credentials to .env.') };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    return { error };
  };

  // Sign Out
  const signOut = async () => {
    if (isDemoUser) {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setIsDemoUser(false);
      setUser(null);
      setProfile(null);
      setSession(null);
      return;
    }

    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Demo User Mode for immediate testing
  const signInAsDemoUser = () => {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, 'true');
    setIsDemoUser(true);
    const demoProfile: UserProfile = {
      id: 'demo-user-id',
      email: 'alex.mercer@lotai.app',
      name: 'Alex Mercer',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };
    setProfile(demoProfile);
  };

  // Update Profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: new Error('No active profile') };

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    if (isSupabaseConfigured && !isDemoUser) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);
      return { error };
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPasswordForEmail,
        signOut,
        signInAsDemoUser,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

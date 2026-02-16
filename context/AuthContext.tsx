import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractProfile(supabaseUser: SupabaseUser): UserProfile {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? extractProfile(session.user) : null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? extractProfile(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signUp = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, full_name: name } },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Check your email for the code.', needsVerification: true };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Welcome back!' };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Verified!' };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    return error ? { success: false, message: error.message } : { success: true, message: 'Resent!' };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isConfigured: configured, signUp, signIn, signOut, verifyOtp, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
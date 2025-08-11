import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app to provide auth state and helper methods.
 * Exposes { user, session, loading, signInWithEmail, signOut } via context.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          setSession(data?.session || null);
          setUser(data?.session?.user || null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Auth] init session error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  /** PUBLIC_INTERFACE
   * Initiates passwordless email magic link sign-in.
   * Uses optional REACT_APP_SITE_URL override, falling back to window.location.origin.
   */
  const signInWithEmail = async (email) => {
    const redirectTo =
      process.env.REACT_APP_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : undefined);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });
    if (error) throw error;
    return true;
  };

  /** PUBLIC_INTERFACE
   * Signs out the current user.
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(
    () => ({ user, session, loading, signInWithEmail, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access authentication context.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const next = url.searchParams.get('next') || '';

        // In supabase-js v2, for PKCE and OTP links, exchangeCodeForSession handles
        // the code in the URL and sets the session.
        const { error } = await supabase.auth.exchangeCodeForSession();
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth callback error:', error);
          if (mounted) {
            setMessage('Authentication failed. Redirecting to error page...');
          }
          navigate('/auth/error');
          return;
        }

        // Retrieve user and attempt to read their profile role
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userRes?.user) {
          navigate('/auth/error');
          return;
        }
        const user = userRes.user;

        const { data: profile, error: profErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        // If profile missing, send to signup (preserving intended next)
        if (profErr || !profile) {
          navigate(next ? `/auth/signup?next=${encodeURIComponent(next)}` : '/auth/signup');
          return;
        }

        // If admin, route to admin
        if (profile.role === 'admin') {
          navigate('/admin');
          return;
        }

        // Honor 'next' if provided
        if (next) {
          navigate(next);
          return;
        }

        // Route by role; founders -> dashboard, investors -> overview
        if (profile.role === 'founder') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Unexpected auth callback error:', err);
        navigate('/auth/error');
      }
    };

    handleAuth();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return <div className="card">{message}</div>;
}

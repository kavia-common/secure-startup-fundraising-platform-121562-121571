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
        // Success — go to dashboard or previous intended route (basic redirect here)
        navigate('/dashboard');
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

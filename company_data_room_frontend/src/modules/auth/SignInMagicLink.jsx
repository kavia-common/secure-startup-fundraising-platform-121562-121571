import React, { useState } from 'react';
import { useAuth } from './AuthContext';

/**
 * PUBLIC_INTERFACE
 * SignInMagicLink renders a simple form to collect an email and trigger a magic link.
 */
export function SignInMagicLink() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '' });
    try {
      await signInWithEmail(email);
      setStatus({
        loading: false,
        message: 'Magic link sent! Check your email to continue.'
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setStatus({ loading: false, message: 'Failed to send magic link.' });
    }
  };

  return (
    <div className="card" aria-live="polite">
      <h2 className="mb-12">Sign in</h2>
      <p className="muted mb-16">
        Use your email to receive a magic link. No password required.
      </p>
      <form onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            marginBottom: 12
          }}
        />
        <button className="btn" type="submit" disabled={status.loading}>
          {status.loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>
      {status.message ? <p className="mt-16">{status.message}</p> : null}
    </div>
  );
}

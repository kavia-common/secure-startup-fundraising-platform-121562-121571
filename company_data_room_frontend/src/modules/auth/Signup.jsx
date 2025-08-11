import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Signup allows a newly authenticated user without a profile to select a role (founder or investor)
 * and creates their profile row in the database. Redirects to the appropriate area afterwards,
 * honoring a ?next=... parameter when safe/appropriate.
 */
export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '';
  const [role, setRole] = useState('investor'); // default investor
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data: userRes, error } = await supabase.auth.getUser();
      if (error || !userRes?.user) {
        navigate('/auth');
        return;
      }
      if (mounted) {
        setUserEmail(userRes.user.email || '');
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: userRes, error: uErr } = await supabase.auth.getUser();
      if (uErr || !userRes?.user) throw uErr || new Error('No user session');
      const user = userRes.user;
      const { error: insErr } = await supabase
        .from('profiles')
        .insert([{ id: user.id, email: user.email, role }]);
      if (insErr) throw insErr;

      // Redirect logic: honor next if present and sensible; otherwise role defaults.
      if (next) {
        navigate(next);
        return;
      }
      if (role === 'founder') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Signup] create profile error', err);
      alert('Failed to create your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="mb-12">Complete your signup</h2>
      <p className="muted mb-16">
        Welcome{userEmail ? `, ${userEmail}` : ''}! Choose your role to continue. You can request changes later via support.
      </p>
      <form onSubmit={submit}>
        <div className="mb-16">
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Select your role</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="radio"
                name="role"
                value="investor"
                checked={role === 'investor'}
                onChange={() => setRole('investor')}
              />
              Investor
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="radio"
                name="role"
                value="founder"
                checked={role === 'founder'}
                onChange={() => setRole('founder')}
              />
              Founder
            </label>
          </div>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

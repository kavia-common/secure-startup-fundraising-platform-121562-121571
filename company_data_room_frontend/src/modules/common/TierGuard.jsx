import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { SignInMagicLink } from '../auth/SignInMagicLink';

/**
 * PUBLIC_INTERFACE
 * TierGuard gates content by requiring an authenticated user.
 * Future: use minTier prop ('public' | 'qualified' | 'nda') to enforce advanced gating.
 */
export function TierGuard({ children, minTier = 'qualified' }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="card">Loading...</div>;

  // Placeholder logic: any authenticated user passes for now
  if (minTier !== 'public' && !user) {
    return (
      <div className="card">
        <h3 className="mb-12">Access restricted</h3>
        <p className="muted mb-16">Please sign in to continue.</p>
        <SignInMagicLink />
      </div>
    );
  }

  return <>{children}</>;
}

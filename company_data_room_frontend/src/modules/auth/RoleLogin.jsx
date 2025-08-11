import React from 'react';
import { SignInMagicLink } from './SignInMagicLink';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RoleLogin presents easy entry points for Investors and Founders to sign in,
 * with a clear link to the dedicated Admin login page.
 */
export function RoleLogin() {
  return (
    <div className="grid cols-2">
      <div className="card">
        <h2 className="mb-12">Investor sign in</h2>
        <p className="muted mb-16">
          Access public materials now. Sign in to request higher-tier access and sign the NDA.
        </p>
        <SignInMagicLink
          next="/"
          heading="Investor sign in"
          description="Enter your email to receive a magic link."
          buttonLabel="Send magic link"
        />
      </div>

      <div className="card">
        <h2 className="mb-12">Founder sign in</h2>
        <p className="muted mb-16">
          Manage your data room: upload documents, approve access, and review analytics.
        </p>
        <SignInMagicLink
          next="/dashboard"
          heading="Founder sign in"
          description="Enter your founder email to receive a magic link."
          buttonLabel="Send magic link"
        />
      </div>

      <div className="card">
        <h3>Admin?</h3>
        <p className="muted">
          Administrators should use the dedicated page.
        </p>
        <Link className="btn mt-16" to="/auth/admin">Go to Admin login</Link>
      </div>
    </div>
  );
}

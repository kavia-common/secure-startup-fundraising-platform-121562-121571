import React from 'react';
import { SignInMagicLink } from './SignInMagicLink';

/**
 * PUBLIC_INTERFACE
 * AdminLogin provides a dedicated sign-in page for administrators using passwordless magic links.
 * The magic link carries next=/admin so the callback routes to the admin area for users with role 'admin'.
 */
export function AdminLogin() {
  return (
    <div className="grid cols-2">
      <div className="card">
        <h2 className="mb-12">Admin access</h2>
        <p className="muted mb-16">
          Use your admin email to receive a secure magic link. On successful authentication,
          administrators are routed to the Admin panel.
        </p>
        <SignInMagicLink
          next="/admin"
          heading="Admin sign in"
          description="Enter your admin email to receive a magic link."
          buttonLabel="Send admin magic link"
        />
        <p className="muted mt-16">
          Note: Only accounts provisioned with role=admin can access the Admin panel.
        </p>
      </div>
      <div className="card">
        <h3>Need help?</h3>
        <p className="muted">
          If you believe you should have admin access, contact the platform owner to be provisioned.
        </p>
      </div>
    </div>
  );
}

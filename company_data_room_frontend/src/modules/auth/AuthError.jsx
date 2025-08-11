import React from 'react';

export default function AuthError() {
  return (
    <div className="card">
      <h3>Authentication Error</h3>
      <p className="muted">
        We couldn&apos;t complete your sign-in. Please try again or request a new link.
      </p>
    </div>
  );
}

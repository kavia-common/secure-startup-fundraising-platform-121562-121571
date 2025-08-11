import React from 'react';
import { useAuth } from '../../modules/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Topbar displays app title, tier badge placeholder, and quick actions.
 */
export function Topbar({ onToggleTheme }) {
  const { user, signOut } = useAuth();

  return (
    <header className="topbar" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700 }}>Company Data Room</span>
        <span className="badge">
          {/* Placeholder tier value */}
          Tier: public
        </span>
      </div>
      <div className="topbar-actions">
        {user ? (
          <>
            <span className="muted" style={{ fontSize: 14 }}>
              {user.email}
            </span>
            <button className="btn secondary" onClick={signOut}>Sign out</button>
          </>
        ) : null}
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          Theme
        </button>
      </div>
    </header>
  );
}

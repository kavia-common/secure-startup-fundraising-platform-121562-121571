import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigational component for the app shell.
 */
export function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="sidebar" aria-label="Primary">
      <div style={{ fontWeight: 800, fontSize: 18 }}>
        Data Room
      </div>
      <nav className="nav" aria-label="Main navigation">
        <NavLink to="/" end>
          <span role="img" aria-label="overview">📊</span>
          Overview
        </NavLink>
        <NavLink to="/documents">
          <span role="img" aria-label="documents">📁</span>
          Documents
        </NavLink>
        <NavLink to="/nda">
          <span role="img" aria-label="nda">✍️</span>
          NDA
        </NavLink>
        <NavLink to="/dashboard">
          <span role="img" aria-label="dashboard">🧭</span>
          Dashboard
        </NavLink>
        <NavLink to="/notifications">
          <span role="img" aria-label="notifications">🔔</span>
          Notifications
        </NavLink>
        <NavLink to="/admin">
          <span role="img" aria-label="admin">🛠️</span>
          Admin
        </NavLink>
        {!user ? (
          <>
            <NavLink to="/auth">
              <span role="img" aria-label="login">🔑</span>
              Sign in
            </NavLink>
            <NavLink to="/auth/admin">
              <span role="img" aria-label="admin login">🧰</span>
              Admin Login
            </NavLink>
          </>
        ) : null}
      </nav>
    </aside>
  );
}

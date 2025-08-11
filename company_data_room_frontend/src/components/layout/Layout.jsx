import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * PUBLIC_INTERFACE
 * Layout composes the persistent UI shell (sidebar + topbar + content).
 */
export function Layout({ children, onToggleTheme }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <Topbar onToggleTheme={onToggleTheme} />
      <main className="content" role="main">
        {children}
      </main>
    </div>
  );
}

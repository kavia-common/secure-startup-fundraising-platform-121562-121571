import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NotificationsCenter placeholder to display in-app events and updates.
 */
export function NotificationsCenter() {
  const items = [
    { id: 1, text: 'Your access request was approved', ts: '2h ago' },
    { id: 2, text: 'NDA completed successfully', ts: '1d ago' }
  ];
  return (
    <div className="card">
      <h3>Notifications</h3>
      <ul>
        {items.map((it) => (
          <li key={it.id} style={{ marginTop: 8 }}>
            <span>{it.text}</span>
            <span className="muted" style={{ marginLeft: 8 }}>({it.ts})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NDAModal placeholder to show NDA terms and capture acceptance (MVP).
 */
export function NDAModal({ onClose }) {
  return (
    <div className="card">
      <h3>NDA Agreement</h3>
      <p className="muted">Please review and accept the NDA to access sensitive documents.</p>
      <div className="mt-16" style={{ maxHeight: 240, overflow: 'auto', background: 'var(--muted-bg)', padding: 12, borderRadius: 8 }}>
        <p className="muted">[NDA content placeholder...]</p>
      </div>
      <div className="mt-16" style={{ display: 'flex', gap: 8 }}>
        <button className="btn">I Agree</button>
        <button className="btn secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

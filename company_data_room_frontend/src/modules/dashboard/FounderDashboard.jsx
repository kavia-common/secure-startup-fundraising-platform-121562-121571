import React from 'react';

/**
 * PUBLIC_INTERFACE
 * FounderDashboard placeholder with basic sections.
 */
export function FounderDashboard() {
  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Uploads & Organization</h3>
        <p className="muted">Create sections, upload documents, and set visibility tiers.</p>
        <button className="btn mt-16">Upload documents</button>
      </div>
      <div className="card">
        <h3>Access Requests</h3>
        <p className="muted">Review and approve investor requests for higher tiers.</p>
        <button className="btn mt-16">Open requests</button>
      </div>
      <div className="card">
        <h3>Analytics</h3>
        <p className="muted">Top viewed documents, recent activity, and NDA completion.</p>
      </div>
      <div className="card">
        <h3>Audit Logs</h3>
        <p className="muted">Immutable records of views, downloads, and signatures.</p>
      </div>
    </div>
  );
}

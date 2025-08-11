import React from 'react';

/**
 * PUBLIC_INTERFACE
 * InvestorDashboard placeholder showing public/qualified content prompts.
 */
export function InvestorDashboard() {
  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Overview</h3>
        <p className="muted">Welcome to the Company Data Room.</p>
        <ul>
          <li>Browse selected public content.</li>
          <li>Authenticate to request qualified tier access.</li>
          <li>Sign the NDA to unlock sensitive documents.</li>
        </ul>
      </div>
      <div className="card">
        <h3>Quick Links</h3>
        <ul>
          <li>Documents</li>
          <li>Request Access</li>
          <li>NDA</li>
        </ul>
      </div>
    </div>
  );
}

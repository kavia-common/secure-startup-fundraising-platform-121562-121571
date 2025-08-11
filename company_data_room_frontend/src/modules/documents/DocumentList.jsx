import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * DocumentList placeholder with sample items.
 */
export function DocumentList() {
  const docs = [
    { id: 'pitch-deck', name: 'Pitch Deck (Public)', tier: 'public' },
    { id: 'financials-fy', name: 'Financials FY (Qualified)', tier: 'qualified' },
    { id: 'product-roadmap', name: 'Product Roadmap (NDA)', tier: 'nda' }
  ];
  return (
    <div className="card">
      <h3>Documents</h3>
      <ul>
        {docs.map((d) => (
          <li key={d.id} style={{ margin: '10px 0' }}>
            <Link to={`/documents/${d.id}`}>{d.name}</Link>
            <span className="badge" style={{ marginLeft: 8 }}>{d.tier}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * DocumentViewer placeholder for inline previews using signed URLs (future).
 */
export function DocumentViewer() {
  const { id } = useParams();
  return (
    <div className="card">
      <h3>Viewer</h3>
      <p className="muted">Document ID: {id}</p>
      <div className="mt-16" style={{ height: 320, background: 'var(--muted-bg)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        <div className="center" style={{ height: '100%' }}>
          <span className="muted">Preview surface (PDF/Image) — signed URL to be integrated</span>
        </div>
      </div>
    </div>
  );
}

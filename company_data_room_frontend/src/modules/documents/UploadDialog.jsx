import React from 'react';

/**
 * PUBLIC_INTERFACE
 * UploadDialog placeholder for future upload and tier assignment.
 */
export function UploadDialog() {
  return (
    <div className="card">
      <h3>Upload</h3>
      <p className="muted">Drag and drop files here or click to browse.</p>
      <div className="mt-16" style={{ height: 120, border: '2px dashed var(--border-color)', borderRadius: 12 }} />
      <button className="btn mt-16">Select files</button>
    </div>
  );
}

import React, { useState } from 'react';
import { NDAModal } from './NDAModal';

/**
 * PUBLIC_INTERFACE
 * NDAPage placeholder with modal trigger for signing flow.
 */
export function NDAPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <h3>NDA</h3>
      <p className="muted">Sign the NDA to unlock sensitive content.</p>
      <button className="btn mt-16" onClick={() => setOpen(true)}>Open NDA</button>
      <div className="mt-16">
        {open ? <NDAModal onClose={() => setOpen(false)} /> : null}
      </div>
    </div>
  );
}

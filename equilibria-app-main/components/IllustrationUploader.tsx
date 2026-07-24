'use client';

import { useState } from 'react';

export default function IllustrationUploader() {
  const [day, setDay] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  async function upload() {
    if (!file) {
      setMsg('Choisis une image.');
      return;
    }

    setMsg('Upload en cours...');

    const form = new FormData();
    form.append('day', String(day));
    form.append('file', file);

    const res = await fetch('/api/admin/upload-illustration', {
      method: 'POST',
      body: form
    });

    const data = await res.json();
    setMsg(data.error || `Illustration envoyée : ${data.path}`);
  }

  return (
    <div className="card">
      <h2>Uploader une illustration</h2>
      <p>Formats acceptés : JPG, PNG, WEBP. Nom automatique : jour-X.webp / jpg / png.</p>

      <label>Jour du chapitre</label>
      <input type="number" min={1} max={42} value={day} onChange={(e) => setDay(Number(e.target.value))} />

      <label>Image</label>
      <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button className="btn gold" onClick={upload}>Envoyer dans Supabase</button>

      <p>{msg}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function AudioUploader() {
  const [day, setDay] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  async function upload() {
    if (!file) {
      setMsg('Choisis un fichier audio.');
      return;
    }

    setMsg('Upload en cours...');

    const form = new FormData();
    form.append('day', String(day));
    form.append('file', file);

    const res = await fetch('/api/admin/upload-audio', {
      method: 'POST',
      body: form
    });

    const data = await res.json();

    if (data.error) {
      setMsg('Erreur : ' + data.error);
    } else {
      setMsg(`Audio envoyé : ${data.path}`);
      setFile(null);
    }
  }

  return (
    <div className="card">
      <h2>Uploader un audio</h2>
      <p>Formats acceptés : <strong>M4A</strong> ou <strong>MP3</strong>.</p>
      <p>Le fichier sera automatiquement renommé : <strong>jour-X.m4a</strong> ou <strong>jour-X.mp3</strong>.</p>

      <label>Jour du chapitre</label>
      <input
        type="number"
        min={1}
        max={42}
        value={day}
        onChange={(e) => setDay(Number(e.target.value))}
      />

      <label>Fichier audio</label>
      <input
        type="file"
        accept="audio/m4a,audio/mp4,audio/mpeg,audio/mp3,.m4a,.mp3"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button className="btn gold" onClick={upload}>
        Envoyer dans Supabase
      </button>

      <p>{msg}</p>
    </div>
  );
}

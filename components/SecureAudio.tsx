'use client';
import { useState } from 'react';

export default function SecureAudio({ day }: { day:number }) {
  const [url,setUrl]=useState('');
  const [file,setFile]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  async function loadAudio(){
    setLoading(true); setError('');
    const res = await fetch(`/api/audio-url?day=${day}`);
    const data = await res.json();
    if(data.url){ setUrl(data.url); setFile(data.file || ''); }
    else setError(data.error || 'Audio indisponible.');
    setLoading(false);
  }

  return <div className="audioPanel">
    {!url && <button className="btn gold" onClick={loadAudio}>{loading ? 'Chargement...' : 'Charger l’audio sécurisé'}</button>}
    {url && <><audio controls autoPlay src={url}/>{file && <p className="muted">Fichier : {file}</p>}</>}
    {error && <p>{error}</p>}
  </div>;
}

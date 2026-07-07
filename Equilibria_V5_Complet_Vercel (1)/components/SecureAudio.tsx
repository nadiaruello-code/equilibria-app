'use client';
import { useState } from 'react';
export default function SecureAudio({ day }: { day:number }) {
  const [url,setUrl]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  async function load(){setLoading(true);setError('');const r=await fetch(`/api/audio-url?day=${day}`);const d=await r.json();if(d.url)setUrl(d.url);else setError(d.error||'Audio indisponible.');setLoading(false);}
  return <div>{!url && <button className="btn gold" onClick={load}>{loading?'Chargement...':'Charger l’audio sécurisé'}</button>}{url && <audio controls autoPlay src={url}/>} {error && <p>{error}</p>}</div>
}

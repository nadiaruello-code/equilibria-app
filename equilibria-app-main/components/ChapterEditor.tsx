'use client';

import { useState } from 'react';

export default function ChapterEditor({ chapter }: { chapter: any }) {
  const [title, setTitle] = useState(chapter.title || '');
  const [place, setPlace] = useState(chapter.place || '');
  const [symbol, setSymbol] = useState(chapter.symbol || '');
  const [emoji, setEmoji] = useState(chapter.emoji || '✦');
  const [quote, setQuote] = useState(chapter.quote || '');
  const [text, setText] = useState(chapter.text_content || '');
  const [msg, setMsg] = useState('');

  async function save() {
    setMsg('Sauvegarde...');
    const res = await fetch('/api/admin/chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: chapter.day, title, place, symbol, emoji, quote, text_content: text })
    });

    const data = await res.json();
    setMsg(data.error || 'Sauvegardé.');
  }

  return (
    <div className="card">
      <h3>Jour {chapter.day}</h3>

      <label>Titre</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Lieu</label>
      <input value={place} onChange={(e) => setPlace(e.target.value)} />

      <label>Symbole</label>
      <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />

      <label>Emoji</label>
      <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />

      <label>Phrase de Lumen</label>
      <input value={quote} onChange={(e) => setQuote(e.target.value)} />

      <label>Texte complet</label>
      <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />

      <button className="btn gold" onClick={save}>Sauvegarder</button>
      <p>{msg}</p>
    </div>
  );
}

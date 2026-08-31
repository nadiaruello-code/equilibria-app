'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';

export default function ChapterActions({ day, initialCompleted, initialJournal }: { day:number; initialCompleted:boolean; initialJournal:string }) {
  const [completed,setCompleted]=useState(initialCompleted);
  const [journal,setJournal]=useState(initialJournal || '');
  const [msg,setMsg]=useState('');

  async function save(nextCompleted = completed) {
    const supabase=createClient();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ setMsg('Connecte-toi pour sauvegarder.'); return; }
    const { error } = await supabase.from('progress').upsert({
      user_id:user.id, chapter_day:day, completed:nextCompleted, journal, updated_at:new Date().toISOString()
    }, { onConflict:'user_id,chapter_day' });
    setMsg(error ? error.message : 'Sauvegardé.');
  }

  async function validateChapter(){ setCompleted(true); await save(true); }

 return (
  <div className="journalPanel">
    <h3>Journal</h3>

    <textarea
      className="journal"
      value={journal}
      onChange={e => setJournal(e.target.value)}
      placeholder="Ce que je ressens après cette immersion..."
    />

    <p className="row">
      <button
        className="btn gold"
        onClick={validateChapter}
      >
        {completed ? 'Chapitre terminé ✓' : 'Valider le chapitre'}
      </button>

      <button
        className="btn ghost"
        onClick={() => save()}
      >
        Sauvegarder le journal
      </button>
    </p>

    <p>{msg}</p>

    {day === 1 && completed && (
      <div className="chapterNextStep">
        <p style={{ fontSize: '1.4rem' }}>✨</p>

        <h3>Vous venez de franchir votre première étape.</h3>

        <p>
          La rencontre vous a permis d’entrer dans l’univers d’Equilibria.
        </p>

        <p>
          Mais pour avancer, il vous manque encore quelque chose…
        </p>

        <div className="nextChapterPreview">
          <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🗝️</p>

          <strong>Jour 2 — La clé du Refuge</strong>

          <p>
            Une nouvelle étape pour ouvrir ce qui, jusqu’ici,
            était resté fermé.
          </p>
        </div>

        <p>
          Lumen vous attend pour continuer le voyage.
        </p>

        <a
          className="btn gold"
          href="/offres"
        >
          Débloquer la suite du voyage →
        </a>
      </div>
    )}
  </div>
);
}

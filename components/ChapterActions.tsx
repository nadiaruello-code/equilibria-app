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

    {completed && day <= 3 && (
  <div className="chapterNextStep">
    <p style={{ fontSize: '1.4rem' }}>✨</p>

    {day === 1 && (
      <>
        <h3>Vous venez de franchir votre première étape.</h3>

        <p>
          La rencontre vous a permis d’entrer dans l’univers d’Equilibria.
        </p>

        <p>
          Laissez cette première expérience continuer doucement son chemin.
        </p>

        <div className="nextChapterPreview">
          <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🗝️</p>

          <strong>Jour 2 — La Clé du Refuge</strong>

          <p>
            Une nouvelle étape pour ouvrir ce qui, jusqu’ici,
            était resté fermé.
          </p>
        </div>

        <p>
          Lumen vous retrouvera demain pour poursuivre le voyage.
        </p>

        <a
          className="btn gold"
          href="/chapitre/2"
        >
          Découvrir la prochaine étape →
        </a>
      </>
    )}

    {day === 2 && (
      <>
        <h3>Votre voyage continue.</h3>

        <p>
          Vous avez déjà franchi deux étapes. Prenez le temps de laisser
          cette expérience s’installer en vous.
        </p>

        <div className="nextChapterPreview">
          <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🪶</p>

          <strong>Jour 3 — Le Souffle retrouvé</strong>

          <p>
            Une nouvelle immersion pour retrouver de l’espace,
            du calme et votre propre rythme.
          </p>
        </div>

        <p>
          Lumen vous retrouvera demain pour la troisième étape.
        </p>

        <a
          className="btn gold"
          href="/chapitre/3"
        >
          Découvrir la prochaine étape →
        </a>
      </>
    )}

    {day === 3 && (
      <>
        <h3>Vous venez de terminer vos 3 premières étapes.</h3>

        <p>
          Vous avez découvert l’univers d’Equilibria, rencontré Lumen
          et commencé à créer vos premiers repères intérieurs.
        </p>

        <p>
          Le voyage complet compte encore de nombreuses étapes,
          pensées pour vous accompagner progressivement.
        </p>

        <div className="nextChapterPreview">
          <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🌊</p>

          <strong>Jour 4 — La Rivière qui emporte</strong>

          <p>
            Votre prochaine étape vous attend si vous souhaitez
            poursuivre le voyage.
          </p>
        </div>

        <a
          className="btn gold"
          href="/offres"
        >
          Continuer mon voyage →
        </a>
      </>
    )}
  </div>
)}
  </div>
);
}

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

  return <div className="journalPanel">
    <h3>Journal</h3>
    <textarea className="journal" value={journal} onChange={e=>setJournal(e.target.value)} placeholder="Ce que je ressens après cette immersion..." />
    <p className="row"><button className="btn gold" onClick={validateChapter}>{completed ? 'Chapitre terminé ✓' : 'Valider le chapitre'}</button><button className="btn ghost" onClick={()=>save()}>Sauvegarder le journal</button></p>
    <p>{msg}</p>
  </div>;
}

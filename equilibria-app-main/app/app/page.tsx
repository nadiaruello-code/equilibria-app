import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { getPlanLimit, getUnlockedDay, getNextUnlockDate, normalizePlan } from '@/lib/dailyAccess';
import SymbolCircle from '@/components/SymbolCircle';
import ChapterCard from '@/components/ChapterCard';

async function getFallbackChapters() {
  return JSON.parse(await fs.readFile(path.join(process.cwd(),'public/data/chapters.json'),'utf-8'));
}

function formatUnlockDate(date: Date | null) {
  if (!date) return 'Reviens demain.';
  return `Ouverture le ${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeStyle:'short'}).format(date)}.`;
}

export default async function AppPage() {
  const supabase = createServerSupabaseClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let { data: profile } = await supabase.from('profiles').select('*').eq('id',user.id).single();

  if (!profile) {
    const { data: created } = await supabase.from('profiles').insert({
      id:user.id,email:user.email,plan:'free',started_at:new Date().toISOString()
    }).select('*').single();
    profile = created;
  }

  if (!profile?.started_at) {
    const startedAt = new Date().toISOString();
    const { data: updated } = await supabase.from('profiles').update({started_at:startedAt}).eq('id',user.id).select('*').single();
    profile = updated || {...profile,started_at:startedAt};
  }

  const plan = normalizePlan(profile?.plan);
  const planLimit = getPlanLimit(plan);
  const unlockedDay = getUnlockedDay(profile?.started_at,plan);
  const nextUnlockDate = unlockedDay < planLimit ? getNextUnlockDate(profile?.started_at,unlockedDay) : null;
  const unlockLabel = formatUnlockDate(nextUnlockDate);

  const { data: dbChapters } = await supabase.from('chapters').select('*').order('day');
  const chapters = dbChapters && dbChapters.length === 42 ? dbChapters : await getFallbackChapters();

  const { data: progressRows } = await supabase.from('progress').select('*').eq('user_id',user.id);
  const completedDays = (progressRows || []).filter((p:any)=>p.completed).map((p:any)=>p.chapter_day);

  return <main className="container appShell">
    <aside className="side">
      <div className="brand">EQUILIBRIA</div>
      <h2>Lumen vous attend</h2>
      <p>{user.email}</p>
      <p>Accès : {plan === 'free' ? 'Chapitre 1 gratuit' : plan}</p>
      <p>Progression : {completedDays.length}/42</p>
      <p>Ouvert aujourd’hui : jour {unlockedDay}</p>
      {nextUnlockDate && <div className="nextUnlockPanel"><strong>Prochain chapitre</strong><span>{unlockLabel}</span></div>}
      <SymbolCircle completedDays={completedDays} chapters={chapters.slice(0,unlockedDay)} />
      <form action="/auth/signout" method="post"><button className="btn">Déconnexion</button></form>
    </aside>
    <section>
      <h1>Le Voyage</h1>
      <div className="chapterGrid">
        {chapters.map((chapter:any)=>{
          const planLocked = chapter.day > planLimit;
          const timeLocked = !planLocked && chapter.day > unlockedDay;
          return <ChapterCard key={chapter.day} chapter={chapter} planLocked={planLocked} timeLocked={timeLocked} completed={completedDays.includes(chapter.day)} unlockLabel={unlockLabel}/>;
        })}
      </div>
    </section>
  </main>;
}

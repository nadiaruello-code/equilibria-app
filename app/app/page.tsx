import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient, canAccessDay, Plan } from '@/lib/supabaseServer';
import SymbolCircle from '@/components/SymbolCircle';
import ChapterCard from '@/components/ChapterCard';

async function getChapters() {
  const file = await fs.readFile(path.join(process.cwd(), 'public/data/chapters.json'), 'utf-8');
  return JSON.parse(file);
}

export default async function AppPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) {
    const { data: created } = await supabase.from('profiles').insert({ id: user.id, email: user.email, plan: 'starter' }).select('*').single();
    profile = created;
  }

  const plan = (profile?.plan || 'starter') as Plan;
  const chapters = await getChapters();
  const { data: progressRows } = await supabase.from('progress').select('*').eq('user_id', user.id);
  const completedDays = (progressRows || []).filter((p:any) => p.completed).map((p:any) => p.chapter_day);

  return <main className="container appShell">
    <aside className="side">
      <div className="brand">EQUILIBRIA</div>
      <h2>Lumen vous attend</h2>
      <p>{user.email}</p>
      <p>Plan : {plan}</p>
      <p>Progression : {completedDays.length}/42</p>
      <SymbolCircle completedDays={completedDays} chapters={chapters} />
      <form action="/auth/signout" method="post"><button className="btn">Déconnexion</button></form>
    </aside>
    <section>
      <h1>Le Voyage</h1>
      <div className="chapterGrid">{chapters.map((chapter:any) => <ChapterCard key={chapter.day} chapter={chapter} locked={!canAccessDay(plan, chapter.day)} completed={completedDays.includes(chapter.day)} />)}</div>
    </section>
  </main>;
}

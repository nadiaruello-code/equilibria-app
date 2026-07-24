import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { canAccessChapter, getPlanLimit, getUnlockedDay, normalizePlan } from '@/lib/dailyAccess';
import PremiumAudioPlayer from '@/components/PremiumAudioPlayer';
import LumenPresence from '@/components/LumenPresence';
import ChapterActions from '@/components/ChapterActions';

async function fallbackChapter(day:number) {
  const all = JSON.parse(await fs.readFile(path.join(process.cwd(),'public/data/chapters.json'),'utf-8'));
  return all.find((c:any)=>c.day===day);
}

export default async function ChapterPage({params}:{params:{day:string}}) {
  const day = Number(params.day);
  if (!Number.isInteger(day) || day < 1 || day > 42) redirect('/app');

  const supabase = createServerSupabaseClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id',user.id).single();
  const plan = normalizePlan(profile?.plan);
  const planLimit = getPlanLimit(plan);
  const unlockedDay = getUnlockedDay(profile?.started_at,plan);

  if (day > planLimit) redirect('/offres');
  if (!canAccessChapter(day,profile?.started_at,plan)) redirect(`/app?locked=${day}&available=${unlockedDay}`);

  const { data: dbChapter } = await supabase.from('chapters').select('*').eq('day',day).single();
  const chapter = dbChapter?.place && dbChapter?.symbol && dbChapter?.quote ? dbChapter : await fallbackChapter(day);
  if (!chapter) redirect('/app');

  const { data: progress } = await supabase.from('progress').select('*').eq('user_id',user.id).eq('chapter_day',day).single();

  return <main className="chapterExperience"><div className="chapterBackdrop"/><div className="container chapterExperienceInner">
    <Link className="chapterBackLink" href="/app">← Retour au voyage</Link>
    <div className="chapterHeader">
      <div>
        <p className="kicker">Chapitre {chapter.day}</p>
        <div className="bigSymbol">{chapter.emoji || '✦'}</div>
        <p className="chapterLocation">{chapter.place}</p>
        <h1>{chapter.title}</h1>
        <p className="chapterArtifact">Symbole · {chapter.symbol}</p>
      </div>
      <LumenPresence quote={chapter.quote}/>
    </div>
    <PremiumAudioPlayer day={day} title={chapter.title}/>
    <section className="chapterReading">
      <p className="kicker dark">LE CHAPITRE</p>
      <h2>Lire et intégrer</h2>
      <p>{chapter.text_content}</p>
      <ChapterActions day={day} initialCompleted={!!progress?.completed} initialJournal={progress?.journal || ''}/>
    </section>
  </div></main>;
}

import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { canAccessChapter, getPlanLimit, getUnlockedDay, normalizePlan } from '@/lib/dailyAccess';
import PremiumAudioPlayer from '@/components/PremiumAudioPlayer';
import ChapterOneCompletion from '@/components/ChapterOneCompletion';
import LumenPresence from '@/components/LumenPresence';
import ChapterActions from '@/components/ChapterActions';

async function fallbackChapter(day:number) {
  const all = JSON.parse(await fs.readFile(path.join(process.cwd(),'public/data/chapters.json'),'utf-8'));
  return all.find((c:any)=>c.day===day);
}

export default async function ChapterPage({params}:{params:{day:string}}) {
  const day = Number(params.day);
  if (!Number.isInteger(day) || day < 1 || day > 42) redirect('/');

  const supabase = createServerSupabaseClient();
  const { data:{ user } } = await supabase.auth.getUser();

  // Le chapitre 1 est public. Tous les autres exigent un compte et un accès payé.
  if (!user && day !== 1) redirect(`/login?next=/chapitre/${day}`);

  let profile:any = null;
  let progress:any = null;

  if (user) {
    const profileResult = await supabase.from('profiles').select('*').eq('id',user.id).single();
    profile = profileResult.data;

    if (!profile) {
      const created = await supabase.from('profiles').insert({
        id:user.id,email:user.email,plan:'free',started_at:new Date().toISOString()
      }).select('*').single();
      profile = created.data;
    }

    const plan = normalizePlan(profile?.plan);
    const planLimit = getPlanLimit(plan);
    const unlockedDay = getUnlockedDay(profile?.started_at,plan);

    if (day > planLimit) redirect('/offres');
    if (!canAccessChapter(day,profile?.started_at,plan)) redirect(`/app?locked=${day}&available=${unlockedDay}`);

    const progressResult = await supabase.from('progress').select('*').eq('user_id',user.id).eq('chapter_day',day).single();
    progress = progressResult.data;
  }

  const { data: dbChapter } = await supabase.from('chapters').select('*').eq('day',day).single();
  const chapter = dbChapter?.place && dbChapter?.symbol && dbChapter?.quote ? dbChapter : await fallbackChapter(day);
  if (!chapter) redirect(user ? '/app' : '/');

  return <main className="chapterExperience"><div className="chapterBackdrop"/><div className="container chapterExperienceInner">
    <Link className="chapterBackLink" href={user ? '/app' : '/'}>← Retour au voyage</Link>
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

    {day === 1
      ? <ChapterOneCompletion title={chapter.title} isLoggedIn={!!user}/>
      : <PremiumAudioPlayer day={day} title={chapter.title}/>
    }

    <section className="chapterReading">
      <p className="kicker dark">LE CHAPITRE</p>
      <h2>Lire et intégrer</h2>
      <p>{chapter.text_content}</p>
      {user && <ChapterActions day={day} initialCompleted={!!progress?.completed} initialJournal={progress?.journal || ''}/>} 
    </section>
  </div></main>;
}

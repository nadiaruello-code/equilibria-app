import { redirect } from 'next/navigation';
import fs from 'fs/promises';import path from 'path';import Link from 'next/link';
import { createServerSupabaseClient, canAccessDay, Plan } from '@/lib/supabaseServer';
import SecureAudio from '@/components/SecureAudio';import ChapterActions from '@/components/ChapterActions';

async function fallback(day:number){const f=await fs.readFile(path.join(process.cwd(),'public/data/chapters.json'),'utf-8');return JSON.parse(f).find((c:any)=>c.day===day);}
export default async function ChapterPage({params}:{params:{day:string}}){
 const day=Number(params.day); const supabase=createServerSupabaseClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const {data:profile}=await supabase.from('profiles').select('*').eq('id',user.id).single(); const plan=(profile?.plan||'starter') as Plan; if(!canAccessDay(plan,day)) redirect('/offres');
 let {data:chapter}=await supabase.from('chapters').select('*').eq('day',day).single(); if(!chapter) chapter=await fallback(day);
 const {data:prog}=await supabase.from('progress').select('*').eq('user_id',user.id).eq('chapter_day',day).single();
 return <main className="playerHero"><div className="container"><div className="playerBox"><p className="kicker">Chapitre {chapter.day}</p><div className="bigSymbol">{chapter.emoji||'✦'}</div><h1>{chapter.title}</h1><p className="lead">{chapter.place} · {chapter.symbol}</p><h2>« {chapter.quote} »</h2><SecureAudio day={day}/><section className="section" style={{paddingBottom:20}}><h2>Lire le chapitre</h2><p>{chapter.text_content}</p><ChapterActions day={day} initialCompleted={!!prog?.completed} initialJournal={prog?.journal||''}/><p><Link className="btn ghost" href="/app">Retour au voyage</Link></p></section></div></div></main>
}

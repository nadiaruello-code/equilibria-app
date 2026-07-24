import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { canAccessChapter, getPlanLimit, normalizePlan } from '@/lib/dailyAccess';

export async function GET(req:Request) {
  try {
    const day = Number(new URL(req.url).searchParams.get('day'));
    if (!Number.isInteger(day) || day < 1 || day > 42) return NextResponse.json({error:'Jour invalide.'},{status:400});

    const supabase = createServerSupabaseClient();
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error:'Connexion requise.'},{status:401});

    const { data: profile } = await supabase.from('profiles').select('plan,started_at').eq('id',user.id).single();
    const plan = normalizePlan(profile?.plan);
    if (day > getPlanLimit(plan)) return NextResponse.json({error:'Ce chapitre nécessite un accès supérieur.'},{status:403});
    if (!canAccessChapter(day,profile?.started_at,plan)) return NextResponse.json({error:'Ce chapitre n’est pas encore ouvert. Lumen vous attendra demain.'},{status:403});

    const admin = createAdminClient();
    const bucket = process.env.SUPABASE_AUDIO_BUCKET || 'equilibria-audios';
    const names = [`jour-${day}.m4a`,`Jour-${day}.m4a`,`jour-${day}.mp3`,`Jour-${day}.mp3`,`jour_${day}.m4a`,`Jour_${day}.m4a`,`jour_${day}.mp3`,`Jour_${day}.mp3`];

    for (const filePath of names) {
      const { data, error } = await admin.storage.from(bucket).createSignedUrl(filePath,60*20);
      if (!error && data?.signedUrl) return NextResponse.json({url:data.signedUrl,file:filePath});
    }

    return NextResponse.json({error:'L’audio de ce chapitre arrive bientôt.'},{status:404});
  } catch (error:any) {
    return NextResponse.json({error:error.message || 'Erreur de chargement.'},{status:500});
  }
}

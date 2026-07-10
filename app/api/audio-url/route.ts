import { NextResponse } from 'next/server';
import { createServerSupabaseClient, canAccessDay, Plan } from '@/lib/supabaseServer';
import { createAdminClient } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const day = Number(new URL(req.url).searchParams.get('day'));
    if (!day || day < 1 || day > 42) return NextResponse.json({ error: 'Jour invalide.' }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    const plan = (profile?.plan || 'starter') as Plan;
    if (!canAccessDay(plan, day)) return NextResponse.json({ error: 'Accès réservé au Voyage Complet.' }, { status: 403 });

    const admin = createAdminClient();
    const bucket = process.env.SUPABASE_AUDIO_BUCKET || 'equilibria-audios';
    for (const filePath of [`jour-${day}.m4a`, `jour-${day}.mp3`]) {
      const { data, error } = await admin.storage.from(bucket).createSignedUrl(filePath, 60 * 20);
      if (!error && data?.signedUrl) return NextResponse.json({ url: data.signedUrl, file: filePath });
    }
    return NextResponse.json({ error: `Audio introuvable. Ajoute jour-${day}.m4a ou jour-${day}.mp3.` }, { status: 404 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

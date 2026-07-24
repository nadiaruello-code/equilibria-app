import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Accès admin refusé.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const admin = createAdminClient();

    const { error } = await admin.from('chapters').upsert({
      day: body.day,
      title: body.title,
      place: body.place,
      symbol: body.symbol,
      emoji: body.emoji,
      quote: body.quote,
      text_content: body.text_content,
      audio_path: body.audio_path || `jour-${body.day}.m4a`,
      illustration_path: body.illustration_path || `jour-${body.day}.webp`
    }, { onConflict: 'day' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

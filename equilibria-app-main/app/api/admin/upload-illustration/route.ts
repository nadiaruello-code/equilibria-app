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
    const form = await req.formData();
    const day = Number(form.get('day'));
    const file = form.get('file') as File | null;

    if (!day || day < 1 || day > 42) {
      return NextResponse.json({ error: 'Jour invalide.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const isWebp = name.endsWith('.webp') || file.type.includes('webp');
    const isPng = name.endsWith('.png') || file.type.includes('png');
    const isJpg = name.endsWith('.jpg') || name.endsWith('.jpeg') || file.type.includes('jpeg');

    if (!isWebp && !isPng && !isJpg) {
      return NextResponse.json({ error: 'Format accepté : webp, png, jpg.' }, { status: 400 });
    }

    const extension = isWebp ? 'webp' : isPng ? 'png' : 'jpg';
    const path = `jour-${day}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = process.env.SUPABASE_ILLUSTRATION_BUCKET || 'equilibria-illustrations';

    const admin = createAdminClient();
    const { error } = await admin.storage.from(bucket).upload(path, buffer, {
      upsert: true,
      contentType: file.type || `image/${extension}`
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await admin.from('chapters').update({ illustration_path: path }).eq('day', day);

    return NextResponse.json({ ok: true, path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

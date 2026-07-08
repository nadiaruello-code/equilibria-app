import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(req: Request) {
  const guard = await requireAdmin();

  if ('error' in guard) {
    return guard.error;
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

    const originalName = file.name.toLowerCase();
    const isM4a = originalName.endsWith('.m4a') || file.type.includes('mp4') || file.type.includes('m4a');
    const isMp3 = originalName.endsWith('.mp3') || file.type.includes('mpeg') || file.type.includes('mp3');

    if (!isM4a && !isMp3) {
      return NextResponse.json({
        error: 'Format accepté : .m4a ou .mp3'
      }, { status: 400 });
    }

    const extension = isM4a ? 'm4a' : 'mp3';
    const path = `jour-${day}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const admin = createAdminClient();
    const bucket = process.env.SUPABASE_AUDIO_BUCKET || 'equilibria-audios';

    const { error } = await admin.storage.from(bucket).upload(path, buffer, {
      upsert: true,
      contentType: file.type || (extension === 'm4a' ? 'audio/mp4' : 'audio/mpeg')
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await admin
      .from('chapters')
      .update({ audio_path: path })
      .eq('day', day);

    return NextResponse.json({
      ok: true,
      path
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

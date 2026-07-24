import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Accès admin refusé.' }, { status: 403 });
  }

  const { userId, plan } = await req.json();

  if (!['free', 'starter', 'premium', 'circle'].includes(plan)) {
    return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ plan }).eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

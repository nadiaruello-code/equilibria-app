import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';
export async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return { error: NextResponse.json({ error:'Accès admin refusé.' }, { status:403 }) };
  return { user };
}

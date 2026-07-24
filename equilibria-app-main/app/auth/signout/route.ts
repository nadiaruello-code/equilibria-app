import {redirect} from 'next/navigation';import {createServerSupabaseClient} from '@/lib/supabaseServer';
export async function POST(){const supabase=createServerSupabaseClient();await supabase.auth.signOut();redirect('/')}

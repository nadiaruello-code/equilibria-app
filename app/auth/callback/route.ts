import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
export async function GET(request: Request) {const url=new URL(request.url);const code=url.searchParams.get('code');if(code){const supabase=createServerSupabaseClient();await supabase.auth.exchangeCodeForSession(code);}return NextResponse.redirect(new URL('/app', request.url));}

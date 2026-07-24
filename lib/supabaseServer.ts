import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
export function createServerSupabaseClient(){const cookieStore=cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get(n:string){return cookieStore.get(n)?.value},set(n:string,v:string,o:any){try{cookieStore.set({name:n,value:v,...o})}catch{}},remove(n:string,o:any){try{cookieStore.set({name:n,value:'',...o})}catch{}}}})}
export type Plan='starter'|'premium'|'circle';
export function canAccessDay(plan:Plan,day:number){return plan==='starter'?day<=7:day<=42}
export function isAdminEmail(email?:string|null){const admins=(process.env.ADMIN_EMAILS||'').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean);return !!email&&admins.includes(email.toLowerCase())}

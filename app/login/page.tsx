'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
export default function Login(){const [email,setEmail]=useState('');const [msg,setMsg]=useState('');async function send(){const supabase=createClient();const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${window.location.origin}/auth/callback`}});setMsg(error?error.message:'Lien envoyé. Vérifie tes emails.');}
return <main className="section"><div className="container"><div className="card" style={{maxWidth:520}}><h1>Connexion</h1><p>Entre ton email pour recevoir un lien magique.</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@exemple.com"/><button className="btn gold" onClick={send}>Recevoir mon lien</button><p>{msg}</p></div></div></main>}

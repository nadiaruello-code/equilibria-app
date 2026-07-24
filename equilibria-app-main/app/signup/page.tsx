"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseBrowser";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMsg("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || password.length < 6) {
      setMsg("Saisissez une adresse e-mail valide et un mot de passe d’au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const next = new URLSearchParams(window.location.search).get("next") || "/offres";
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: callback },
    });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    if (data.session) {
      window.location.href = next;
      return;
    }

    setMsg("Compte créé. Confirmez votre adresse grâce à l’e-mail reçu, puis vous serez dirigé(e) vers les offres.");
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 560 }}>
          <h1>Créer un compte</h1>
          <p>Votre compte gratuit conserve votre accès au chapitre 1. Le paiement débloque ensuite la suite du voyage.</p>
          <form onSubmit={signup}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse e-mail" autoComplete="email" disabled={loading} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (6 caractères minimum)" autoComplete="new-password" disabled={loading} />
            <button type="submit" className="btn gold" disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</button>
          </form>
          {msg && <p role="alert">{msg}</p>}
          <p><Link href="/login?next=/offres">Déjà un compte ? Connexion</Link></p>
        </div>
      </div>
    </main>
  );
}

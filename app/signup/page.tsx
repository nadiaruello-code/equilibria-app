'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseBrowser';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function signup() {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(
      "✨ Votre espace a été créé ! Vérifiez votre boîte mail puis connectez-vous pour poursuivre votre voyage."
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 600 }}>

          <p className="kicker dark">
            ÉQUILIBRIA
          </p>

          <h1>Poursuivre mon voyage</h1>

          <p style={{ marginBottom: 30 }}>
            Vous avez découvert le premier chapitre.
            Créez gratuitement votre espace personnel afin de
            conserver votre progression et accéder à la suite du parcours.
          </p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choisissez un mot de passe"
          />

          <button
            className="btn gold"
            onClick={signup}
          >
            ✨ Créer mon espace gratuit
          </button>

          <p style={{ marginTop: 20 }}>
            {msg}
          </p>

          <p style={{ marginTop: 30 }}>
            <Link href="/login">
              J'ai déjà un compte
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}
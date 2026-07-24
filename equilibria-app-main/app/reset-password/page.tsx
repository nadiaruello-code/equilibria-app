'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseBrowser';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function reset() {
    setLoading(true);
    setMsg('');

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setMsg(
        '📩 Un email de réinitialisation vient de vous être envoyé. Pensez à vérifier vos courriers indésirables.'
      );
    }
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 560 }}>
          <h1>Mot de passe oublié</h1>

          <p style={{ marginBottom: 20 }}>
            Saisissez votre adresse e-mail. Vous recevrez un lien pour choisir un nouveau mot de passe.
          </p>

          <input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="btn gold"
            onClick={reset}
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>

          {msg && (
            <p style={{ marginTop: 20 }}>
              {msg}
            </p>
          )}

          <p style={{ marginTop: 20 }}>
            <Link href="/login">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

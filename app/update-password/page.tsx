'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setMessage(
          'Le lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien.'
        );
        setSessionValid(false);
      } else {
        setSessionValid(true);
      }

      setCheckingSession(false);
    }

    checkSession();
  }, []);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmation) {
      setMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(
        `Impossible de modifier le mot de passe : ${error.message}`
      );
      setLoading(false);
      return;
    }

    setMessage('Votre mot de passe a bien été modifié.');

    await supabase.auth.signOut();

    setTimeout(() => {
      router.replace('/login?password=updated');
    }, 1500);
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 560 }}>
          <h1>Nouveau mot de passe</h1>

          {checkingSession && (
            <p>Vérification du lien en cours...</p>
          )}

          {!checkingSession && sessionValid && (
            <>
              <p style={{ marginBottom: 20 }}>
                Choisissez votre nouveau mot de passe.
              </p>

              <form onSubmit={updatePassword}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="password"
                    style={{ display: 'block', marginBottom: 6 }}
                  >
                    Nouveau mot de passe
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="8 caractères minimum"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="confirmation"
                    style={{ display: 'block', marginBottom: 6 }}
                  >
                    Confirmer le mot de passe
                  </label>

                  <input
                    id="confirmation"
                    type="password"
                    value={confirmation}
                    onChange={(event) =>
                      setConfirmation(event.target.value)
                    }
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn gold"
                  disabled={loading}
                >
                  {loading
                    ? 'Modification en cours...'
                    : 'Modifier mon mot de passe'}
                </button>
              </form>
            </>
          )}

          {message && (
            <p style={{ marginTop: 20 }}>
              {message}
            </p>
          )}

          {!checkingSession && !sessionValid && (
            <p style={{ marginTop: 20 }}>
              <Link href="/reset-password">
                Demander un nouveau lien
              </Link>
            </p>
          )}

          <p style={{ marginTop: 20 }}>
            <Link href="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

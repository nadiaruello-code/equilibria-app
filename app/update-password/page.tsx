"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseBrowser";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setChecking(false);
      }
    });

    async function checkRecoverySession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Erreur de récupération de session :", error);
      }

      if (session) {
        setReady(true);
      }

      setChecking(false);
    }

    checkRecoverySession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Erreur de modification du mot de passe :", error);
      setLoading(false);

      if (
        error.message.toLowerCase().includes("session") ||
        error.message.toLowerCase().includes("expired")
      ) {
        setMessage(
          "Le lien de récupération est invalide ou a expiré. Demandez un nouveau lien."
        );
      } else {
        setMessage(`Impossible de modifier le mot de passe : ${error.message}`);
      }

      return;
    }

    setSuccess(true);
    setMessage(
      "Votre mot de passe a bien été modifié. Redirection vers la connexion..."
    );

    await supabase.auth.signOut();

    setTimeout(() => {
      window.location.href = "/login";
    }, 1800);
  }

  if (checking) {
    return (
      <main className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: 560 }}>
            <p>Vérification du lien de récupération...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: 560 }}>
            <h1>Lien invalide ou expiré</h1>

            <p>
              Ce lien de récupération n’est plus valide. Demandez un nouveau
              lien pour modifier votre mot de passe.
            </p>

            <p>
              <Link href="/reset-password">
                Demander un nouveau lien
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 560 }}>
          <h1>Choisir un nouveau mot de passe</h1>

          <form onSubmit={handleUpdatePassword}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
              disabled={loading || success}
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              disabled={loading || success}
            />

            <button
              type="submit"
              className="btn gold"
              disabled={loading || success}
            >
              {loading
                ? "Modification..."
                : success
                  ? "Mot de passe modifié"
                  : "Modifier mon mot de passe"}
            </button>
          </form>

          {message && (
            <p role="alert">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

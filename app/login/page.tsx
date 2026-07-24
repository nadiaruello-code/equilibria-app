"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseBrowser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMsg("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMsg("Merci de renseigner votre adresse e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Erreur de connexion Supabase :", error);

      if (error.message === "Invalid login credentials") {
        setMsg("Adresse e-mail ou mot de passe incorrect.");
      } else if (error.message.toLowerCase().includes("email not confirmed")) {
        setMsg(
          "Votre adresse e-mail n’a pas encore été confirmée. Vérifiez vos e-mails."
        );
      } else {
        setMsg(`Impossible de vous connecter : ${error.message}`);
      }

      return;
    }

    window.location.href = "/app";
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: 560 }}>
          <h1>Connexion</h1>

          <form onSubmit={login}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Adresse e-mail"
              autoComplete="email"
              disabled={loading}
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              disabled={loading}
            />

            <button
              type="submit"
              className="btn gold"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Me connecter"}
            </button>
          </form>

          {msg && <p role="alert">{msg}</p>}

          <p>
            <Link href="/signup">Créer un compte</Link>
            {" · "}
            <Link href="/reset-password">Mot de passe oublié</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

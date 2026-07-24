"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUpdatePassword = async () => {
    setMessage("")

    if (!password || password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      console.error("Erreur Supabase :", error)
      setMessage(`Erreur : ${error.message}`)
      return
    }

    await supabase.auth.signOut()

    setMessage(
      "Votre mot de passe a bien été modifié. Vous pouvez maintenant vous connecter."
    )

    setTimeout(() => {
      window.location.href = "/connexion"
    }, 1500)
  }

  if (!ready) {
    return (
      <main>
        <p>
          Le lien de récupération est invalide ou a expiré. Demandez un nouveau
          lien.
        </p>
      </main>
    )
  }

  return (
    <main>
      <h1>Choisir un nouveau mot de passe</h1>

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      <button onClick={handleUpdatePassword} disabled={loading}>
        {loading ? "Modification..." : "Modifier mon mot de passe"}
      </button>

      {message && <p>{message}</p>}
    </main>
  )
}

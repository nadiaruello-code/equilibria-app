"use client";

import { useState } from "react";
import Link from "next/link";

export default function Offres() {
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  async function checkout(plan: string) {
    setLoading(plan);
    setMessage("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    setLoading("");

    if (response.status === 401) {
      window.location.href = "/signup?next=/offres";
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMessage(data.error || "Une erreur est survenue avec le paiement.");
  }

  return (
    <main className="section">
      <div className="container">
        <p className="kicker dark">Après votre chapitre gratuit</p>
        <h1>Choisir son accès</h1>
        <p className="lead">Le chapitre 1 reste gratuit. Sélectionnez une formule pour poursuivre le voyage.</p>
        <div className="cards">
          <div className="card">
            <h3>Découverte</h3><div className="price">47 €</div><p>Accès aux jours 1 à 7, ouverts progressivement.</p>
            <button className="btn" disabled={!!loading} onClick={() => checkout("starter")}>{loading === "starter" ? "Ouverture..." : "Choisir Découverte"}</button>
          </div>
          <div className="card premium">
            <h3>Voyage Complet</h3><div className="price">197 €</div><p>Les 42 chapitres, ouverts au rythme d’un chapitre par jour.</p>
            <button className="btn gold" disabled={!!loading} onClick={() => checkout("premium")}>{loading === "premium" ? "Ouverture..." : "Débloquer le voyage"}</button>
          </div>
          <div className="card">
            <h3>Cercle</h3><div className="price">14,90 €/mois</div><p>Les 42 chapitres et les bonus du Cercle.</p>
            <button className="btn" disabled={!!loading} onClick={() => checkout("circle")}>{loading === "circle" ? "Ouverture..." : "Rejoindre le Cercle"}</button>
          </div>
        </div>
        {message && <p role="alert">{message}</p>}
        <p className="center"><Link href="/chapitre/1">Réécouter gratuitement le chapitre 1</Link></p>
      </div>
    </main>
  );
}

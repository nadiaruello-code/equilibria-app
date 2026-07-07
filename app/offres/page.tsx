'use client';
import { useState } from 'react';
export default function Offres() {
 const [loading,setLoading]=useState('');
 async function checkout(plan:string){setLoading(plan);const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})});const d=await r.json();if(d.url) location.href=d.url; else alert(d.error||'Erreur Stripe');setLoading('');}
 return <main className="section"><div className="container"><h1>Choisir son accès</h1><div className="cards">
  <div className="card"><h3>Découverte</h3><div className="price">47 €</div><p>Jours 1 à 7.</p><button className="btn" onClick={()=>checkout('starter')}>{loading==='starter'?'Patientez...':'Commencer'}</button></div>
  <div className="card premium"><h3>Voyage Complet</h3><div className="price">197 €</div><p>Jours 1 à 42.</p><button className="btn gold" onClick={()=>checkout('premium')}>{loading==='premium'?'Patientez...':'Débloquer tout'}</button></div>
  <div className="card"><h3>Cercle</h3><div className="price">14,90 €/mois</div><p>Tout + bonus mensuels.</p><button className="btn" onClick={()=>checkout('circle')}>{loading==='circle'?'Patientez...':'Rejoindre'}</button></div>
 </div></div></main>
}

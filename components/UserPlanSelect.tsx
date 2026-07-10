'use client';

import { useState } from 'react';

export default function UserPlanSelect({ userId, currentPlan }: { userId: string; currentPlan: string }) {
  const [plan, setPlan] = useState(currentPlan || 'starter');
  const [msg, setMsg] = useState('');

  async function save() {
    setMsg('Mise à jour...');
    const res = await fetch('/api/admin/update-user-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan })
    });

    const data = await res.json();
    setMsg(data.error || 'OK');
  }

  return (
    <div className="row">
      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="starter">starter — 47 €</option>
        <option value="premium">premium — 197 €</option>
        <option value="circle">circle — abonnement</option>
      </select>
      <button className="btn" onClick={save}>Changer</button>
      <span>{msg}</span>
    </div>
  );
}

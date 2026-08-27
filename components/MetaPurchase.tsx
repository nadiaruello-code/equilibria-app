'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type MetaPurchaseProps = {
  value: number;
  plan: string;
  sessionId: string;
};

export default function MetaPurchase({
  value,
  plan,
  sessionId,
}: MetaPurchaseProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.fbq !== 'function') return;
    if (!sessionId || value <= 0) return;

    // Évite de compter deux fois le même achat
    // si la personne recharge la page /merci.
    const storageKey = `meta_purchase_${sessionId}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    window.fbq(
      'track',
      'Purchase',
      {
        value,
        currency: 'EUR',
        content_name: `Equilibria - ${plan}`,
        content_type: 'product',
        content_ids: [plan],
      },
      {
        eventID: sessionId,
      }
    );

    sessionStorage.setItem(storageKey, 'sent');

    console.log('Meta Purchase envoyé', {
      value,
      plan,
      sessionId,
    });
  }, [value, plan, sessionId]);

  return null;
}
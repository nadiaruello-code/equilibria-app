'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function MetaPurchase({
  value,
  plan,
}: {
  value: number;
  plan: string;
}) {
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        value,
        currency: 'EUR',
        content_name: `Equilibria - ${plan}`,
      });
    }
  }, [value, plan]);

  return null;
}
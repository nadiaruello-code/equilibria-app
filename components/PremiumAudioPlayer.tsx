'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';

function fmt(s: number) {
  if (!Number.isFinite(s)) return '00:00';

  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);

  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export default function PremiumAudioPlayer({
  day,
  title,
}: {
  day: number;
  title: string;
}) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [url, setUrl] = useState('');
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [sleep, setSleep] = useState(0);

  // Permet d'afficher la suite dès que le chapitre 1 est réellement terminé
  const [chapter1Finished, setChapter1Finished] = useState(false);

  // Évite d'appeler Supabase à chaque pause / reprise
  const startTracked = useRef(false);

  const key = `equilibria-audio-position-${day}`;

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/audio-url?day=${day}`);
        const d = await r.json();

        if (!r.ok || !d.url) {
          throw new Error(
            d.error || 'L’audio de ce chapitre arrive bientôt.'
          );
        }

        setUrl(d.url);
        setFile(d.file || '');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [day]);

  /*
   * Enregistre automatiquement le lancement du chapitre 1.
   * Uniquement pour les utilisateurs connectés.
   */
  async function trackChapter1Started() {
    if (day !== 1 || startTracked.current) return;

    startTracked.current = true;

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from('profiles')
        .update({
          chapter1_started_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .is('chapter1_started_at', null);
    } catch (e) {
      console.error('Erreur suivi démarrage chapitre 1 :', e);
    }
  }

  /*
   * Enregistre automatiquement la fin réelle du chapitre 1.
   */
  async function trackChapter1Completed() {
    if (day !== 1) return;

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const now = new Date().toISOString();

      // Enregistre la date de fin dans profiles
      await supabase
        .from('profiles')
        .update({
          chapter1_completed_at: now,
        })
        .eq('id', user.id)
        .is('chapter1_completed_at', null);

      // Marque aussi automatiquement le chapitre 1 comme terminé
      await supabase
        .from('progress')
        .upsert(
          {
            user_id: user.id,
            chapter_day: 1,
            completed: true,
            updated_at: now,
          },
          {
            onConflict: 'user_id,chapter_day',
          }
        );

      setChapter1Finished(true);

// Vérifie si l'email de fin du chapitre 1 a déjà été envoyé
const { data: profileData } = await supabase
  .from('profiles')
  .select('chapter1_email_sent_at')
  .eq('id', user.id)
  .single();

if (!profileData?.chapter1_email_sent_at && user.email) {
  try {
    const response = await fetch('/api/send-chapter1-completed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
      }),
    });

    // On enregistre la date uniquement si Brevo a bien accepté l'email
    if (response.ok) {
      await supabase
        .from('profiles')
        .update({
          chapter1_email_sent_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }
  } catch (error) {
    console.error(
      'Erreur envoi email fin chapitre 1 :',
      error
    );
  }
}
    } catch (e) {
      console.error('Erreur suivi fin chapitre 1 :', e);
    }
  }

  useEffect(() => {
    const a = ref.current;

    if (!a || !url) return;

    const saved = Number(localStorage.getItem(key) || '0');

    const meta = () => {
      setDuration(a.duration || 0);

      if (saved > 0 && saved < a.duration - 5) {
        a.currentTime = saved;
        setCurrent(saved);
      }
    };

    const time = () => {
      setCurrent(a.currentTime);

      if (Math.floor(a.currentTime) % 5 === 0) {
        localStorage.setItem(key, String(a.currentTime));
      }
    };

    const end = async () => {
      setPlaying(false);
      localStorage.removeItem(key);

      // L'audio est réellement arrivé à sa fin
      await trackChapter1Completed();
    };

    a.addEventListener('loadedmetadata', meta);
    a.addEventListener('timeupdate', time);
    a.addEventListener('ended', end);

    return () => {
      a.removeEventListener('loadedmetadata', meta);
      a.removeEventListener('timeupdate', time);
      a.removeEventListener('ended', end);
    };
  }, [url, key, day]);

  async function toggle() {
    const a = ref.current;

    if (!a) return;

    if (a.paused) {
      await a.play();
      setPlaying(true);

      // Le suivi se déclenche au vrai clic sur Play
      await trackChapter1Started();
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  function jump(n: number) {
    const a = ref.current;

    if (!a) return;

    const x = Math.max(
      0,
      Math.min(a.duration || 0, a.currentTime + n)
    );

    a.currentTime = x;
    setCurrent(x);
  }

  function seek(x: number) {
    const a = ref.current;

    if (!a) return;

    a.currentTime = x;
    setCurrent(x);
  }

  function rate(x: number) {
    const a = ref.current;

    if (!a) return;

    a.playbackRate = x;
    setSpeed(x);
  }

  function setTimer(m: number) {
    if (timer.current) clearTimeout(timer.current);

    setSleep(m);

    if (!m) return;

    timer.current = setTimeout(() => {
      ref.current?.pause();
      setPlaying(false);
      setSleep(0);
    }, m * 60000);
  }

  if (loading) {
    return (
      <div className="premiumPlayer loadingPlayer">
        <div className="playerPulse" />
        <p>Préparation de l’immersion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premiumPlayer unavailablePlayer">
        <p className="playerEyebrow">IMMERSION AUDIO</p>
        <h3>Le silence fait aussi partie du voyage.</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <section className="premiumPlayer">
        <audio ref={ref} src={url} preload="metadata" />

        <div className="playerTopline">
          <div>
            <p className="playerEyebrow">IMMERSION AUDIO</p>
            <h3>{title}</h3>
          </div>

          <div className="playerFile">
            {file.includes('.m4a') ? 'M4A' : 'MP3'}
          </div>
        </div>

        <div className="playerMainControls">
          <button
            className="playerRoundButton secondary"
            onClick={() => jump(-15)}
          >
            −15
          </button>

          <button
            className="playerRoundButton primary"
            onClick={toggle}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>

          <button
            className="playerRoundButton secondary"
            onClick={() => jump(15)}
          >
            +15
          </button>
        </div>

        <div className="playerTimeline">
          <span>{fmt(current)}</span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
          />

          <span>{fmt(duration)}</span>
        </div>

        <div className="playerOptions">
          <div className="speedControls">
            <span>Vitesse</span>

            {[0.75, 1, 1.25, 1.5].map((v) => (
              <button
                key={v}
                className={speed === v ? 'active' : ''}
                onClick={() => rate(v)}
              >
                {v}×
              </button>
            ))}
          </div>

          <div className="sleepControls">
            <label>Minuteur</label>

            <select
              value={sleep}
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              <option value={0}>Désactivé</option>
              <option value={10}>10 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
            </select>
          </div>
        </div>

        <p className="playerHint">
          Votre position est mémorisée automatiquement.
        </p>
      </section>

      {day === 1 && chapter1Finished && (
        <div
          style={{
            marginTop: 28,
            padding: '30px 24px',
            textAlign: 'center',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.85)',
          }}
        >
          <p style={{ fontSize: '2rem', margin: 0 }}>🗝️</p>

          <p className="kicker dark">VOTRE PROCHAINE ÉTAPE</p>

          <h2>Jour 2 — La clé du Refuge</h2>

          <p style={{ maxWidth: 560, margin: '15px auto 24px' }}>
            Le Refuge n’était que le commencement.
            Une nouvelle étape vous attend pour ouvrir ce qui,
            jusqu’ici, était resté fermé.
          </p>

          <p>
            <strong>Lumen vous attend pour continuer le voyage.</strong>
          </p>

          <a className="btn gold" href="/offres">
            Débloquer la suite du voyage →
          </a>
        </div>
      )}
    </>
  );
}
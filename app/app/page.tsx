import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

import { createServerSupabaseClient } from '@/lib/supabaseServer';
import {
  getNextUnlockDate,
  getPlanLimit,
  getUnlockedDay,
  normalizePlan,
} from '@/lib/dailyAccess';

import ChapterCard from '@/components/ChapterCard';
import JourneyProgress from '@/components/JourneyProgress';
import SymbolCircle from '@/components/SymbolCircle';

const TOTAL_CHAPTERS = 42;

type Chapter = {
  id?: string | number;
  day: number;
  title: string;
  quote?: string;
  symbol?: string;
  audio?: string;
  [key: string]: unknown;
};

type ProgressRow = {
  chapter_day: number;
  completed: boolean;
};

async function getFallbackChapters(): Promise<Chapter[]> {
  const filePath = path.join(
    process.cwd(),
    'public',
    'data',
    'chapters.json'
  );

  const fileContent = await fs.readFile(filePath, 'utf-8');

  return JSON.parse(fileContent) as Chapter[];
}

function formatUnlockDate(date: Date | null) {
  if (!date) {
    return 'Reviens demain.';
  }

  return `Ouverture le ${new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)}.`;
}

function getPlanName(plan: string) {
  switch (plan) {
    case 'free':
      return 'Découverte gratuite';

    case 'starter':
      return 'Voyage 7 jours';

    case 'premium':
      return 'Voyage complet';

    case 'circle':
      return 'Cercle Equilibria';

    default:
      return 'Découverte gratuite';
  }
}

export default async function AppPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  /*
   * Récupération ou création du profil utilisateur.
   */
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  let profile = existingProfile;

  if (!profile) {
    const startedAt = new Date().toISOString();

    const { data: createdProfile, error: createProfileError } =
      await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          plan: 'free',
          started_at: startedAt,
        })
        .select('*')
        .single();

    if (createProfileError || !createdProfile) {
      console.error(
        'Erreur lors de la création du profil :',
        createProfileError
      );

      redirect('/login');
    }

    profile = createdProfile;
  }

  /*
   * Sécurité supplémentaire pour les anciens profils qui
   * n'auraient pas encore de date de démarrage.
   */
  if (!profile.started_at) {
    const startedAt = new Date().toISOString();

    const { data: updatedProfile } = await supabase
      .from('profiles')
      .update({
        started_at: startedAt,
      })
      .eq('id', user.id)
      .select('*')
      .single();

    profile =
      updatedProfile ?? {
        ...profile,
        started_at: startedAt,
      };
  }

  /*
   * Calcul des accès selon le plan et le nombre de jours écoulés.
   */
  const plan = normalizePlan(profile.plan);
  const planName = getPlanName(plan);
  const planLimit = getPlanLimit(plan);

  const unlockedDay = Math.min(
    getUnlockedDay(profile.started_at, plan),
    planLimit,
    TOTAL_CHAPTERS
  );

  const nextUnlockDate =
    unlockedDay < planLimit
      ? getNextUnlockDate(profile.started_at, unlockedDay)
      : null;

  const unlockLabel = formatUnlockDate(nextUnlockDate);

  /*
   * Récupération des chapitres.
   * Si la base ne contient pas les 42 chapitres,
   * le fichier JSON local est utilisé.
   */
  const { data: dbChapters } = await supabase
    .from('chapters')
    .select('*')
    .order('day', {
      ascending: true,
    });

  const chapters: Chapter[] =
    dbChapters && dbChapters.length === TOTAL_CHAPTERS
      ? (dbChapters as Chapter[])
      : await getFallbackChapters();

  /*
   * Récupération de la progression de l'utilisateur.
   */
  const { data: progressRows } = await supabase
    .from('progress')
    .select('chapter_day, completed')
    .eq('user_id', user.id);

  const completedDays = Array.from(
    new Set(
      ((progressRows ?? []) as ProgressRow[])
        .filter((progress) => progress.completed)
        .map((progress) => Number(progress.chapter_day))
        .filter(
          (chapterDay) =>
            Number.isInteger(chapterDay) &&
            chapterDay >= 1 &&
            chapterDay <= TOTAL_CHAPTERS
        )
    )
  ).sort((firstDay, secondDay) => firstDay - secondDay);

  const completedChapters = completedDays.length;

  /*
   * Le chapitre actuel correspond au premier chapitre ouvert
   * qui n'a pas encore été terminé.
   */
  const firstIncompleteUnlockedChapter = chapters.find(
    (chapter) =>
      chapter.day <= unlockedDay &&
      !completedDays.includes(chapter.day)
  );

  const currentChapter =
    firstIncompleteUnlockedChapter?.day ??
    Math.min(unlockedDay + 1, TOTAL_CHAPTERS);

  const remainingChapters = Math.max(
    TOTAL_CHAPTERS - completedChapters,
    0
  );

  return (
    <main className="container appShell">
      <aside className="side">
        <div className="brand">EQUILIBRIA</div>

        <div className="sideIntro">
          <p className="sideEyebrow">Ton espace intérieur</p>

          <h2>Lumen vous attend</h2>

          <p className="sideWelcome">
            Avancez à votre rythme, une étape après l’autre.
          </p>
        </div>

        <div className="sideProfile">
          <span className="sideProfileLabel">Votre compte</span>

          <strong>{user.email}</strong>
        </div>

        <div className="sidePlan">
          <span className="sidePlanLabel">Votre formule</span>

          <strong>{planName}</strong>

          <span>
            {plan === 'free'
  ? '3 premiers chapitres offerts'
  : plan === 'starter'
    ? 'Accès aux 7 premiers chapitres'
    : 'Accès aux 42 chapitres'}
          </span>
        </div>

        <div className="sideStats">
          <div className="sideStat">
            <strong>{completedChapters}</strong>
            <span>chapitres parcourus</span>
          </div>

          <div className="sideStat">
            <strong>{remainingChapters}</strong>
            <span>chapitres restants</span>
          </div>
        </div>

        <div className="sideCurrentDay">
          <span>Ouvert aujourd’hui</span>

          <strong>
            Jour {Math.min(unlockedDay, TOTAL_CHAPTERS)}
          </strong>
        </div>

        {nextUnlockDate && (
          <div className="nextUnlockPanel">
            <span className="nextUnlockIcon" aria-hidden="true">
              ✦
            </span>

            <div>
              <strong>Prochain chapitre</strong>
              <span>{unlockLabel}</span>
            </div>
          </div>
        )}

        <div className="sideSymbols">
          <p className="sideSectionTitle">
            Les lumières de votre voyage
          </p>

          <SymbolCircle
            completedDays={completedDays}
            chapters={chapters.slice(0, unlockedDay)}
          />
        </div>

        <form
          className="signoutForm"
          action="/auth/signout"
          method="post"
        >
          <button className="btn signoutButton" type="submit">
            Déconnexion
          </button>
        </form>
      </aside>

      <section className="journeyContent">
        <header className="journeyHeader">
          <div>
            <p className="journeyEyebrow">
              Votre parcours Equilibria
            </p>

            <h1>Le Voyage</h1>

            <p className="journeyIntroduction">
              Chaque chapitre est une invitation à ralentir, à
              ressentir et à vous rapprocher doucement de vous-même.
            </p>
          </div>

          <div className="journeyChapterIndicator">
            <span>Étape actuelle</span>

            <strong>
              {completedChapters >= TOTAL_CHAPTERS
                ? 'Voyage accompli'
                : `Chapitre ${currentChapter}`}
            </strong>
          </div>
        </header>

        <JourneyProgress
  completedChapters={completedChapters}
  totalChapters={TOTAL_CHAPTERS}
  currentChapter={currentChapter}
/>

<section className="safety-section">
  <div className="safety-card">
    <span className="safety-icon" aria-hidden="true">
      🌿
    </span>

    <h2>Equilibria est-il fait pour moi ?</h2>

    <p>
      Equilibria est un programme de bien-être et de relaxation conçu
      pour vous offrir un temps de pause, d'écoute et de reconnexion
      à vous-même.
    </p>

    <p>
      Il peut être utilisé de manière autonome et ne nécessite pas
      d'être déjà accompagné par un professionnel.
    </p>

    <div className="safety-notice">
      <strong>À savoir avant de commencer</strong>

      <p>
        Equilibria ne remplace pas une consultation ou une prise en
        charge médicale, psychologique ou psychiatrique.
      </p>

      <p>
        Si vous traversez une période de grande détresse, une crise
        psychique aiguë, ou si une séance provoque un malaise important
        ou des émotions difficiles à gérer, interrompez l'écoute et
        rapprochez-vous d'un professionnel de santé.
      </p>
    </div>

    <p className="safety-small">
      🎧 Écoutez les séances dans un endroit calme et sécurisé.
      N'utilisez pas Equilibria en conduisant ou pendant une activité
      nécessitant votre vigilance. Vous pouvez interrompre une séance
      à tout moment.
    </p>
  </div>
</section>



        <div className="chaptersHeading">
          <div>
            <p className="chaptersEyebrow">Les 42 étapes</p>
            <h2>Explorez votre chemin intérieur</h2>
          </div>

          <span className="chaptersCount">
            {completedChapters}/{TOTAL_CHAPTERS}
          </span>
        </div>

        <div className="chapterGrid">
          {chapters.map((chapter) => {
            const planLocked = chapter.day > planLimit;

            const timeLocked =
              !planLocked && chapter.day > unlockedDay;

            const completed = completedDays.includes(chapter.day);

            return (
              <ChapterCard
                key={chapter.id ?? chapter.day}
                chapter={chapter}
                planLocked={planLocked}
                timeLocked={timeLocked}
                completed={completed}
                unlockLabel={
                  timeLocked
                    ? unlockLabel
                    : undefined
                }
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
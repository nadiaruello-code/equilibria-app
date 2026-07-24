import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import {
  canAccessChapter,
  getPlanLimit,
  getUnlockedDay,
  normalizePlan,
} from "@/lib/dailyAccess";
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer";
import LumenPresence from "@/components/LumenPresence";
import ChapterActions from "@/components/ChapterActions";

async function fallbackChapter(day: number) {
  const all = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "public/data/chapters.json"),
      "utf-8"
    )
  );

  return all.find((chapter: any) => chapter.day === day);
}

export default async function ChapterPage({
  params,
}: {
  params: { day: string };
}) {
  const day = Number(params.day);

  if (!Number.isInteger(day) || day < 1 || day > 42) {
    redirect("/app");
  }

  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * Le chapitre 1 est public.
   * Tous les autres chapitres nécessitent une connexion.
   */
  if (!user && day !== 1) {
    redirect("/login");
  }

  let profile: any = null;
  let progress: any = null;

  /*
   * Les contrôles liés au compte, au plan et au déblocage quotidien
   * ne sont exécutés que pour un utilisateur connecté.
   */
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData;

    const plan = normalizePlan(profile?.plan);
    const planLimit = getPlanLimit(plan);
    const unlockedDay = getUnlockedDay(profile?.started_at, plan);

    if (day > planLimit) {
      redirect("/offres");
    }

    if (!canAccessChapter(day, profile?.started_at, plan)) {
      redirect(`/app?locked=${day}&available=${unlockedDay}`);
    }

    const { data: progressData } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("chapter_day", day)
      .single();

    progress = progressData;
  }

  const { data: dbChapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("day", day)
    .single();

  const chapter =
    dbChapter?.place && dbChapter?.symbol && dbChapter?.quote
      ? dbChapter
      : await fallbackChapter(day);

  if (!chapter) {
    redirect(user ? "/app" : "/");
  }

  return (
    <main className="chapterExperience">
      <div className="chapterBackdrop" />

      <div className="container chapterExperienceInner">
        <Link className="chapterBackLink" href={user ? "/app" : "/"}>
          ← {user ? "Retour au voyage" : "Retour à l’accueil"}
        </Link>

        <div className="chapterHeader">
          <div>
            <p className="kicker">Chapitre {chapter.day}</p>

            <div className="bigSymbol">{chapter.emoji || "✦"}</div>

            <p className="chapterLocation">{chapter.place}</p>

            <h1>{chapter.title}</h1>

            <p className="chapterArtifact">
              Symbole · {chapter.symbol}
            </p>
          </div>

          <LumenPresence quote={chapter.quote} />
        </div>

        <PremiumAudioPlayer day={day} title={chapter.title} />

        <section className="chapterReading">
          <p className="kicker dark">LE CHAPITRE</p>

          <h2>Lire et intégrer</h2>

          <p>{chapter.text_content}</p>

          {user && (
            <ChapterActions
              day={day}
              initialCompleted={Boolean(progress?.completed)}
              initialJournal={progress?.journal || ""}
            />
          )}

          {!user && day === 1 && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <p>
                Le premier chapitre est accessible librement, sans compte.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
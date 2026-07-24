"use client";

import { useState } from "react";
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer";
import ChapterOneSignup from "@/components/ChapterOneSignup";

export default function ChapterOneCompletion({ title, isLoggedIn }: { title: string; isLoggedIn: boolean }) {
  const [completed, setCompleted] = useState(false);

  return (
    <>
      <PremiumAudioPlayer day={1} title={title} onEnded={() => setCompleted(true)} />
      {!completed && (
        <button className="btn gold chapter-finish-button" type="button" onClick={() => setCompleted(true)}>
          J’ai terminé ce premier chapitre
        </button>
      )}
      {completed && <ChapterOneSignup isLoggedIn={isLoggedIn} />}
    </>
  );
}

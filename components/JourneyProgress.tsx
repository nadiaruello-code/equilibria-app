type JourneyProgressProps = {
  completedChapters: number;
  totalChapters?: number;
  currentChapter?: number;
};

export default function JourneyProgress({
  completedChapters,
  totalChapters = 42,
  currentChapter,
}: JourneyProgressProps) {
  const safeCompleted = Math.min(
    Math.max(completedChapters, 0),
    totalChapters
  );

  const progress = Math.round((safeCompleted / totalChapters) * 100);

  const nextChapter =
    safeCompleted < totalChapters ? safeCompleted + 1 : totalChapters;

  return (
    <section
      className="journey-progress"
      aria-label="Progression dans le parcours Equilibria"
    >
      <div className="journey-progress__glow" />

      <div className="journey-progress__content">
        <div className="journey-progress__top">
          <div>
            <p className="journey-progress__eyebrow">
              Ton voyage intérieur
            </p>

            <h2 className="journey-progress__title">
              Continue à avancer, un chapitre après l’autre
            </h2>

            <p className="journey-progress__description">
              Chaque étape parcourue devient une nouvelle lumière sur ton
              chemin.
            </p>
          </div>

          <div className="journey-progress__percentage">
            <span>{progress}</span>
            <small>%</small>
          </div>
        </div>

        <div className="journey-progress__bar-wrapper">
          <div
            className="journey-progress__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalChapters}
            aria-valuenow={safeCompleted}
            aria-label={`${safeCompleted} chapitres terminés sur ${totalChapters}`}
          >
            <div
              className="journey-progress__fill"
              style={{ width: `${progress}%` }}
            >
              {progress > 2 && (
                <span className="journey-progress__light" />
              )}
            </div>
          </div>
        </div>

        <div className="journey-progress__bottom">
          <div className="journey-progress__stat">
            <span className="journey-progress__stat-value">
              {safeCompleted}
            </span>

            <span className="journey-progress__stat-label">
              chapitres parcourus
            </span>
          </div>

          <div className="journey-progress__separator" />

          <div className="journey-progress__stat">
            <span className="journey-progress__stat-value">
              {totalChapters - safeCompleted}
            </span>

            <span className="journey-progress__stat-label">
              chapitres à découvrir
            </span>
          </div>

          <div className="journey-progress__next">
            {safeCompleted >= totalChapters ? (
              <>
                <span className="journey-progress__next-icon">✦</span>

                <span>
                  <strong>Voyage accompli</strong>
                  Tu as parcouru les 42 chapitres
                </span>
              </>
            ) : (
              <>
                <span className="journey-progress__next-icon">→</span>

                <span>
                  <strong>
                    {currentChapter
                      ? `Tu explores le chapitre ${currentChapter}`
                      : `Prochaine étape : chapitre ${nextChapter}`}
                  </strong>

                  Le voyage continue
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
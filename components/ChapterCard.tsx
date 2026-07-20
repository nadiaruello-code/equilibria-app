import Link from 'next/link';

export default function ChapterCard({
  chapter, planLocked, timeLocked, completed, unlockLabel
}: {
  chapter:any; planLocked:boolean; timeLocked:boolean; completed:boolean; unlockLabel?:string;
}) {
  const locked = planLocked || timeLocked;
  return <article className={`chapterCard ${locked ? 'locked' : ''}`}>
    <div>
      <span className="badge">Jour {chapter.day} {locked ? '🔒' : completed ? '✓' : '🔓'}</span>
      <div className="symbol">{chapter.emoji || '✦'}</div>
      <p className="chapterPlace">{chapter.place}</p>
      <h3>{chapter.title}</h3>
      <p className="chapterSymbol">Symbole · {chapter.symbol}</p>
    </div>
    <div>
      <p className="chapterQuote">« {chapter.quote} »</p>
      {planLocked ? <Link className="btn gold" href="/offres">Débloquer l’accès</Link>
      : timeLocked ? <div className="dailyLockMessage"><strong>Ce chapitre n’est pas encore ouvert.</strong><span>{unlockLabel || 'Reviens demain.'}</span></div>
      : <Link className="btn gold" href={`/chapitre/${chapter.day}`}>Entrer dans ce lieu</Link>}
    </div>
  </article>;
}

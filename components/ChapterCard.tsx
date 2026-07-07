import Link from 'next/link';
export default function ChapterCard({ chapter, locked, completed }: { chapter:any, locked:boolean, completed:boolean }) {
  return <div className={`chapterCard ${locked ? 'locked' : ''}`}>
    <div><span className="badge">Jour {chapter.day} {locked ? '🔒' : completed ? '✓' : '🔓'}</span><div className="symbol">{chapter.emoji || '✦'}</div><h3>{chapter.title}</h3><p>{chapter.place} · {chapter.symbol}</p></div>
    <div><p>« {chapter.quote} »</p>{locked ? <Link className="btn gold" href="/offres">Débloquer</Link> : <Link className="btn gold" href={`/chapitre/${chapter.day}`}>Entrer</Link>}</div>
  </div>
}

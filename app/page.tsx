import Image from 'next/image';
import Link from 'next/link';

const benefits = [
  ['10 min', 'par jour, à votre rythme'],
  ['42', 'chapitres comme un voyage'],
  ['1er', 'chapitre à écouter gratuitement'],
];

const symbols = [
  ['🏮', 'La lanterne', 'Retrouver le chemin'],
  ['🗝️', 'La clé', 'Ouvrir le refuge intérieur'],
  ['🪶', 'La plume', 'Revenir au souffle'],
  ['🌱', 'La graine', 'Faire grandir le calme'],
];

export default function Home() {
  return (
    <>
      <nav className="nav homeNav">
        <div className="container navin">
          <Link className="brand" href="/">EQUILIBRIA</Link>
          <div className="row navActions">
            <Link className="btn ghost" href="/login">Connexion</Link>
            <Link className="btn gold" href="/offres">Commencer</Link>
          </div>
        </div>
      </nav>

      <header className="hero conversionHero">
        <div className="container conversionHeroGrid">
          <div className="heroCopy">
            <p className="kicker">Lumen · roman sonore · hypnose immersive</p>
            <h1>Retrouvez un mental plus calme, 10 minutes par jour.</h1>
            <p className="lead">
              Une expérience audio immersive en 42 chapitres, guidée par Lumen,
              pour ralentir, souffler et retrouver votre équilibre intérieur.
            </p>
            <div className="heroButtons">
              <Link className="btn gold btnLarge" href="/chapitre/1">
                <span aria-hidden>🎧</span> Écouter gratuitement le chapitre 1
              </Link>
              <Link className="textLink" href="/offres">Découvrir les formules →</Link>
            </div>
            <div className="heroTrust">
              <span>Sans carte bancaire</span>
              <span>Écoute immédiate</span>
              <span>Sur téléphone, tablette ou ordinateur</span>
            </div>
          </div>

          <div className="heroVisual" aria-hidden="true">
            <div className="heroOrb"><span>E</span></div>
            <div className="audioPreviewCard">
              <span className="previewEyebrow">Votre première étape</span>
              <strong>Chapitre 1 · Le Refuge</strong>
              <div className="previewLine"><i /><i /><i /><i /><i /><i /></div>
              <small>Un espace pour respirer et revenir à vous.</small>
            </div>
          </div>
        </div>
      </header>

      <section className="benefitStrip">
        <div className="container benefitStripGrid">
          {benefits.map(([number, label]) => (
            <div className="benefitMini" key={number}>
              <strong>{number}</strong><span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section whySection">
        <div className="container center narrow">
          <p className="kicker dark">Pour les journées qui débordent</p>
          <h2>Quand votre tête ne s’arrête plus, vous n’avez pas besoin d’en faire davantage.</h2>
          <p className="sectionLead">
            Equilibria vous offre un rendez-vous court et guidé pour relâcher la pression,
            retrouver votre souffle et avancer progressivement, sans injonction ni culpabilité.
          </p>
        </div>
        <div className="container cards conversionCards">
          <div className="card conversionCard"><span>🌿</span><h3>Ralentir</h3><p>Créer une pause quand tout va trop vite.</p></div>
          <div className="card conversionCard"><span>🌙</span><h3>Apaiser</h3><p>Revenir vers davantage de calme et de sécurité intérieure.</p></div>
          <div className="card conversionCard"><span>✨</span><h3>Transformer</h3><p>Installer de petits repères durables au fil des chapitres.</p></div>
        </div>
      </section>

      <section className="section founderSection">
        <div className="container founderGrid">
          <div className="founderPhotoWrap">
            <Image
              src="/nadia-ruello.jpg"
              alt="Nadia Ruello, hypnothérapeute et créatrice d’Equilibria"
              width={768}
              height={1152}
              className="founderPhoto"
              priority={false}
            />
            <div className="founderBadge">Créé avec douceur<br />par une hypnothérapeute</div>
          </div>
          <div className="founderCopy">
            <p className="kicker dark">Une voix, une présence, un véritable fil conducteur</p>
            <h2>Je suis Nadia Ruello, créatrice d’Equilibria.</h2>
            <p>
              J’ai imaginé ce voyage pour les personnes qui portent beaucoup, pensent sans arrêt
              et ont besoin de retrouver un espace à elles. Chaque chapitre mêle récit, respiration,
              visualisation et hypnose douce pour vous accompagner pas à pas.
            </p>
            <p className="founderQuote">« Vous n’avez pas à réussir la séance. Vous avez simplement à vous laisser guider. »</p>
            <Link className="btn sageBtn" href="/chapitre/1">Entendre ma voix gratuitement</Link>
          </div>
        </div>
      </section>

      <section className="section experienceSection">
        <div className="container experienceGrid">
          <div>
            <p className="kicker dark">Une expérience différente</p>
            <h2>Ce n’est pas une simple série d’hypnoses.</h2>
            <p className="sectionLead leftLead">
              Vous entrez dans un univers sonore construit comme une histoire. Lumen vous guide,
              un chapitre après l’autre, et chaque symbole devient une ressource intérieure.
            </p>
            <Link className="textLink darkLink" href="/offres">Voir tout le parcours →</Link>
          </div>
          <div className="featureStack">
            <div className="featurePanel"><span>📖</span><div><h3>Un roman sonore immersif</h3><p>42 chapitres reliés par une histoire et une progression.</p></div></div>
            <div className="featurePanel"><span>🎧</span><div><h3>Une écoute simple</h3><p>Vos séances accessibles depuis votre espace personnel.</p></div></div>
            <div className="featurePanel"><span>🌿</span><div><h3>À votre rythme</h3><p>Une parenthèse courte, où que vous soyez.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section symbolSection">
        <div className="container symbolHeader center narrow">
          <p className="kicker dark">Le Cercle des Symboles</p>
          <h2>Chaque étape laisse une trace.</h2>
          <p className="sectionLead">À chaque chapitre terminé, un symbole rejoint votre cercle et vous rappelle le chemin parcouru.</p>
        </div>
        <div className="container symbolShowcase premiumSymbols">
          {symbols.map(([emoji, name, text]) => (
            <div className="symbolItem" key={name}>
              <span>{emoji}</span><div><strong>{name}</strong><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reassuranceSection">
        <div className="container reassuranceBox">
          <div>
            <p className="kicker">Commencez sans pression</p>
            <h2>Écoutez d’abord. Décidez ensuite.</h2>
            <p>Le chapitre 1 est accessible gratuitement pour découvrir l’univers, Lumen et la voix qui vous accompagnera.</p>
          </div>
          <Link className="btn gold btnLarge" href="/chapitre/1">🎧 Lancer le chapitre gratuit</Link>
        </div>
      </section>

      <footer className="homeFooter">
        <div className="container footerGrid">
          <div><div className="brand">EQUILIBRIA</div><p>Le voyage audio qui vous reconnecte à l’essentiel.</p></div>
          <div><Link href="/offres">Les offres</Link><Link href="/login">Connexion</Link><Link href="/signup">Créer un compte</Link></div>
          <div><small>Les contenus proposés relèvent du bien-être et ne remplacent pas un avis ou un suivi médical.</small></div>
        </div>
      </footer>
    </>
  );
}

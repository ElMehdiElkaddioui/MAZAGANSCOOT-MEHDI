// Landing page sections
import { useState as useStateL, useEffect as useEffectL, useRef as useRefL } from 'react';
import { Icon, Counter, ScooterSVG } from './ui.jsx';
import { SmartMap, STATIONS } from './map.jsx';

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRefL();
  const [seen, setSeen] = useStateL(false);
  useEffectL(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setSeen(true), delay); io.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={'reveal ' + (seen ? 'in' : '')}>{children}</div>;
};

const RiderScene = () => (
  <svg viewBox="0 0 280 360" fill="none" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="bg-glow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c5ff3a" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#c5ff3a" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="rider-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a3f48"/>
        <stop offset="100%" stopColor="#14181f"/>
      </linearGradient>
    </defs>
    {/* glow under wheels */}
    <ellipse cx="140" cy="320" rx="100" ry="14" fill="url(#bg-glow)"/>
    {/* motion blur streaks */}
    <g opacity="0.4">
      <line x1="20" y1="280" x2="80" y2="282" stroke="#c5ff3a" strokeWidth="1"/>
      <line x1="30" y1="290" x2="100" y2="292" stroke="#c5ff3a" strokeWidth="0.6"/>
      <line x1="10" y1="300" x2="60" y2="301" stroke="#6fe8ff" strokeWidth="0.6"/>
    </g>
    {/* shadow */}
    <ellipse cx="140" cy="318" rx="80" ry="6" fill="rgba(0,0,0,0.4)"/>
    {/* rear wheel */}
    <circle cx="80" cy="290" r="28" fill="#0a0e13" stroke="#2a2f38" strokeWidth="2"/>
    <circle cx="80" cy="290" r="22" fill="none" stroke="#1d2128" strokeWidth="1"/>
    <circle cx="80" cy="290" r="6" fill="#2a2f38"/>
    {/* deck */}
    <rect x="86" y="270" width="120" height="10" rx="3" fill="#1d2128" stroke="#2a2f38"/>
    {/* battery strip on deck */}
    <rect x="92" y="272" width="80" height="2" fill="#c5ff3a" opacity="0.8"/>
    {/* stem */}
    <path d="M200 280 L 218 130" stroke="#2a2f38" strokeWidth="5" strokeLinecap="round"/>
    {/* handlebar */}
    <path d="M200 130 L 240 130" stroke="#c5ff3a" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="200" cy="130" r="4" fill="#c5ff3a"/>
    <circle cx="240" cy="130" r="4" fill="#c5ff3a"/>
    {/* display */}
    <rect x="212" y="142" width="14" height="10" rx="2" fill="#0e1116" stroke="#c5ff3a" strokeWidth="0.8"/>
    {/* front wheel */}
    <circle cx="218" cy="290" r="28" fill="#0a0e13" stroke="#2a2f38" strokeWidth="2"/>
    <circle cx="218" cy="290" r="22" fill="none" stroke="#1d2128" strokeWidth="1"/>
    <circle cx="218" cy="290" r="6" fill="#2a2f38"/>
    {/* fender */}
    <path d="M196 290 a22 22 0 0 1 44 0" stroke="#2a2f38" strokeWidth="2" fill="none"/>
    {/* RIDER */}
    {/* helmet */}
    <ellipse cx="148" cy="60" rx="22" ry="20" fill="url(#rider-body)" stroke="#0a0e13" strokeWidth="1"/>
    <path d="M126 56 q22 -28 44 0" fill="#1d2128"/>
    {/* visor */}
    <path d="M132 58 q16 -8 32 0 l-2 8 q-14 -6 -28 0 z" fill="#6fe8ff" opacity="0.4"/>
    <path d="M132 58 q16 -8 32 0" stroke="#6fe8ff" strokeWidth="0.8" fill="none"/>
    {/* neck */}
    <rect x="142" y="76" width="12" height="10" fill="#3a3f48"/>
    {/* torso (jacket) */}
    <path d="M120 86 L 176 86 L 184 170 Q 148 180 112 170 Z" fill="url(#rider-body)" stroke="#2a2f38" strokeWidth="1"/>
    {/* reflective stripe */}
    <path d="M118 130 L 178 130" stroke="#c5ff3a" strokeWidth="2.5" opacity="0.85"/>
    <path d="M118 138 L 178 138" stroke="#c5ff3a" strokeWidth="1" opacity="0.4"/>
    {/* arm front (left arm visible) */}
    <path d="M168 100 Q 200 110 218 130" stroke="#2a2f38" strokeWidth="14" strokeLinecap="round" fill="none"/>
    <path d="M168 100 Q 200 110 218 130" stroke="url(#rider-body)" strokeWidth="11" strokeLinecap="round" fill="none"/>
    {/* hand */}
    <circle cx="218" cy="130" r="6" fill="#3a3f48"/>
    {/* legs (bent on the deck) */}
    <path d="M132 170 Q 110 200 100 250 L 110 270 L 90 280 L 80 268 Q 95 220 118 168" fill="url(#rider-body)" stroke="#2a2f38" strokeWidth="1"/>
    <path d="M168 170 Q 188 200 196 250 L 188 270 L 208 280 L 218 268 Q 200 220 178 168" fill="url(#rider-body)" stroke="#2a2f38" strokeWidth="1" opacity="0.7"/>
    {/* backpack outline */}
    <path d="M120 90 Q 116 100 118 130 L 110 130 Q 106 100 114 88 Z" fill="#0e1116" stroke="#2a2f38" strokeWidth="1"/>
    {/* speed line behind helmet */}
    <line x1="100" y1="50" x2="124" y2="56" stroke="#c5ff3a" strokeWidth="1" opacity="0.5"/>
    <line x1="105" y1="65" x2="128" y2="68" stroke="#c5ff3a" strokeWidth="0.6" opacity="0.3"/>
  </svg>
);

const HeroCinematic = () => (
  <div className="hero-cinematic">
    <div className="hero-cine-streaks">
      {[12, 28, 44, 62, 78, 92].map((y) => (
        <div key={y} className="hero-cine-streak" style={{ top: y + '%', width: 60 + Math.random() * 120, animationDelay: -(y / 20) + 's', animationDuration: 2.5 + Math.random() * 2 + 's' }}/>
      ))}
    </div>
    <div className="hero-cine-rider"><RiderScene/></div>
    <div className="hero-cine-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <span className="hero-cine-tag"><span className="dot"/>● Replay live · El Jadida · 14:32</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.12em' }}>● MS-027 · 78% · 23 km/h</span>
      </div>
      <div>
        <h3 className="hero-cine-title">
          La ville en <span className="em">25 km/h</span><br/>
          d'autonomie pure.
        </h3>
      </div>
      <div className="hero-cine-meta">
        <div>● Modèle <strong>Pro 2</strong></div>
        <div>● Vitesse max <strong>25 km/h</strong></div>
        <div>● Autonomie <strong>~32 km</strong></div>
        <div>● Recharge <strong>4h</strong></div>
        <div>● Poids <strong>14,2 kg</strong></div>
      </div>
    </div>
  </div>
);

const SiteHeader = () => {
  const [open, setOpen] = useStateL(false);
  return (
    <>
      <header className="site-header">
        <a className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <div className="brand-mark"/>
          <div className="brand-name">MazaganScoot<span className="dot">.</span></div>
        </a>
        <nav className="site-nav">
          <a className="active" href="#top">Accueil</a>
          <a href="#how">Comment ça marche</a>
          <a href="#stations">Stations</a>
          <a href="#pricing">Tarifs</a>
          <a href="#safety">Sécurité</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="site-cta">
          <a className="btn btn-ghost" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => window.__setRole('auth')}>Se connecter</a>
          <a className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => window.__setRole('auth')}>Créer un compte</a>
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)}><span/></button>
        </div>
      </header>
      <div className={'mobile-drawer ' + (open ? 'open' : '')}>
        <a href="#top" onClick={() => setOpen(false)}>Accueil</a>
        <a href="#how" onClick={() => setOpen(false)}>Comment ça marche</a>
        <a href="#stations" onClick={() => setOpen(false)}>Stations</a>
        <a href="#pricing" onClick={() => setOpen(false)}>Tarifs</a>
        <a href="#safety" onClick={() => setOpen(false)}>Sécurité</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => { setOpen(false); window.__setRole('auth'); }} style={{ justifyContent: 'center' }}>Se connecter</button>
          <button className="btn btn-primary" onClick={() => { setOpen(false); window.__setRole('auth'); }} style={{ justifyContent: 'center' }}>S'inscrire</button>
        </div>
      </div>
    </>
  );
};

const Hero = () => (
  <section className="hero" id="top" data-screen-label="01 Hero">
    <div className="hero-grid"/>
    <div className="hero-blob"/>
    <div className="hero-blob b2"/>

    <div className="hero-top">
      <div className="hero-eyebrow">
        <span className="live"/>
        <span>● Plateforme de location de trottinettes électriques · El Jadida — Pilote actif</span>
      </div>
      <div className="hero-meta">
        33.2316° N<br/>
        −8.5007° W<br/>
        24°C · Ensoleillé
      </div>
    </div>

    <h1 className="hero-title">
      Explorez<br/>
      <span className="em">El Jadida</span> en<br/>
      <span className="stroke">trottinette</span> électrique.
    </h1>

    <div className="hero-bottom">
      <p className="hero-sub">
        Réservez, scannez et roulez avec <strong style={{ color: 'var(--ink)' }}>MazaganScoot</strong> — la plateforme intelligente de mobilité électrique urbaine. <span style={{ color: 'var(--ink-3)' }}>120 trottinettes connectées · 18 stations · paiement wallet.</span>
      </p>
      <div className="hero-ctas">
        <a className="btn btn-primary" onClick={() => window.__setRole('auth')}>
          Créer un compte
          <span className="arrow"><Icon name="arr" size={10}/></span>
        </a>
        <a className="btn btn-ghost" href="#map">
          Trouver une trottinette
          <span className="arrow"><Icon name="pin" size={11}/></span>
        </a>
        <a className="btn btn-ghost" href="#how" style={{ background: 'transparent', borderColor: 'transparent', color: 'var(--ink-2)' }}>
          Comment ça marche
        </a>
      </div>
      <div className="scooter-card">
        <div className="scooter-vin">
          <span>MZ — 014</span>
          <span>● LIVE</span>
        </div>
        <div className="scooter-svg-wrap">
          <ScooterSVG size={180}/>
        </div>
        <div>
          <div className="scooter-name">
            <span className="n">Pro 2</span>
            <span className="b">92%</span>
          </div>
          <div className="scooter-vin" style={{ marginTop: 6 }}>
            <span>Centre Ville · 320 m</span>
            <span>~12 km</span>
          </div>
        </div>
      </div>
    </div>

    <div className="stats-strip">
      {[
        { l: 'Trottinettes', n: 120, idx: '01' },
        { l: 'Stations', n: 18, idx: '02' },
        { l: 'Trajets', n: 4500, idx: '03' },
        { l: 'Satisfaction', n: 97, suf: '%', idx: '04' },
      ].map((s, i) => (
        <div key={i} className="stat">
          <div className="label">
            <span>{s.l}</span>
            <span className="idx">{s.idx} / 04</span>
          </div>
          <div className="value">
            <Counter to={s.n}/>{s.suf ? <span className="em">{s.suf}</span> : null}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const About = () => (
  <section className="section" id="about" data-screen-label="02 About">
    <div className="section-head">
      <div className="section-num">/ 02</div>
      <h2 className="section-title">Une mobilité <span className="em">pensée</span> pour Mazagan.</h2>
      <div className="section-meta">À PROPOS<br/>EL JADIDA — 2026</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
      <Reveal>
        <p style={{ fontSize: 22, lineHeight: 1.45, fontFamily: 'Instrument Serif', color: 'var(--ink-2)', margin: 0 }}>
          MazaganScoot est une solution de mobilité électrique intelligente lancée à El Jadida pour rendre le transport urbain <span style={{ color: 'var(--ink)' }}>plus propre</span>, <span style={{ color: 'var(--electric)', fontStyle: 'italic' }}>plus rapide</span>, plus sûr et plus simple — pour les habitants, étudiants et visiteurs de la médina portugaise.
        </p>
      </Reveal>
      <Reveal delay={200}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['—01', 'Locale', 'Conçue à El Jadida, déployée dans la région de Mazagan.'],
            ['—02', 'Électrique', 'Flotte 100% électrique, énergie partiellement solaire.'],
            ['—03', 'Connectée', 'Chaque trottinette est géolocalisée et supervisée en temps réel.'],
            ['—04', 'Communautaire', 'Tarifs étudiants, partenariats avec la Faculté & la ville.'],
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{n}</span>
              <div>
                <h4 style={{ fontFamily: 'Instrument Serif', fontSize: 24, margin: '0 0 4px', fontWeight: 400 }}>{t}</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const Features = () => (
  <section className="section" id="features" data-screen-label="03 Features">
    <div className="section-head">
      <div className="section-num">/ 03</div>
      <h2 className="section-title">Une plateforme, <span className="em">trois rôles</span>.</h2>
      <div className="section-meta">FONCTIONNALITÉS<br/>USER · ADMIN · MAINTENANCE</div>
    </div>
    <div className="feature-grid">
      {[
        { n: '— USER', cls: 'tinted-1', icn: 'scooter', t: 'Roulez sans friction.', d: 'Carte intelligente, réservation en un geste, QR-déverrouillage, pause à la volée. Un wallet rechargeable, un historique propre.' },
        { n: '— ADMIN', cls: 'tinted-2', icn: 'chart', t: 'Pilotez la flotte.', d: 'Control Tower temps réel : trottinettes, courses, revenus, alertes batterie, zones géo, codes promo. Analytics natifs.' },
        { n: '— MAINTENANCE', cls: 'tinted-3', icn: 'wrench', t: 'Réparez efficacement.', d: 'Missions automatiquement assignées, priorités, batteries faibles, historique des interventions, statut technicien.' },
        { n: '— LIVE', cls: '', icn: 'map', t: 'Carte temps réel.', d: 'Une cartographie futuriste de la ville avec filtres dynamiques, marqueurs animés, et fiches trottinette contextuelles.' },
        { n: '— SAFE', cls: '', icn: 'helmet', t: 'Sécurité d\'abord.', d: 'Zones géo-délimitées, règles de stationnement, alertes vitesse, conseils embarqués avant chaque trajet.' },
        { n: '— SAAS', cls: '', icn: 'layers', t: 'Architecture moderne.', d: 'React + REST PHP + MySQL + JWT. Multi-langue (FR / EN / AR), responsive, dark & light mode natif.' },
      ].map((f, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className={'feature ' + f.cls}>
            <div>
              <div className="icn"><Icon name={f.icn} size={20}/></div>
              <div className="num">{f.n}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Découvrir</span>
              <span className="btn-arrow" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                <Icon name="arr" size={12}/>
              </span>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    ['01', 'Trouvez une trottinette', 'Repérez la plus proche sur la carte intelligente.'],
    ['02', 'Réservez-la', '10 minutes gratuites pour rejoindre votre trottinette.'],
    ['03', 'Scannez le QR code', 'Déverrouillage instantané, vérification d\'identité.'],
    ['04', 'Démarrez le trajet', 'Le compteur démarre, suivez votre itinéraire.'],
    ['05', 'Pause ou reprise', 'Mettez en pause pendant un arrêt rapide.'],
    ['06', 'Terminez le trajet', 'Garez-vous en zone autorisée et clôturez.'],
    ['07', 'Paiement auto', 'Débit wallet, reçu en temps réel.'],
  ];
  const [active, setActive] = useStateL(2);
  return (
    <section className="section" id="how" data-screen-label="04 How it works">
      <div className="section-head">
        <div className="section-num">/ 04</div>
        <h2 className="section-title">Comment ça <span className="em">marche</span>.</h2>
        <div className="section-meta">PROCESS<br/>7 ÉTAPES</div>
      </div>
      <div className="howit">
        <div className="steps">
          {steps.map(([n, t, d], i) => (
            <div key={n} className={'step ' + (active === i ? 'active' : '')} onClick={() => setActive(i)}>
              <span className="n">{n}</span>
              <div>
                <div className="t">{t}</div>
                {active === i && <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{d}</div>}
              </div>
              <span className="arrow"><Icon name="arr" size={14}/></span>
            </div>
          ))}
        </div>
        <div className="howit-visual">
          <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>ÉTAPE {steps[active][0]}</span>
            <span>● LIVE PREVIEW</span>
          </div>
          {active === 0 || active === 1 ? <SmartMap height={420} showInfo={false}/> : (
            <div style={{ position: 'absolute', inset: 60, background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>MZ-014 · CENTRE VILLE</div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 36, lineHeight: 1.05, marginTop: 8 }}>{steps[active][1]}</div>
              </div>
              <div style={{ display: 'grid', placeItems: 'center' }}>
                {active === 2 && (
                  <div style={{ width: 140, height: 140, background: 'var(--ink)', borderRadius: 16, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: 2 }}>
                    {Array.from({length: 49}).map((_, i) => (
                      <div key={i} style={{ background: Math.random() > 0.45 ? 'var(--bg)' : 'transparent', borderRadius: 1 }}/>
                    ))}
                  </div>
                )}
                {active === 3 && <ScooterSVG size={180}/>}
                {active === 4 && (
                  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--warn)', color: '#14181f', display: 'grid', placeItems: 'center' }}><Icon name="pause" size={24}/></div>
                    <div style={{ fontFamily: 'Instrument Serif', fontSize: 48 }}>00:14:32</div>
                  </div>
                )}
                {active === 5 && (
                  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--danger)', color: 'white', display: 'grid', placeItems: 'center' }}><Icon name="stop" size={24}/></div>
                    <div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>TOTAL</div>
                      <div style={{ fontFamily: 'Instrument Serif', fontSize: 48 }}>32,50 <span style={{ fontStyle: 'italic', fontSize: 24, color: 'var(--ink-3)' }}>MAD</span></div>
                    </div>
                  </div>
                )}
                {active === 6 && (
                  <div style={{ width: 200, padding: 20, background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>WALLET — 124,50 MAD</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}><span>Trajet MZ-014</span><span style={{ color: 'var(--danger)' }}>−32,50</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13, paddingTop: 8, borderTop: '1px solid var(--border)' }}><span style={{ color: 'var(--ink-3)' }}>Nouveau solde</span><span style={{ color: 'var(--electric)' }}>92,00 MAD</span></div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
                <span>{steps[active][2]}</span>
                <span>{active + 1}/{steps.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => (
  <section className="section" id="pricing" data-screen-label="05 Pricing">
    <div className="section-head">
      <div className="section-num">/ 05</div>
      <h2 className="section-title">Tarifs <span className="em">transparents</span>.</h2>
      <div className="section-meta">PRICING<br/>EN DIRHAM (MAD)</div>
    </div>
    <div className="pricing-grid">
      <div className="price-card">
        <div className="tag">— STANDARD</div>
        <h3>À la minute</h3>
        <div className="desc">Pour un trajet ponctuel, pas d'engagement.</div>
        <div className="num">2<span className="em">,00 MAD/min</span></div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 24 }}>+ 3 MAD de déverrouillage</div>
        <ul>
          <li>Déverrouillage QR instantané</li>
          <li>Pause gratuite jusqu'à 5 min</li>
          <li>Wallet rechargeable</li>
          <li>Reçus PDF</li>
        </ul>
      </div>
      <div className="price-card feature-card">
        <div className="tag">— POPULAIRE</div>
        <h3>Étudiant Mazagan</h3>
        <div className="desc">Pour la Faculté & écoles partenaires d'El Jadida.</div>
        <div className="num">1<span className="em">,20 MAD/min</span></div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Déverrouillage gratuit</div>
        <ul>
          <li>−40% sur tous les trajets</li>
          <li>Recharge wallet bonifiée +10%</li>
          <li>Stations campus prioritaires</li>
          <li>Vérification ID étudiant</li>
        </ul>
      </div>
      <div className="price-card">
        <div className="tag">— PASS</div>
        <h3>Mensuel illimité</h3>
        <div className="desc">Pour les habitants réguliers du centre.</div>
        <div className="num">299<span className="em">,00 MAD</span></div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 24 }}>Trajets de moins de 30 min illimités</div>
        <ul>
          <li>Toutes les courses ≤ 30 min</li>
          <li>Au-delà : 1 MAD/min</li>
          <li>Assistance prioritaire</li>
          <li>Codes promo cumulables</li>
        </ul>
      </div>
    </div>
  </section>
);

const Safety = () => (
  <section className="section" id="safety" data-screen-label="06 Safety">
    <div className="section-head">
      <div className="section-num">/ 06</div>
      <h2 className="section-title">Roulez en <span className="em">sécurité</span>.</h2>
      <div className="section-meta">RÈGLES<br/>06 ESSENTIELS</div>
    </div>
    <div className="safety-grid">
      {[
        ['01', 'helmet', 'Portez un casque', 'Recommandé sur tous les trajets, obligatoire la nuit.'],
        ['02', 'flag', 'Respectez le code', 'Feux, piétons, sens de circulation. Pas de trottoir.'],
        ['03', 'pin', 'Stationnez bien', 'Uniquement dans les zones autorisées en vert sur la carte.'],
        ['04', 'user', 'Un seul rider', 'Pas de passager. Pas de transport de tiers.'],
        ['05', 'battery', 'Batterie vérifiée', 'Contrôlez le niveau avant chaque départ.'],
        ['06', 'wrench', 'Signalez les pannes', 'Un défaut ? Photo + report depuis l\'app.'],
      ].map(([n, icn, t, d]) => (
        <div key={n} className="safety-cell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Icon name={icn} size={22}/>
            <span className="num">/ {n}</span>
          </div>
          <div>
            <h4>{t}</h4>
            <p>{d}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const StationsSection = () => (
  <section className="section" id="stations" data-screen-label="07 Stations">
    <div className="section-head">
      <div className="section-num">/ 07</div>
      <h2 className="section-title">18 stations à <span className="em">El Jadida</span>.</h2>
      <div className="section-meta">STATIONS<br/>MISE À JOUR · LIVE</div>
    </div>
    <div className="stations-grid">
      {STATIONS.map((s, i) => (
        <Reveal key={s.code} delay={i * 40}>
          <div className="station">
            <div>
              <div className="station-head">
                <div className="station-code">{s.code} · EJD</div>
                <div className={'station-status ' + (s.available > 6 ? 'full' : s.available > 3 ? '' : 'warn')}/>
              </div>
              <h4>{s.name}</h4>
              <div className="dist">{(Math.random() * 2 + 0.3).toFixed(1)} km · {Math.round(Math.random() * 12 + 3)} min</div>
            </div>
            <div>
              <div className="station-bar">
                {Array.from({length: s.slots}).map((_, j) => (
                  <div key={j} className={'slot ' + (j < s.available ? 'filled' : j < s.available + 1 ? 'charging' : '')}/>
                ))}
              </div>
              <div className="station-meta">
                <span>{s.available} dispo. / {s.slots}</span>
                <span>● {s.slots - s.available} libres</span>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const MapPreview = () => (
  <section className="section" id="map" data-screen-label="08 Map">
    <div className="section-head">
      <div className="section-num">/ 08</div>
      <h2 className="section-title">Carte <span className="em">en direct</span>.</h2>
      <div className="section-meta">SMART MAP<br/>120 TROTTINETTES</div>
    </div>
    <SmartMap height={560} showRoute={true}/>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = useStateL(0);
  const items = [
    ['Où puis-je rouler avec MazaganScoot ?', 'Actuellement à El Jadida intra-muros, sur la Corniche, autour de la Cité Portugaise, et jusqu\'à la Faculté. La zone s\'étend progressivement vers Mazagan beach et Sidi Bouzid.'],
    ['Quel est le tarif d\'un trajet moyen ?', 'Un trajet centre-ville de 12 minutes coûte en moyenne 27 MAD. Les étudiants paient 40% moins. Aucune surprise — le coût est affiché en temps réel pendant la course.'],
    ['Que faire en cas de panne pendant le trajet ?', 'Mettez le trajet en pause depuis l\'app, contactez le support 24/7 et signalez la panne avec une photo. Une équipe maintenance est dispatchée immédiatement.'],
    ['Faut-il un permis de conduire ?', 'Non — la conduite des trottinettes électriques 25 km/h est autorisée à partir de 14 ans. Une vérification d\'identité est requise à l\'inscription.'],
    ['Puis-je recharger mon wallet en cash ?', 'Oui — en plus de la carte bancaire et de M-Wallet (Maroc), vous pouvez recharger en cash dans nos stations partenaires (Marjane, Café de la Corniche, kiosques agréés).'],
  ];
  return (
    <section className="section" id="faq" data-screen-label="09 FAQ">
      <div className="section-head">
        <div className="section-num">/ 09</div>
        <h2 className="section-title"><span className="em">Questions</span> fréquentes.</h2>
        <div className="section-meta">FAQ<br/>SUPPORT 24/7</div>
      </div>
      <div className="faq">
        {items.map(([q, a], i) => (
          <div key={i} className={'faq-item ' + (open === i ? 'open' : '')} onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="faq-q">
              <span>{q}</span>
              <span className="toggle">+</span>
            </div>
            <div className="faq-a">{a}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => (
  <section className="section" id="contact" data-screen-label="10 Contact">
    <div className="section-head">
      <div className="section-num">/ 10</div>
      <h2 className="section-title">Une <span className="em">question</span> ?</h2>
      <div className="section-meta">CONTACT<br/>EL JADIDA · 24/7</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60 }}>
      <div>
        <p style={{ fontFamily: 'Instrument Serif', fontSize: 28, lineHeight: 1.3, margin: 0, color: 'var(--ink-2)' }}>
          Notre équipe support est basée à <span style={{ color: 'var(--ink)' }}>El Jadida</span>. Réponse sous moins d'une heure pendant les heures d'ouverture.
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['mail', 'support@mazaganscoot.ma'],
            ['phone', '+212 5 23 00 00 00'],
            ['pin', 'Boulevard Mohammed VI — El Jadida'],
            ['clock', 'Lun · Dim · 06h00 — 23h00'],
          ].map(([icn, txt]) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: 'var(--ink-2)' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}><Icon name={icn} size={15}/></span>
              {txt}
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 32 }}>
        <div className="grid-1fr1fr">
          <div className="field">
            <label>Nom complet</label>
            <input defaultValue="Yassine Bennani"/>
          </div>
          <div className="field">
            <label>Email</label>
            <input defaultValue="yassine@example.ma"/>
          </div>
        </div>
        <div className="grid-1fr1fr">
          <div className="field">
            <label>Téléphone</label>
            <input defaultValue="+212 6 12 34 56 78"/>
          </div>
          <div className="field">
            <label>Catégorie</label>
            <select>
              <option>Support technique</option>
              <option>Question wallet</option>
              <option>Trottinette endommagée</option>
              <option>Partenariat</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Message</label>
          <textarea rows="5" defaultValue="Bonjour, je voudrais signaler que la trottinette MZ-064 a une batterie très faible au niveau de la Corniche. Merci."/>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Envoyer le message
          <span className="arrow"><Icon name="arr" size={11}/></span>
        </button>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="final-cta" data-screen-label="11 Final CTA">
    <div className="hero-blob"/>
    <div style={{ position: 'relative' }}>
      <div className="hero-eyebrow" style={{ justifyContent: 'center', marginBottom: 24 }}>
        <span className="live"/>
        <span>● PILOTE EN COURS · MAZAGAN 2026</span>
      </div>
      <h2 className="final-cta-title">
        Prêt à rouler.<br/>
        <span className="em">Roulez avec nous.</span>
      </h2>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a className="btn btn-primary" onClick={() => window.__setRole('auth')}>
          Créer mon compte
          <span className="arrow"><Icon name="arr" size={11}/></span>
        </a>
        <a className="btn btn-ghost" onClick={() => window.__setRole('auth')}>
          Se connecter
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer" data-screen-label="12 Footer">
    <div className="footer-top">
      <div className="footer-brand">
        <div className="serif">MazaganScoot<span style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>.</span></div>
        <p>La mobilité électrique intelligente à El Jadida. Pilote 2026 — déploiement régional Mazagan 2027.</p>
        <div style={{ marginTop: 20, padding: 14, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="settings" size={14}/>
          <a onClick={() => window.__setRole('staff')} style={{ fontSize: 12, color: 'var(--ink-2)', textDecoration: 'underline', cursor: 'pointer' }}>Portail interne MazaganScoot →</a>
        </div>
      </div>
      <div className="footer-col">
        <h5>Plateforme</h5>
        <a>Accueil</a><a>Comment ça marche</a><a>Tarifs</a><a>Stations</a><a>Sécurité</a>
      </div>
      <div className="footer-col">
        <h5>Entreprise</h5>
        <a>À propos</a><a>Carrières</a><a>Presse</a><a>Partenaires</a><a>Investisseurs</a>
      </div>
      <div className="footer-col">
        <h5>Support</h5>
        <a>FAQ</a><a>Contact</a><a>Conditions</a><a>Confidentialité</a><a>Cookies</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 MazaganScoot SARL · El Jadida</span>
      <span>Made with ◇ in Mazagan</span>
      <span>v0.9.4 — Pilote</span>
    </div>
  </footer>
);

const StepNav = () => {
  const sections = [
    ['top', 'Accueil', '01'],
    ['about', 'À propos', '02'],
    ['features', 'Fonctionnalités', '03'],
    ['how', 'Process', '04'],
    ['pricing', 'Tarifs', '05'],
    ['safety', 'Sécurité', '06'],
    ['stations', 'Stations', '07'],
    ['map', 'Carte', '08'],
    ['faq', 'FAQ', '09'],
    ['contact', 'Contact', '10'],
  ];
  const [active, setActive] = useStateL(0);
  const [progress, setProgress] = useStateL(0);

  useEffectL(() => {
    const onScroll = () => {
      const sc = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, sc / h)));

      let cur = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s[0]);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="stepnav">
      <div className="progress-rail">
        <div className="progress-fill" style={{ height: `${progress * 100}%` }}/>
      </div>
      {sections.map(([id, label, num], i) => (
        <a key={id} className={i === active ? 'active' : i < active ? 'passed' : ''} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          <span className="step-label">{num} · {label}</span>
          <span className="step-dot"/>
        </a>
      ))}
    </nav>
  );
};

const Landing = () => (
  <main className="landing" data-screen-label="Public Site">
    <SiteHeader/>
    <StepNav/>
    <Hero/>
    <HeroCinematic/>
    <About/>
    <Features/>
    <HowItWorks/>
    <Pricing/>
    <Safety/>
    <StationsSection/>
    <MapPreview/>
    <FAQ/>
    <Contact/>
    <FinalCTA/>
    <Footer/>
  </main>
);

export { Landing };

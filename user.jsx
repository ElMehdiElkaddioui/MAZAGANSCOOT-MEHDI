// User Dashboard
import { useState as useStateU, useEffect as useEffectU } from 'react';
import { Icon, ScooterSVG } from './ui.jsx';
import { SmartMap } from './map.jsx';

const USER_NAV = [
  { sec: 'NAVIGATION', items: [
    { id: 'overview', icn: 'home', label: 'Vue d\'ensemble' },
    { id: 'map', icn: 'map', label: 'Carte en direct' },
    { id: 'nearby', icn: 'pin', label: 'Trottinettes proches' },
    { id: 'reservations', icn: 'clock', label: 'Mes réservations', badge: '1' },
    { id: 'ride', icn: 'bolt', label: 'Course en cours', badge: 'LIVE' },
  ]},
  { sec: 'FINANCES', items: [
    { id: 'wallet', icn: 'wallet', label: 'Wallet' },
    { id: 'payments', icn: 'coin', label: 'Paiements' },
    { id: 'history', icn: 'file', label: 'Historique' },
    { id: 'rewards', icn: 'gift', label: 'Récompenses' },
  ]},
  { sec: 'COMPTE', items: [
    { id: 'notifications', icn: 'bell', label: 'Notifications', badge: '3' },
    { id: 'support', icn: 'help', label: 'Support' },
    { id: 'profile', icn: 'user', label: 'Profil' },
    { id: 'settings', icn: 'settings', label: 'Paramètres' },
  ]},
];

const Sidebar = ({ nav, active, onChange, kind = 'user' }) => (
  <aside className="dash-sidebar">
    <div className="dash-sidebar-brand">
      <div className="brand-mark"/>
      <div>
        <div className="brand-name serif">MazaganScoot<span style={{ color: 'var(--electric)' }}>.</span></div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>
          {kind === 'admin' ? 'Control Tower' : kind === 'maintenance' ? 'Centre maintenance' : 'Espace rider'}
        </div>
      </div>
    </div>
    {nav.map((sec) => (
      <div key={sec.sec} className="dash-side-section">
        <h6>{sec.sec}</h6>
        {sec.items.map((it) => (
          <div key={it.id} className={'dash-link ' + (active === it.id ? 'active' : '')} onClick={() => onChange(it.id)}>
            <span className="icn"><Icon name={it.icn} size={15}/></span>
            <span>{it.label}</span>
            {it.badge && <span className="badge">{it.badge}</span>}
          </div>
        ))}
      </div>
    ))}
    <div style={{ marginTop: 'auto', padding: 12, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>● APP MOBILE</div>
      <div style={{ fontFamily: 'Instrument Serif', fontSize: 18, marginTop: 6, lineHeight: 1.2 }}>Téléchargez l'app iOS/Android</div>
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-2)', textDecoration: 'underline' }}>scoot.ma/app</div>
    </div>
  </aside>
);

const SimpleChart = ({ values, highlight = -1, color = 'var(--electric)' }) => (
  <div className="chart-wrap">
    <div className="chart-grid">
      <div>—</div><div>—</div><div>—</div><div>—</div><div>—</div>
    </div>
    <div className="chart-bars">
      {values.map((v, i) => (
        <div key={i} className="col" style={{ height: '100%' }}>
          <div className="b2" style={{ height: '20%' }}/>
          <div className="b1" style={{ height: v + '%', background: i === highlight ? color : 'var(--electric)' }}/>
        </div>
      ))}
    </div>
  </div>
);

const LineChart = ({ data, height = 200, fill = true, stroke = 'var(--electric)' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 90}`).join(' ');
  return (
    <div style={{ position: 'relative', height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="lc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={stroke} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.2" strokeDasharray="0.5 0.5"/>)}
        {fill && <polygon points={`0,100 ${pts} 100,100`} fill="url(#lc)"/>}
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((v - min) / (max - min || 1)) * 90;
          return <circle key={i} cx={x} cy={y} r="0.7" fill={stroke}/>;
        })}
      </svg>
    </div>
  );
};

const VerifBanner = ({ verified, onToggle }) => verified ? (
  <div className="verif-banner ok">
    <div className="vb-icon"><Icon name="check" size={20}/></div>
    <div className="vb-body">
      <h5>Compte vérifié</h5>
      <p>Identité validée — vous pouvez réserver et utiliser n'importe quelle trottinette de la flotte.</p>
    </div>
    <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={onToggle}>Tester état non-vérifié</button>
  </div>
) : (
  <div className="verif-banner">
    <div className="vb-icon"><Icon name="clock" size={20}/></div>
    <div className="vb-body">
      <h5>Votre compte est en attente de vérification.</h5>
      <p>Vous pourrez réserver et utiliser une trottinette après validation de votre identité (sous 24h en moyenne).</p>
    </div>
    <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={onToggle}>Marquer comme vérifié <span className="arrow"><Icon name="check" size={10}/></span></button>
  </div>
);

const Overview = ({ verified, setVerified }) => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Bonjour, <span className="em">Yassine.</span> {verified && <span className="verif-badge" style={{ verticalAlign: 'middle', marginLeft: 8 }}><span className="b-ic"><Icon name="check" size={8}/></span>Vérifié</span>}{!verified && <span className="verif-badge pending" style={{ verticalAlign: 'middle', marginLeft: 8 }}><span className="b-ic"><Icon name="clock" size={8}/></span>En attente</span>}</h1>
        <div className="dash-sub">Mercredi 14 mai 2026 · El Jadida · 24°C</div>
      </div>
      <div className="dash-head-actions">
        <div className="search-bar">
          <Icon name="search" size={14}/>
          <input placeholder="Rechercher une trottinette, station…"/>
          <span className="kbd">⌘K</span>
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 16px' }} disabled={!verified}>
          <Icon name="qr" size={14}/> Scanner
        </button>
      </div>
    </div>

    <VerifBanner verified={verified} onToggle={() => setVerified(!verified)}/>

    <div className="kpi-grid">
      <div className="kpi">
        <div className="kpi-label"><span>Solde wallet</span><Icon name="wallet" size={14}/></div>
        <div className="kpi-value">124<span className="em">,50 MAD</span></div>
        <div className="kpi-delta">↑ +75 MAD ce mois</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Trajets totaux</span><Icon name="bolt" size={14}/></div>
        <div className="kpi-value">47</div>
        <div className="kpi-spark">
          {[3,5,2,7,4,8,5,9,6,7,8,10].map((v,i) => <span key={i} className={i === 11 ? 'hi' : ''} style={{ height: v * 2 + 'px' }}/>)}
        </div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Points fidélité</span><Icon name="star" size={14}/></div>
        <div className="kpi-value">2 340</div>
        <div className="kpi-delta">↑ 12 trajets jusqu'au Tier 3</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Économie CO₂</span><Icon name="flame" size={14}/></div>
        <div className="kpi-value">18<span className="em">,4 kg</span></div>
        <div className="kpi-delta">vs voiture, ce mois</div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '20px 24px 16px', marginBottom: 0 }}>
          <h3 className="card-title">Carte intelligente</h3>
          <span className="card-sub">● 12 trottinettes proches</span>
        </div>
        <SmartMap height={380} showFilters={true} showInfo={true}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="wallet-card">
          <div>
            <div className="lbl">— Wallet · Visa **4221</div>
            <div className="balance">124<span className="em">,50</span></div>
            <div className="mono" style={{ position: 'relative', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>MAD · Disponible immédiatement</div>
          </div>
          <div className="meta">
            <span className="mono">YASSINE BENNANI</span>
            <span className="mono">EXP 06/28</span>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Réservation active</h3>
            <span className="pill cyan"><span className="dot"/>09:23 restants</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
              <ScooterSVG size={44}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, lineHeight: 1.1 }}>MZ-014</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Centre Ville · 320 m · 92%</div>
            </div>
            <button className="btn btn-primary" style={{ padding: '10px 16px' }}>Déverrouiller</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Notifications</h3><span className="card-sub">3 nouvelles</span></div>
          <div className="notif">
            <span className="notif-dot"/>
            <div className="notif-body">
              <div className="title">10 trajets effectués — débloquez Tier 3 (−15%)</div>
              <div className="meta">Il y a 12 min · Promo</div>
            </div>
          </div>
          <div className="notif">
            <span className="notif-dot" style={{ background: 'var(--cyan)' }}/>
            <div className="notif-body">
              <div className="title">Nouvelle station : <strong>Faculté Sud</strong></div>
              <div className="meta">Il y a 2 h · Réseau</div>
            </div>
          </div>
          <div className="notif">
            <span className="notif-dot" style={{ background: 'var(--warm)' }}/>
            <div className="notif-body">
              <div className="title">Reçu trajet MZ-027 — 27,40 MAD</div>
              <div className="meta">Hier · Paiement</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: 16 }}>
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Trajets récents</h3>
          <span className="card-sub">7 derniers jours</span>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>Départ → Arrivée</th><th>Durée</th><th>Prix</th><th>Note</th></tr></thead>
          <tbody>
            {[
              ['13/05', 'Centre Ville → Corniche', '14 min', '32,50', 5],
              ['12/05', 'Gare → Faculté', '22 min', '48,00', 5],
              ['11/05', 'Corniche → Cité Portugaise', '08 min', '19,00', 4],
              ['10/05', 'Marjane → Centre Ville', '18 min', '39,50', 5],
              ['09/05', 'Faculté → Centre Ville', '21 min', '44,80', 4],
            ].map((r, i) => (
              <tr key={i}>
                <td className="mono">{r[0]}</td>
                <td>{r[1]}</td>
                <td className="mono">{r[2]}</td>
                <td className="mono">{r[3]} MAD</td>
                <td>{'★'.repeat(r[4])}<span style={{ color: 'var(--ink-3)' }}>{'★'.repeat(5 - r[4])}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-head"><h3 className="card-title">Dépenses</h3><span className="card-sub">Cette semaine</span></div>
        <LineChart data={[15, 22, 18, 32, 27, 41, 38]} height={180}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-3)' }}>
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </div>
    </div>
  </>
);

const LiveMap = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Carte <span className="em">en direct</span></h1>
        <div className="dash-sub">12 trottinettes disponibles · 8 stations · Zone El Jadida</div>
      </div>
      <div className="dash-head-actions">
        <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Rechercher une station…"/></div>
        <button className="btn btn-ghost" style={{ padding: '10px 16px' }}><Icon name="refresh" size={14}/></button>
      </div>
    </div>
    <SmartMap height={620} showRoute={true}/>
  </>
);

const CurrentRide = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Course <span className="em">en cours</span></h1>
        <div className="dash-sub">MZ-014 · Centre Ville → Corniche · Départ 14:32</div>
      </div>
      <div className="dash-head-actions">
        <span className="pill electric"><span className="dot"/>LIVE</span>
      </div>
    </div>
    <div className="ride-hero">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative' }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>● TROTTINETTE</div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 80, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 8 }}>MZ-014</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>Xiaomi Pro 2 · ID: 9F2A-44B</div>
        </div>
        <ScooterSVG size={140}/>
      </div>
      <div className="ride-stats">
        <div className="ride-stat">
          <div className="lbl">Temps</div>
          <div className="val">14:32</div>
        </div>
        <div className="ride-stat">
          <div className="lbl">Batterie</div>
          <div className="val">68<span className="em">%</span></div>
        </div>
        <div className="ride-stat">
          <div className="lbl">Distance</div>
          <div className="val">3,2<span className="em"> km</span></div>
        </div>
        <div className="ride-stat">
          <div className="lbl">Coût actuel</div>
          <div className="val">31<span className="em">,80</span></div>
        </div>
      </div>
      <div className="ride-controls">
        <button className="btn btn-warn"><Icon name="pause" size={14}/> Mettre en pause</button>
        <button className="btn btn-ghost"><Icon name="play" size={14}/> Reprendre</button>
        <button className="btn btn-danger"><Icon name="stop" size={14}/> Terminer la course</button>
      </div>
    </div>
    <div className="grid-2" style={{ marginTop: 16 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '20px 24px 16px', marginBottom: 0 }}>
          <h3 className="card-title">Itinéraire</h3>
          <span className="card-sub">Trajet en temps réel</span>
        </div>
        <SmartMap height={340} showRoute={true} showFilters={false}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Rappels sécurité</h3><Icon name="helmet" size={16}/></div>
          {[
            ['Portez un casque', 'Recommandé sur tous les trajets.'],
            ['Pas de trottoir', 'Routes & pistes cyclables uniquement.'],
            ['Vitesse max 25 km/h', 'En zone urbaine El Jadida.'],
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <Icon name="check" size={16}/>
              <div>
                <div style={{ fontSize: 14 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Estimation</h3><span className="card-sub">Arrivée prévue</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>ARRIVÉE</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 36 }}>14:47</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>COÛT FINAL ≈</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 36 }}>34,00 <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>MAD</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const Wallet = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Wallet & <span className="em">paiements</span></h1>
        <div className="dash-sub">Carte ·•• 4221 · Recharge automatique activée</div>
      </div>
      <div className="dash-head-actions">
        <button className="btn btn-ghost"><Icon name="download" size={14}/> Exporter</button>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Recharger</button>
      </div>
    </div>
    <div className="grid-2">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="wallet-card" style={{ minHeight: 280 }}>
          <div>
            <div className="lbl">— SOLDE DISPONIBLE</div>
            <div className="balance" style={{ fontSize: 96 }}>124<span className="em">,50</span></div>
            <div className="mono" style={{ position: 'relative', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>MAD · ~5 trajets centre-ville</div>
          </div>
          <div className="meta">
            <span className="mono">YASSINE BENNANI · *4221</span>
            <span className="mono">EXP 06/28</span>
          </div>
        </div>
        <div className="grid-3">
          {[20, 50, 100, 200, 500, 1000].map((v) => (
            <div key={v} className="card" style={{ padding: 18, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 28 }}>{v}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>MAD{v >= 100 ? ' · +10%' : ''}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Code promo</h3></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="field" style={{ flex: 1, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--ink)', fontFamily: 'JetBrains Mono', fontSize: 14, letterSpacing: '0.1em' }} defaultValue="MAZAGAN26"/>
            <button className="btn btn-primary">Appliquer</button>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--electric)', marginTop: 10 }}>● Code valide — 25 MAD offerts sur le prochain trajet</div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3 className="card-title">Transactions</h3><span className="card-sub">30 derniers jours</span></div>
        <table className="table">
          <thead><tr><th>Date</th><th>Description</th><th style={{textAlign:'right'}}>Montant</th></tr></thead>
          <tbody>
            {[
              ['14/05 14:32', 'Trajet MZ-014 · Centre → Corniche', '-32,50', 'r'],
              ['13/05 09:14', 'Recharge wallet', '+100,00', 'g'],
              ['12/05 17:48', 'Trajet MZ-027 · Gare → Faculté', '-48,00', 'r'],
              ['11/05 12:22', 'Code MAZAGAN26 · Crédit', '+25,00', 'g'],
              ['10/05 18:31', 'Trajet MZ-051 · Corniche → Cité', '-19,00', 'r'],
              ['08/05 10:11', 'Recharge wallet', '+200,00', 'g'],
              ['07/05 14:55', 'Trajet MZ-014 · Centre → Marjane', '-39,50', 'r'],
              ['06/05 11:02', 'Trajet MZ-064 · Marjane → Centre', '-44,80', 'r'],
            ].map((r, i) => (
              <tr key={i}>
                <td className="mono">{r[0]}</td>
                <td>{r[1]}</td>
                <td className="mono" style={{ textAlign: 'right', color: r[3] === 'g' ? 'var(--electric)' : 'var(--ink)' }}>{r[2]} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const History = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Historique des <span className="em">trajets</span></h1>
        <div className="dash-sub">47 trajets · 184 km · 412 MAD dépensés</div>
      </div>
      <div className="dash-head-actions">
        <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Filtrer…"/></div>
        <button className="btn btn-ghost"><Icon name="download" size={14}/></button>
      </div>
    </div>
    <div className="kpi-grid">
      <div className="kpi">
        <div className="kpi-label"><span>Trajets ce mois</span></div>
        <div className="kpi-value">12</div>
        <div className="kpi-delta">↑ +4 vs mois dernier</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Distance</span></div>
        <div className="kpi-value">48<span className="em">,3 km</span></div>
        <div className="kpi-delta">~ Casablanca aller</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Temps en selle</span></div>
        <div className="kpi-value">3<span className="em">h 42</span></div>
        <div className="kpi-delta">↑ +52 min</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Note moyenne</span></div>
        <div className="kpi-value">4,8<span className="em">/5</span></div>
        <div className="kpi-delta">42 notes</div>
      </div>
    </div>
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Tous les trajets</h3>
        <div className="tag-row">
          <span className="pill"><span className="dot"/>Tous</span>
          <span className="pill ok">Terminés</span>
          <span className="pill warn">Annulés</span>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Date</th><th>Code</th><th>Départ</th><th>Arrivée</th><th>Durée</th><th>Distance</th><th>Prix</th><th>Statut</th><th>Note</th></tr></thead>
        <tbody>
          {[
            ['14/05 14:32', 'MZ-014', 'Centre Ville', 'Corniche', '14 min', '3,2 km', '32,50', 'ok', 5],
            ['12/05 09:14', 'MZ-027', 'Gare', 'Faculté', '22 min', '5,8 km', '48,00', 'ok', 5],
            ['11/05 17:48', 'MZ-051', 'Corniche', 'Cité Portugaise', '08 min', '1,9 km', '19,00', 'ok', 4],
            ['10/05 12:22', 'MZ-014', 'Marjane', 'Centre Ville', '18 min', '4,4 km', '39,50', 'ok', 5],
            ['09/05 18:31', 'MZ-064', 'Faculté', 'Centre Ville', '21 min', '5,2 km', '44,80', 'ok', 4],
            ['08/05 10:11', 'MZ-027', 'Centre Ville', 'Cité Portugaise', '06 min', '1,3 km', '15,00', 'warn', 3],
            ['07/05 14:55', 'MZ-014', 'Centre Ville', 'Marjane', '20 min', '4,8 km', '42,40', 'ok', 5],
            ['06/05 11:02', 'MZ-073', 'Marjane', 'Corniche', '15 min', '3,7 km', '33,80', 'ok', 4],
          ].map((r, i) => (
            <tr key={i}>
              <td className="mono">{r[0]}</td>
              <td className="mono" style={{ color: 'var(--electric)' }}>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td className="mono">{r[4]}</td>
              <td className="mono">{r[5]}</td>
              <td className="mono">{r[6]} MAD</td>
              <td><span className={'pill ' + r[7]}><span className="dot"/>{r[7] === 'ok' ? 'Terminé' : 'Annulé'}</span></td>
              <td>{'★'.repeat(r[8])}<span style={{ color: 'var(--ink-3)' }}>{'★'.repeat(5 - r[8])}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const Rewards = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Récompenses & <span className="em">fidélité</span></h1>
        <div className="dash-sub">Tier Argent · 2 340 points · 660 pts pour Tier Or</div>
      </div>
    </div>
    <div className="card" style={{ background: 'linear-gradient(135deg, var(--surface), var(--surface-2))', padding: 36, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>● TIER ACTUEL</div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 84, lineHeight: 1, marginTop: 6 }}>Argent<span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>.</span></div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>−10% sur tous les trajets · 1 trajet gratuit / mois</div>
        </div>
        <div style={{ fontFamily: 'Instrument Serif', fontSize: 72, color: 'var(--electric)' }}>2 340<span style={{ fontSize: 24, color: 'var(--ink-3)' }}> pts</span></div>
      </div>
      <div style={{ marginTop: 24 }}>
        <div style={{ height: 8, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--electric))' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
          <span>Bronze · 0</span><span>Argent · 2 000</span><span style={{ color: 'var(--electric)' }}>● Vous · 2 340</span><span>Or · 3 000</span>
        </div>
      </div>
    </div>
    <div className="grid-3">
      {[
        ['10 MAD', 'Crédit wallet', '500 pts', 'gift'],
        ['1 Trajet', 'Centre Ville gratuit', '800 pts', 'bolt'],
        ['Casque', 'MazaganScoot Edition', '2 500 pts', 'helmet'],
        ['−30%', '1 mois illimité', '1 800 pts', 'discount'],
        ['Goodies', 'Tote bag + sticker', '300 pts', 'star'],
        ['Pass VIP', 'Soirée lancement', '1 200 pts', 'flag'],
      ].map(([t, d, p, icn], i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div className="icn" style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}><Icon name={icn} size={20}/></div>
            <span className="pill electric"><span className="dot"/>{p}</span>
          </div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 32, lineHeight: 1.1, marginTop: 14 }}>{t}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{d}</div>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '10px' }}>Échanger</button>
        </div>
      ))}
    </div>
  </>
);

const SupportSettings = ({ tab }) => {
  if (tab === 'support') return (
    <>
      <div className="dash-head">
        <div><h1 className="dash-title">Support<span className="em">.</span></h1><div className="dash-sub">Notre équipe répond en moins d'une heure</div></div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nouveau ticket</button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3 className="card-title">Mes tickets</h3></div>
          {[
            ['#2034', 'Batterie qui chute rapidement sur MZ-064', 'En cours', 'cyan'],
            ['#1987', 'Remboursement trajet annulé', 'Résolu', 'ok'],
            ['#1856', 'Code promo non appliqué', 'Résolu', 'ok'],
          ].map(([id, t, s, c], i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{id}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{t}</div>
              </div>
              <span className={'pill ' + c}><span className="dot"/>{s}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Contact rapide</h3></div>
          {[
            ['phone', 'Hotline 24/7', '+212 5 23 00 00 00'],
            ['mail', 'Email support', 'support@mazaganscoot.ma'],
            ['help', 'Centre d\'aide', 'help.mazaganscoot.ma'],
          ].map(([icn, t, d]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}><Icon name={icn} size={18}/></span>
              <div>
                <div style={{ fontSize: 14 }}>{t}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <>
      <div className="dash-head">
        <div><h1 className="dash-title">{tab === 'profile' ? <>Mon <span className="em">profil</span></> : <>Paramètres<span className="em">.</span></>}</h1><div className="dash-sub">Compte vérifié · ID validé · Tier Argent</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3 className="card-title">Informations</h3></div>
          <div className="grid-1fr1fr">
            <div className="field"><label>Prénom</label><input defaultValue="Yassine"/></div>
            <div className="field"><label>Nom</label><input defaultValue="Bennani"/></div>
          </div>
          <div className="field"><label>Email</label><input defaultValue="yassine@example.ma"/></div>
          <div className="field"><label>Téléphone</label><input defaultValue="+212 6 12 34 56 78"/></div>
          <div className="grid-1fr1fr">
            <div className="field"><label>Date de naissance</label><input defaultValue="14/03/1996"/></div>
            <div className="field"><label>Ville</label><input defaultValue="El Jadida"/></div>
          </div>
          <button className="btn btn-primary">Enregistrer</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3 className="card-title">Préférences</h3></div>
            {[
              ['Notifications push', true],
              ['Recharge auto wallet', true],
              ['Mode sombre', true],
              ['Recevoir promos', false],
              ['Suggestions trajets', true],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{l}</span>
                <span style={{ width: 36, height: 20, background: v ? 'var(--electric)' : 'var(--border)', borderRadius: 999, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 2, left: v ? 18 : 2, width: 16, height: 16, background: v ? '#14181f' : 'var(--ink-2)', borderRadius: '50%' }}/>
                </span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><h3 className="card-title">Langue</h3></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Français', 'English', 'العربية'].map((l, i) => (
                <span key={l} className={'pill ' + (i === 0 ? 'electric' : '')}><span className="dot"/>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const UserDashboard = () => {
  const [active, setActive] = useStateU('overview');
  const [verified, setVerified] = useStateU(() => localStorage.getItem('mz_verified') !== '0');
  useEffectU(() => { localStorage.setItem('mz_verified', verified ? '1' : '0'); }, [verified]);
  return (
    <div className="dash" data-screen-label="User Dashboard">
      <Sidebar nav={USER_NAV} active={active} onChange={setActive} kind="user"/>
      <main className="dash-main">
        {active === 'overview' && <Overview verified={verified} setVerified={setVerified}/>}
        {active === 'map' && <LiveMap/>}
        {active === 'nearby' && <LiveMap/>}
        {active === 'reservations' && <Overview verified={verified} setVerified={setVerified}/>}
        {active === 'ride' && <CurrentRide/>}
        {active === 'wallet' && <Wallet/>}
        {active === 'payments' && <Wallet/>}
        {active === 'history' && <History/>}
        {active === 'rewards' && <Rewards/>}
        {active === 'notifications' && <SupportSettings tab="support"/>}
        {active === 'support' && <SupportSettings tab="support"/>}
        {active === 'profile' && <SupportSettings tab="profile"/>}
        {active === 'settings' && <SupportSettings tab="settings"/>}
      </main>
    </div>
  );
};

export { UserDashboard, Sidebar, LineChart, SimpleChart };

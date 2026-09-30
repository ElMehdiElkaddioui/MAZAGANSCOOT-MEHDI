// Smart Map — interactive control map for MazaganScoot
// Features: user position, geozones, scooters w/ statuses, stations, animated rides, side panel, filters, search, zoom controls.
import { useState as useStateMap, useEffect as useEffectMap, useRef as useRefMap, useMemo as useMemoMap } from 'react';
import { Icon, ScooterSVG } from './ui.jsx';

// ========== Data ==========
const USER_POS = { x: 38, y: 50 };

const SCOOTERS_BASE = [
  { id: 'MS-204', x: 22, y: 38, status: 'available', battery: 92, model: 'Pro 2', loc: 'Av. Hassan II', price: 2.0, dist: 0.8 },
  { id: 'MS-027', x: 31, y: 52, status: 'available', battery: 78, model: 'Pro 2', loc: 'Place Mohammed V', price: 2.0, dist: 0.4 },
  { id: 'MS-031', x: 45, y: 28, status: 'available', battery: 65, model: 'Lite', loc: 'Cité Portugaise', price: 1.6, dist: 1.1 },
  { id: 'MS-042', x: 38, y: 65, status: 'reserved', battery: 84, model: 'Pro 2', loc: 'Corniche Nord', price: 2.0, dist: 1.4 },
  { id: 'MS-051', x: 55, y: 48, status: 'ride', battery: 56, model: 'Pro 2', loc: 'Rue Ibn Khaldoun', price: 2.0, dist: 1.6 },
  { id: 'MS-064', x: 67, y: 33, status: 'low', battery: 18, model: 'Lite', loc: 'Sidi Bouzid', price: 1.6, dist: 2.8 },
  { id: 'MS-073', x: 73, y: 58, status: 'low', battery: 12, model: 'Pro 2', loc: 'Av. Yacoub El Mansour', price: 2.0, dist: 3.2 },
  { id: 'MS-085', x: 28, y: 75, status: 'damaged', battery: 0, model: 'Pro 2', loc: 'Corniche Sud', price: 0, dist: 1.9 },
  { id: 'MS-092', x: 82, y: 42, status: 'available', battery: 88, model: 'Pro 2', loc: 'Boulevard Mohammed VI', price: 2.0, dist: 4.1 },
  { id: 'MS-101', x: 60, y: 70, status: 'available', battery: 95, model: 'Pro 2', loc: 'Plage Mazagan', price: 2.0, dist: 2.4 },
  { id: 'MS-108', x: 48, y: 80, status: 'ride', battery: 41, model: 'Pro 2', loc: 'Port', price: 2.0, dist: 3.0 },
  { id: 'MS-117', x: 18, y: 60, status: 'charging', battery: 64, model: 'Pro 2', loc: 'Station Marjane', price: 2.0, dist: 2.2 },
  { id: 'MS-125', x: 26, y: 24, status: 'maintenance', battery: 0, model: 'Lite', loc: 'Atelier EJD', price: 0, dist: 5.1 },
  { id: 'MS-138', x: 70, y: 22, status: 'available', battery: 81, model: 'Pro 2', loc: 'Université Chouaib', price: 2.0, dist: 3.8 },
];

const STATIONS_BASE = [
  { code: 'S01', name: 'Centre Ville', x: 35, y: 45, slots: 12, available: 8 },
  { code: 'S02', name: 'Gare El Jadida', x: 25, y: 30, slots: 10, available: 6 },
  { code: 'S03', name: 'Sidi Bouzid', x: 65, y: 22, slots: 8, available: 4 },
  { code: 'S04', name: 'Cité Portugaise', x: 50, y: 38, slots: 14, available: 10 },
  { code: 'S05', name: 'Faculté', x: 75, y: 55, slots: 8, available: 7 },
  { code: 'S06', name: 'Marjane', x: 80, y: 70, slots: 10, available: 3 },
  { code: 'S07', name: 'Corniche', x: 42, y: 72, slots: 12, available: 9 },
  { code: 'S08', name: 'Port / Mazagan', x: 58, y: 82, slots: 6, available: 2 },
];

// Active rides — animated paths
const ACTIVE_RIDES = [
  { id: 'R-091', scooterId: 'MS-051', path: 'M 55 48 Q 50 50 45 55 T 35 60', t: 0.4 },
  { id: 'R-092', scooterId: 'MS-108', path: 'M 48 80 Q 50 75 52 70 T 56 60', t: 0.6 },
];

// Geo zones — translucent polygons
const GEOZONES = [
  { id: 'Z01', name: 'Zone autorisée', kind: 'allowed', d: 'M 12 18 L 88 14 L 92 75 L 8 78 Z' },
  { id: 'Z02', name: 'Vitesse réduite — Cité Portugaise', kind: 'slow', d: 'M 45 30 L 56 28 L 58 42 L 47 44 Z' },
  { id: 'Z03', name: 'Stationnement Corniche', kind: 'parking', d: 'M 36 68 L 50 66 L 52 78 L 38 80 Z' },
  { id: 'Z04', name: 'Zone interdite — Port', kind: 'forbidden', d: 'M 54 80 L 64 79 L 65 90 L 55 91 Z' },
];

const ZONE_COLORS = {
  allowed:    { fill: 'rgba(197, 255, 58, 0.06)', stroke: 'rgba(197, 255, 58, 0.5)' },
  slow:       { fill: 'rgba(255, 184, 77, 0.08)', stroke: 'rgba(255, 184, 77, 0.55)' },
  parking:    { fill: 'rgba(111, 232, 255, 0.08)', stroke: 'rgba(111, 232, 255, 0.55)' },
  forbidden:  { fill: 'rgba(255, 107, 107, 0.10)', stroke: 'rgba(255, 107, 107, 0.55)' },
};

const STATUS_META = {
  available:   { color: 'electric', label: 'Disponible' },
  reserved:    { color: 'cyan', label: 'Réservée' },
  ride:        { color: 'warm', label: 'En course' },
  low:         { color: 'warn', label: 'Batterie faible' },
  charging:    { color: 'cyan', label: 'En charge' },
  damaged:     { color: 'danger', label: 'En panne' },
  maintenance: { color: 'danger', label: 'Maintenance' },
};

const ZONE_LABELS = [
  { label: 'EL JADIDA · CENTRE', x: 30, y: 42 },
  { label: 'MAZAGAN', x: 55, y: 35 },
  { label: 'CORNICHE / OCÉAN', x: 45, y: 88 },
  { label: 'SIDI BOUZID', x: 70, y: 18 },
  { label: 'FACULTÉ', x: 78, y: 50 },
];

// ========== Street/coast SVG ==========
const STREETS_SVG = (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="grad-coast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6fe8ff" stopOpacity="0"/>
        <stop offset="100%" stopColor="#6fe8ff" stopOpacity="0.14"/>
      </linearGradient>
      <pattern id="dots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
        <circle cx="0.5" cy="0.5" r="0.2" fill="rgba(255,255,255,0.06)"/>
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#dots)" opacity="0.4"/>
    {/* ocean */}
    <path d="M0 90 Q 30 86 50 88 T 100 86 L 100 100 L 0 100 Z" fill="url(#grad-coast)"/>
    <path d="M0 90 Q 30 86 50 88 T 100 86" stroke="#6fe8ff" strokeWidth="0.2" strokeOpacity="0.4" fill="none"/>
    {/* main roads */}
    <path d="M5 50 Q 30 48 55 50 T 95 52" stroke="#2a2f38" strokeWidth="0.8" fill="none"/>
    <path d="M40 5 L 42 95" stroke="#2a2f38" strokeWidth="0.6" fill="none"/>
    <path d="M70 5 Q 68 40 72 70 T 78 95" stroke="#2a2f38" strokeWidth="0.6" fill="none"/>
    <path d="M20 5 L 22 95" stroke="#2a2f38" strokeWidth="0.5" fill="none"/>
    <path d="M5 25 Q 50 22 95 28" stroke="#2a2f38" strokeWidth="0.5" fill="none"/>
    <path d="M5 75 Q 50 72 95 78" stroke="#2a2f38" strokeWidth="0.5" fill="none"/>
    {/* secondary streets */}
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={'v' + i} x1={10 + i * 11} y1="10" x2={12 + i * 11} y2="90" stroke="#1d2128" strokeWidth="0.2"/>
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={'h' + i} x1="5" y1={15 + i * 13} x2="95" y2={17 + i * 13} stroke="#1d2128" strokeWidth="0.2"/>
    ))}
    {/* Cité Portugaise outline */}
    <polygon points="48,36 52,34 56,38 54,42 49,42" fill="none" stroke="#c5ff3a" strokeWidth="0.3" strokeDasharray="0.5 0.5" opacity="0.5"/>
    {/* port */}
    <circle cx="58" cy="84" r="3" fill="none" stroke="#6fe8ff" strokeWidth="0.3" strokeDasharray="0.4 0.4" opacity="0.6"/>
  </svg>
);

// Move a few scooters along simple loops over time
function useAnimatedScooters() {
  const [tick, setTick] = useStateMap(0);
  useEffectMap(() => {
    const t = setInterval(() => setTick((x) => x + 1), 120);
    return () => clearInterval(t);
  }, []);
  return useMemoMap(() => {
    return SCOOTERS_BASE.map((s) => {
      if (s.status !== 'ride') return s;
      // small oscillation around the position
      const phase = (tick / 30) * (s.id.charCodeAt(0) % 3 + 1);
      return { ...s, x: s.x + Math.sin(phase) * 1.2, y: s.y + Math.cos(phase * 0.8) * 0.8 };
    });
  }, [tick]);
}

// ========== Components ==========
const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'available', label: 'Disponibles', color: 'electric' },
  { id: 'near', label: 'Proches (<1km)', color: 'cyan' },
  { id: 'highbat', label: 'Batterie > 70%', color: 'electric' },
  { id: 'stations', label: 'Stations', color: 'ink' },
  { id: 'charging', label: 'En charge', color: 'cyan' },
  { id: 'maintenance', label: 'Maintenance', color: 'danger' },
];

const ScooterMarker = ({ s, selected, onClick }) => {
  const color = STATUS_META[s.status].color;
  return (
    <div className="smartmap-marker" style={{ left: s.x + '%', top: s.y + '%' }} onClick={(e) => { e.stopPropagation(); onClick(s); }}>
      <div className={'marker-dot ' + color}>
        {selected && <div className="marker-ring"/>}
      </div>
      {selected && (
        <div style={{
          position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'var(--bg)', padding: '4px 8px', borderRadius: 8,
          fontFamily: 'JetBrains Mono', fontSize: 10, whiteSpace: 'nowrap', pointerEvents: 'none', letterSpacing: '0.08em',
        }}>{s.id} · {s.battery}%</div>
      )}
    </div>
  );
};

const StationMarker = ({ st, selected, onClick }) => (
  <div className="smartmap-marker" style={{ left: st.x + '%', top: st.y + '%' }} onClick={(e) => { e.stopPropagation(); onClick(st); }}>
    <div className="marker-station">{st.code}</div>
    {selected && (
      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
        background: 'color-mix(in oklab, var(--surface) 92%, transparent)',
        backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, minWidth: 200, zIndex: 6,
      }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{st.code} · EJD</div>
        <div style={{ fontFamily: 'Instrument Serif', fontSize: 20, marginTop: 2, lineHeight: 1.1 }}>{st.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
          <span style={{ color: 'var(--ink-3)' }}>Disponibles</span>
          <span className="mono">{st.available}/{st.slots}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
          <span style={{ color: 'var(--ink-3)' }}>Distance</span>
          <span className="mono">{(Math.random() * 2 + 0.3).toFixed(1)} km</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
          <span style={{ color: 'var(--ink-3)' }}>Statut</span>
          <span className="mono" style={{ color: 'var(--electric)' }}>● ACTIVE</span>
        </div>
      </div>
    )}
  </div>
);

const UserMarker = () => (
  <div className="smartmap-marker user-marker" style={{ left: USER_POS.x + '%', top: USER_POS.y + '%' }}>
    <div className="user-pulse"><div className="user-pulse-ring"/><div className="user-pulse-ring r2"/><div className="user-pulse-dot"/></div>
    <div style={{
      position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
      fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', pointerEvents: 'none',
      textShadow: '0 0 8px rgba(0,0,0,0.6)',
    }}>● Votre position</div>
  </div>
);

const ScooterSidePanel = ({ s, onClose }) => {
  if (!s) return null;
  const meta = STATUS_META[s.status];
  const walkMin = Math.max(2, Math.round(s.dist * 12));
  return (
    <div className="map-side-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.12em' }}>● TROTTINETTE SÉLECTIONNÉE</div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 44, lineHeight: 1, marginTop: 4 }}>{s.id}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{s.model} · {s.loc}</div>
        </div>
        <button className="theme-toggle" onClick={onClose}><Icon name="x" size={12}/></button>
      </div>

      <div style={{ display: 'grid', placeItems: 'center', padding: 14, background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--border)', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, var(--electric-soft), transparent 60%)' }}/>
        <ScooterSVG size={160}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        {[
          ['Batterie', `${s.battery}%`, s.battery > 50 ? 'var(--electric)' : s.battery > 20 ? 'var(--warn)' : 'var(--danger)'],
          ['Statut', meta.label, `var(--${meta.color})`],
          ['Distance', `${s.dist} km`, 'var(--ink)'],
          ['À pied', `~ ${walkMin} min`, 'var(--ink)'],
          ['Prix/min', s.price > 0 ? `${s.price.toFixed(2)} MAD` : '—', 'var(--ink)'],
          ['Autonomie', `~ ${Math.round(s.battery * 0.4)} km`, 'var(--ink)'],
        ].map(([l, v, c], i) => (
          <div key={i} style={{ padding: 12, background: 'var(--surface)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{l.toUpperCase()}</div>
            <div style={{ fontSize: 16, marginTop: 4, color: c, fontFamily: l === 'Batterie' || l === 'Distance' || l === 'À pied' || l === 'Prix/min' || l === 'Autonomie' ? 'JetBrains Mono' : 'inherit' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 6, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ width: s.battery + '%', height: '100%', background: s.battery > 50 ? 'linear-gradient(90deg, var(--cyan), var(--electric))' : s.battery > 20 ? 'var(--warn)' : 'var(--danger)' }}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {s.status === 'available' && <>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Icon name="bolt" size={14}/>
            Réserver · {walkMin} min à pied
            <span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}><Icon name="qr" size={13}/> QR Code</button>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}><Icon name="eye" size={13}/> Détails</button>
          </div>
        </>}
        {s.status === 'reserved' && <button className="btn btn-warn" style={{ justifyContent: 'center' }}>Réservée — Annuler ma réservation</button>}
        {s.status === 'ride' && <button className="btn btn-ghost" style={{ justifyContent: 'center' }} disabled>● En course par un autre utilisateur</button>}
        {(s.status === 'low' || s.status === 'damaged' || s.status === 'maintenance' || s.status === 'charging') && <button className="btn btn-ghost" style={{ justifyContent: 'center' }} disabled>{meta.label} — indisponible</button>}
      </div>
    </div>
  );
};

const SmartMap = ({ height = 540, mode = 'user', showSidePanel = true, autoSelect = true }) => {
  const scooters = useAnimatedScooters();
  const [selected, setSelected] = useStateMap(autoSelect ? scooters[1] : null);
  const [selectedStation, setSelectedStation] = useStateMap(null);
  const [filter, setFilter] = useStateMap('all');
  const [search, setSearch] = useStateMap('');
  const [zoom, setZoom] = useStateMap(1);

  const filteredScooters = useMemoMap(() => {
    let list = scooters;
    if (filter === 'available') list = list.filter((s) => s.status === 'available');
    else if (filter === 'near') list = list.filter((s) => s.dist < 1.5 && s.status === 'available');
    else if (filter === 'highbat') list = list.filter((s) => s.battery > 70);
    else if (filter === 'charging') list = list.filter((s) => s.status === 'charging');
    else if (filter === 'maintenance') list = list.filter((s) => s.status === 'maintenance' || s.status === 'damaged');
    if (search) list = list.filter((s) => s.id.toLowerCase().includes(search.toLowerCase()) || s.loc.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [scooters, filter, search]);

  const showStations = filter === 'all' || filter === 'stations';

  return (
    <div className={'smartmap mode-' + mode} style={{ minHeight: height, height }}>
      <div className="smartmap-grid"/>
      <div className="smartmap-streets" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>{STREETS_SVG}</div>

      {/* Geo zones (svg overlay) */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', transform: `scale(${zoom})`, transformOrigin: 'center' }}>
        {GEOZONES.map((z) => (
          <g key={z.id}>
            <path d={z.d} fill={ZONE_COLORS[z.kind].fill} stroke={ZONE_COLORS[z.kind].stroke} strokeWidth="0.25" strokeDasharray={z.kind === 'forbidden' ? '0.6 0.4' : '0'}/>
          </g>
        ))}
        {/* active ride paths */}
        {ACTIVE_RIDES.map((r) => (
          <g key={r.id}>
            <path d={r.path} stroke="rgba(217, 110, 63, 0.5)" strokeWidth="0.35" strokeDasharray="0.6 0.4" fill="none"/>
            <path d={r.path} stroke="#d96e3f" strokeWidth="0.55" fill="none" strokeLinecap="round" pathLength="100" style={{ strokeDasharray: '8 92', strokeDashoffset: -((Date.now() / 30) % 100) }}/>
          </g>
        ))}
      </svg>

      {/* Zone labels */}
      {ZONE_LABELS.map((z, i) => (
        <div key={i} className="smartmap-zone-label" style={{ left: z.x + '%', top: z.y + '%' }}>{z.label}</div>
      ))}

      {/* User position */}
      {mode === 'user' && <UserMarker/>}

      {/* Stations */}
      {showStations && STATIONS_BASE.map((st) => (
        <StationMarker key={st.code} st={st} selected={selectedStation?.code === st.code} onClick={(x) => { setSelectedStation(x); setSelected(null); }}/>
      ))}

      {/* Scooters */}
      {filteredScooters.map((s) => (
        <ScooterMarker key={s.id} s={s} selected={selected?.id === s.id} onClick={(x) => { setSelected(x); setSelectedStation(null); }}/>
      ))}

      {/* Filters chips */}
      <div className="smartmap-filters">
        {FILTERS.map((f) => (
          <div key={f.id} className={'smap-filter ' + (filter === f.id ? 'active' : '')} onClick={() => setFilter(f.id)}>
            {f.color && <span className="swatch" style={{ background: f.color === 'ink' ? 'var(--ink)' : `var(--${f.color})` }}/>}
            {f.label}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="smartmap-search">
        <Icon name="search" size={13}/>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher MS-XXX ou adresse…"/>
        {search && <span onClick={() => setSearch('')} style={{ cursor: 'pointer', color: 'var(--ink-3)' }}><Icon name="x" size={12}/></span>}
      </div>

      {/* Zoom controls */}
      <div className="smartmap-controls">
        <div className="smartmap-ctrl" onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}>+</div>
        <div className="smartmap-ctrl" onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}>−</div>
        <div className="smartmap-ctrl" onClick={() => { setSelected(null); setSelectedStation(null); }} title="Recentrer"><Icon name="pin" size={14}/></div>
        <div className="smartmap-ctrl" title="Plein écran"><Icon name="layers" size={14}/></div>
      </div>

      {/* Legend */}
      <div className="smartmap-legend">
        <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.12em', marginBottom: 8 }}>● LÉGENDE</div>
        {[
          ['electric', 'Disponible'],
          ['cyan', 'Réservée · en charge'],
          ['warm', 'En course'],
          ['warn', 'Batterie faible'],
          ['danger', 'En panne · maintenance'],
        ].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-2)', marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${c})`, boxShadow: `0 0 6px var(--${c})` }}/>
            {l}
          </div>
        ))}
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          {[
            ['rgba(197, 255, 58, 0.5)', 'Zone autorisée'],
            ['rgba(255, 184, 77, 0.55)', 'Vitesse réduite'],
            ['rgba(111, 232, 255, 0.55)', 'Stationnement'],
            ['rgba(255, 107, 107, 0.55)', 'Interdite'],
          ].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-2)', marginBottom: 4 }}>
              <span style={{ width: 12, height: 8, borderRadius: 2, background: c, border: `1px dashed ${c}` }}/>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {showSidePanel && selected && <ScooterSidePanel s={selected} onClose={() => setSelected(null)}/>}
    </div>
  );
};

export { SmartMap };
/** Same list as in the carte (stations list UI on landing/admin). */
export const STATIONS = STATIONS_BASE;

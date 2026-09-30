// Maintenance Dashboard
import { useState as useStateM } from 'react';
import { Icon, ScooterSVG } from './ui.jsx';
import { SmartMap } from './map.jsx';
import { Sidebar } from './user.jsx';

const MAINT_NAV = [
  { sec: 'INTERVENTIONS', items: [
    { id: 'overview', icn: 'wrench', label: 'Vue technicien' },
    { id: 'urgent', icn: 'flame', label: 'Urgences', badge: '4' },
    { id: 'battery', icn: 'battery', label: 'Batteries faibles', badge: '7' },
    { id: 'damaged', icn: 'truck', label: 'Endommagées', badge: '3' },
  ]},
  { sec: 'OPÉRATIONS', items: [
    { id: 'charging', icn: 'plug', label: 'Charges en cours' },
    { id: 'history', icn: 'file', label: 'Historique réparations' },
    { id: 'map', icn: 'map', label: 'Carte interventions' },
  ]},
  { sec: 'ÉQUIPE', items: [
    { id: 'techs', icn: 'user', label: 'Techniciens' },
    { id: 'settings', icn: 'settings', label: 'Paramètres' },
  ]},
];

const MaintTask = ({ task }) => (
  <div className="card" style={{ padding: 22 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{task.id}</div>
      <span className={'pill ' + task.priorityClass}><span className="dot"/>{task.priority}</span>
    </div>
    <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
        <ScooterSVG size={44}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Instrument Serif', fontSize: 28, lineHeight: 1 }}>{task.scooter}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{task.location}</div>
      </div>
    </div>
    <div style={{ marginTop: 16, padding: 14, background: 'var(--surface-2)', borderRadius: 12 }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>● PROBLÈME</div>
      <div style={{ fontSize: 14, marginTop: 6 }}>{task.issue}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
      <span>Tech · {task.tech}</span>
      <span className={task.statusClass}>● {task.status}</span>
    </div>
    <button className={'btn ' + (task.priorityClass === 'danger' ? 'btn-primary' : 'btn-ghost')} style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: 10 }}>
      {task.action} <span className="arrow"><Icon name="arr" size={11}/></span>
    </button>
  </div>
);

const TASKS = [
  { id: 'TASK-2034', priority: 'URGENT', priorityClass: 'danger', scooter: 'MZ-085', location: 'Sidi Bouzid · 33.249°N', issue: 'Roue avant déformée, frein avant non opérationnel après chute signalée par utilisateur.', tech: 'Karim H.', status: 'Pending', statusClass: 'mono', action: 'Prendre en charge' },
  { id: 'TASK-2033', priority: 'HAUTE', priorityClass: 'warn', scooter: 'MZ-064', location: 'Corniche · 33.231°N', issue: 'Batterie 18% en bord de zone. Remplacement urgent pour éviter immobilisation.', tech: 'Anas B.', status: 'En charge', statusClass: 'mono', action: 'Détails' },
  { id: 'TASK-2032', priority: 'MOYENNE', priorityClass: 'cyan', scooter: 'MZ-073', location: 'Marjane · 33.225°N', issue: 'Phare avant intermittent. Connecteur à vérifier.', tech: 'Karim H.', status: 'En cours', statusClass: 'mono', action: 'Détails' },
  { id: 'TASK-2031', priority: 'BASSE', priorityClass: '', scooter: 'MZ-031', location: 'Faculté · 33.241°N', issue: 'Vibration anormale signalée. Diagnostic complet à programmer.', tech: 'Non assigné', status: 'Pending', statusClass: 'mono', action: 'Assigner' },
];

const MaintOverview = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Centre de <span className="em">maintenance</span></h1>
        <div className="dash-sub">Suivez les batteries, les pannes et les interventions techniques — Equipe Atelier EJD · Mai 2026</div>
      </div>
      <div className="dash-head-actions">
        <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Trottinette, technicien…"/></div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nouvelle mission</button>
      </div>
    </div>

    <div className="kpi-grid">
      <div className="kpi">
        <div className="kpi-label"><span>Missions urgentes</span><Icon name="flame" size={14}/></div>
        <div className="kpi-value" style={{ color: 'var(--danger)' }}>4</div>
        <div className="kpi-delta down">↑ +2 dernière heure</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Batteries faibles</span><Icon name="battery" size={14}/></div>
        <div className="kpi-value" style={{ color: 'var(--warn)' }}>7</div>
        <div className="kpi-delta">À collecter avant 18h</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>En atelier</span><Icon name="wrench" size={14}/></div>
        <div className="kpi-value">12</div>
        <div className="kpi-delta">5 réparations finalisées</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Techniciens dispo.</span><Icon name="user" size={14}/></div>
        <div className="kpi-value">6<span className="em">/8</span></div>
        <div className="kpi-delta">2 sur le terrain</div>
      </div>
    </div>

    <div className="grid-2">
      <div>
        <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 32, margin: '0 0 16px', letterSpacing: '-0.01em' }}>Tâches actives</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TASKS.map((t, i) => <MaintTask key={i} task={t}/>)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-head" style={{ padding: '20px 24px 16px', marginBottom: 0 }}>
            <h3 className="card-title">Carte interventions</h3>
            <span className="card-sub">● 4 zones critiques</span>
          </div>
          <SmartMap height={360}/>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Équipe technicien</h3><span className="card-sub">2 sur le terrain</span></div>
          {[
            ['KH', 'Karim Hassani', 'En intervention · MZ-085', 'electric'],
            ['AB', 'Anas Belkadi', 'En charge · MZ-064', 'cyan'],
            ['YL', 'Youssef Larbi', 'Atelier EJD', ''],
            ['SR', 'Sara Rachidi', 'Atelier EJD', ''],
            ['MO', 'Mehdi Ouali', 'Pause', 'warn'],
            ['FN', 'Fatima Nadiri', 'Off', 'danger'],
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontFamily: 'Instrument Serif', fontSize: 14 }}>{t[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{t[1]}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{t[2]}</div>
              </div>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${t[3] || 'ink-3'})` }}/>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head">
        <h3 className="card-title">Historique des interventions</h3>
        <span className="card-sub">7 derniers jours</span>
      </div>
      <table className="table">
        <thead><tr><th>Date</th><th>Trottinette</th><th>Problème</th><th>Technicien</th><th>Durée</th><th>Pièces</th><th>Statut</th></tr></thead>
        <tbody>
          {[
            ['14/05 09:14', 'MZ-085', 'Roue déformée + frein', 'Karim H.', '—', 'ETA — pièces', 'cyan'],
            ['13/05 17:32', 'MZ-051', 'Batterie 12% — rechargée', 'Anas B.', '02h 40', 'aucune', 'ok'],
            ['13/05 11:20', 'MZ-073', 'Phare intermittent', 'Karim H.', '00h 35', 'connecteur LED', 'ok'],
            ['12/05 15:08', 'MZ-018', 'Klaxon HS', 'Youssef L.', '00h 15', 'klaxon', 'ok'],
            ['12/05 10:44', 'MZ-104', 'Pneu crevé arrière', 'Sara R.', '01h 10', 'chambre à air', 'ok'],
            ['11/05 14:21', 'MZ-022', 'Frein arrière mou', 'Karim H.', '00h 45', 'plaquettes', 'ok'],
            ['11/05 09:55', 'MZ-046', 'Diagnostic complet', 'Sara R.', '01h 30', 'aucune', 'ok'],
            ['10/05 16:00', 'MZ-009', 'Écran défaillant', 'Youssef L.', '02h 20', 'écran LCD', 'ok'],
          ].map((r, i) => (
            <tr key={i}>
              <td className="mono">{r[0]}</td>
              <td className="mono" style={{ color: 'var(--electric)' }}>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td className="mono">{r[4]}</td>
              <td className="mono">{r[5]}</td>
              <td><span className={'pill ' + r[6]}><span className="dot"/>{r[6] === 'ok' ? 'Réparée' : 'En cours'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const MaintBattery = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Batteries <span className="em">faibles</span></h1>
        <div className="dash-sub">7 trottinettes à collecter ou recharger avant 18h</div>
      </div>
      <div className="dash-head-actions">
        <button className="btn btn-primary"><Icon name="refresh" size={14}/> Optimiser tournée</button>
      </div>
    </div>
    <div className="grid-3">
      {[
        ['MZ-064', 18, 'Corniche', '0,9 km'],
        ['MZ-073', 12, 'Marjane', '1,4 km'],
        ['MZ-003', 14, 'Marjane', '1,4 km'],
        ['MZ-019', 22, 'Gare', '1,8 km'],
        ['MZ-088', 8, 'Faculté', '2,2 km'],
        ['MZ-112', 19, 'Cité Portugaise', '0,7 km'],
        ['MZ-095', 24, 'Sidi Bouzid', '2,9 km'],
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--electric)' }}>{s[0]}</div>
            <span className={'pill ' + (s[1] < 15 ? 'danger' : 'warn')}><span className="dot"/>{s[1]}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginTop: 24 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>POSITION</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 26 }}>{s[2]}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s[3]} de l'atelier</div>
            </div>
            <Icon name="battery" size={28}/>
          </div>
          <div style={{ height: 6, background: 'var(--bg)', borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
            <div style={{ width: s[1] + '%', height: '100%', background: s[1] < 15 ? 'var(--danger)' : 'var(--warn)' }}/>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: 10 }}><Icon name="map" size={12}/> Y aller</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 10 }}><Icon name="plug" size={12}/> Collecter</button>
          </div>
        </div>
      ))}
    </div>
  </>
);

const MaintDamaged = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Trottinettes <span className="em">endommagées</span></h1><div className="dash-sub">3 cas signalés · 1 critique · à diagnostiquer</div></div>
    </div>
    <div className="grid-2">
      {[
        { code: 'MZ-085', sev: 'danger', sl: 'Critique', issue: 'Chute utilisateur sur la corniche · roue avant déformée, frein avant inopérant. Photos jointes au signalement.', reporter: 'Salma A.', date: '14/05 09:14', loc: 'Sidi Bouzid' },
        { code: 'MZ-064', sev: 'warn', sl: 'Modérée', issue: 'Klaxon HS et batterie qui chute trop vite (passe de 60% à 18% en 2 km). À diagnostiquer.', reporter: 'Système auto-diag', date: '14/05 11:32', loc: 'Corniche' },
        { code: 'MZ-031', sev: 'cyan', sl: 'Mineure', issue: 'Vibration anormale signalée par 2 utilisateurs. Probable problème de roulement arrière.', reporter: 'Omar T.', date: '13/05 18:44', loc: 'Faculté' },
      ].map((d, i) => (
        <div key={i} className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{d.code} · {d.loc}</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 36, marginTop: 4, letterSpacing: '-0.01em' }}>{d.sl}</div>
            </div>
            <span className={'pill ' + d.sev}><span className="dot"/>{d.sl}</span>
          </div>
          <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 14, marginTop: 16 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>● DESCRIPTION</div>
            <div style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{d.issue}</div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>Signalé par {d.reporter}</span>
            <span>· {d.date}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Voir photos</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Assigner technicien</button>
          </div>
        </div>
      ))}
    </div>
  </>
);

const MaintCharging = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Charges <span className="em">en cours</span></h1><div className="dash-sub">12 trottinettes à l'atelier EJD · capacité 16 emplacements</div></div>
    </div>
    <div className="card">
      <table className="table">
        <thead><tr><th>Slot</th><th>Trottinette</th><th>Niveau</th><th>ETA fin</th><th>Connecté depuis</th><th>Statut</th></tr></thead>
        <tbody>
          {[
            ['SL-01', 'MZ-051', 12, 78, '02h 14', '00h 32', 'electric'],
            ['SL-02', 'MZ-003', 14, 82, '02h 02', '00h 28', 'electric'],
            ['SL-03', 'MZ-019', 22, 88, '01h 38', '00h 22', 'electric'],
            ['SL-04', 'MZ-088', 8, 64, '03h 12', '00h 48', 'electric'],
            ['SL-05', 'MZ-046', 100, 100, 'Terminé', '04h 02', 'ok'],
            ['SL-06', 'MZ-022', 100, 100, 'Terminé', '03h 58', 'ok'],
            ['SL-07', 'MZ-095', 41, 95, '00h 54', '00h 12', 'electric'],
            ['SL-08', 'MZ-112', 28, 82, '01h 32', '00h 18', 'electric'],
            ['SL-09', '—', '—', '—', '—', '—', ''],
            ['SL-10', '—', '—', '—', '—', '—', ''],
          ].map((r, i) => (
            <tr key={i}>
              <td className="mono">{r[0]}</td>
              <td className="mono" style={{ color: r[1] === '—' ? 'var(--ink-3)' : 'var(--electric)' }}>{r[1]}</td>
              <td>
                {r[2] !== '—' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: r[3] + '%', height: '100%', background: 'linear-gradient(90deg, var(--warn), var(--electric))' }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 11 }}>{r[2]}→{r[3]}%</span>
                  </div>
                )}
                {r[2] === '—' && <span className="mono" style={{ color: 'var(--ink-3)' }}>—</span>}
              </td>
              <td className="mono">{r[4]}</td>
              <td className="mono">{r[5]}</td>
              <td>{r[6] ? <span className={'pill ' + r[6]}><span className="dot"/>{r[6] === 'ok' ? 'Prêt' : 'En charge'}</span> : <span className="mono" style={{ color: 'var(--ink-3)' }}>Libre</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const MaintenanceDashboard = () => {
  const [active, setActive] = useStateM('overview');
  return (
    <div className="dash" data-screen-label="Maintenance">
      <Sidebar nav={MAINT_NAV} active={active} onChange={setActive} kind="maintenance"/>
      <main className="dash-main">
        {active === 'overview' && <MaintOverview/>}
        {active === 'urgent' && <MaintDamaged/>}
        {active === 'battery' && <MaintBattery/>}
        {active === 'damaged' && <MaintDamaged/>}
        {active === 'charging' && <MaintCharging/>}
        {active === 'history' && <MaintOverview/>}
        {active === 'map' && <MaintOverview/>}
        {active === 'techs' && <MaintOverview/>}
        {active === 'settings' && <MaintOverview/>}
      </main>
    </div>
  );
};

export { MaintenanceDashboard };

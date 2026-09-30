// Admin "Control Tower" Dashboard
import { useState as useStateAd } from 'react';
import { Icon, Counter } from './ui.jsx';
import { SmartMap, STATIONS } from './map.jsx';
import { Sidebar, LineChart, SimpleChart } from './user.jsx';

const ADMIN_NAV = [
  { sec: 'PILOTAGE', items: [
    { id: 'analytics', icn: 'chart', label: 'Analytics' },
    { id: 'live', icn: 'bolt', label: 'Live Rides', badge: '23' },
    { id: 'fleet', icn: 'scooter', label: 'Flotte' },
    { id: 'stations', icn: 'pin', label: 'Stations' },
  ]},
  { sec: 'OPÉRATIONS', items: [
    { id: 'users', icn: 'user', label: 'Utilisateurs' },
    { id: 'verifications', icn: 'check', label: 'Vérifications', badge: '12' },
    { id: 'staff-requests', icn: 'mail', label: 'Demandes équipe', badge: '4' },
    { id: 'pwd-tickets', icn: 'help', label: 'Tickets MDP', badge: '2' },
    { id: 'maintenance', icn: 'wrench', label: 'Maintenance', badge: '8' },
    { id: 'earnings', icn: 'wallet', label: 'Revenus' },
    { id: 'promos', icn: 'discount', label: 'Codes promo' },
    { id: 'geozones', icn: 'layers', label: 'Zones géo' },
  ]},
  { sec: 'SYSTÈME', items: [
    { id: 'reports', icn: 'file', label: 'Rapports' },
    { id: 'settings', icn: 'settings', label: 'Réglages' },
  ]},
];

// ============ ID Document mock ============
const IdDocPreview = ({ name = 'BENNANI', firstName = 'YASSINE', dob = '14/03/1996', num = 'BE284902', type = 'CNI' }) => (
  <div className="id-doc">
    <div className="id-head">
      <span className="id-flag">● ROYAUME DU MAROC</span>
      <span className="id-type">{type}</span>
    </div>
    <div className="id-body">
      <div className="id-photo"/>
      <div className="id-info">
        <div className="lbl">NOM</div>
        <div className="val">{name}</div>
        <div className="lbl">PRÉNOM</div>
        <div className="val">{firstName}</div>
        <div className="lbl">DATE DE NAISSANCE</div>
        <div className="val">{dob}</div>
      </div>
    </div>
    <div className="id-mrz">{`ID<<MAR<${num}<<<<<<<<<<<<`}</div>
  </div>
);

// ============ Verifications ============
const VERIFICATIONS = [
  { id: 'V-2034', name: 'Karim Benjelloun', email: 'k.benjelloun@example.ma', phone: '+212 6 88 22 11 90', dob: '04/07/1998', age: 27, doc: 'CNI', docFile: 'cni_karim.jpg', status: 'pending', date: '14/05 10:32', firstName: 'KARIM', lastName: 'BENJELLOUN', num: 'BJ098234' },
  { id: 'V-2033', name: 'Salma El Haddaoui', email: 'salma.h@example.ma', phone: '+212 6 70 12 88 44', dob: '22/11/2001', age: 24, doc: 'Passeport', docFile: 'passeport_salma.pdf', status: 'pending', date: '14/05 09:14', firstName: 'SALMA', lastName: 'EL HADDAOUI', num: 'PS204418' },
  { id: 'V-2032', name: 'Omar Tahiri', email: 'omar.t@example.ma', phone: '+212 6 33 44 55 67', dob: '15/02/1995', age: 31, doc: 'CNI', docFile: 'cni_omar.jpg', status: 'pending', date: '13/05 18:44', firstName: 'OMAR', lastName: 'TAHIRI', num: 'OT442391' },
  { id: 'V-2031', name: 'Imane Rahal', email: 'imane.r@example.ma', phone: '+212 6 99 77 66 11', dob: '08/05/1999', age: 26, doc: 'CNI', docFile: 'cni_imane.jpg', status: 'approved', date: '13/05 11:20', firstName: 'IMANE', lastName: 'RAHAL', num: 'IR557724' },
  { id: 'V-2030', name: 'Hicham Cherkaoui', email: 'h.cherk@example.ma', phone: '+212 6 22 33 44 55', dob: '02/01/2008', age: 17, doc: 'CNI', docFile: 'cni_hicham.jpg', status: 'rejected', date: '12/05 15:08', firstName: 'HICHAM', lastName: 'CHERKAOUI', num: 'HC112299', reason: 'Mineur (17 ans) — ne remplit pas la condition d\'âge minimal de 18 ans.' },
];

const AdminVerifications = () => {
  const [selected, setSelected] = useStateAd(VERIFICATIONS[0]);
  return (
    <>
      <div className="dash-head">
        <div><h1 className="dash-title">Vérification des <span className="em">utilisateurs</span></h1><div className="dash-sub">12 dossiers en attente · 4 critiques · validation sous 24h</div></div>
        <div className="dash-head-actions">
          <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Email, nom, numéro doc…"/></div>
        </div>
      </div>
      <div className="kpi-grid">
        {[
          ['En attente', '12', '4 prioritaires'],
          ['Vérifiés ce mois', '184', '↑ +24%'],
          ['Rejetés', '6', 'Mineur · doc illisible'],
          ['Temps moyen', '4h 12', '↓ −18min'],
        ].map(([l, v, d], i) => (
          <div key={i} className="kpi">
            <div className="kpi-label"><span>{l}</span></div>
            <div className="kpi-value" style={{ fontSize: 40 }}>{v}</div>
            <div className="kpi-delta">{d}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3 className="card-title">Dossiers</h3><span className="card-sub">Trier · récents</span></div>
          {VERIFICATIONS.map((v) => (
            <div key={v.id} onClick={() => setSelected(v)} style={{
              padding: 16, marginBottom: 8, borderRadius: 14, cursor: 'pointer',
              border: '1px solid ' + (selected.id === v.id ? 'var(--electric)' : 'var(--border)'),
              background: selected.id === v.id ? 'var(--electric-soft)' : 'var(--surface-2)',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{v.id} · {v.date}</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{v.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{v.age} ans · {v.doc}</div>
                </div>
                <span className={'pill ' + (v.status === 'approved' ? 'ok' : v.status === 'rejected' ? 'danger' : 'warn')}>
                  <span className="dot"/>{v.status === 'approved' ? 'Vérifié' : v.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">{selected.name}</h3>
            <span className={'pill ' + (selected.status === 'approved' ? 'ok' : selected.status === 'rejected' ? 'danger' : 'warn')}>
              <span className="dot"/>{selected.status === 'approved' ? 'Vérifié' : selected.status === 'rejected' ? 'Rejeté' : 'En attente'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              ['EMAIL', selected.email],
              ['TÉLÉPHONE', selected.phone],
              ['DATE DE NAISSANCE', selected.dob],
              ['ÂGE', `${selected.age} ans ${selected.age >= 18 ? '✓' : '✗ Mineur'}`],
              ['DOCUMENT', selected.doc],
              ['FICHIER', selected.docFile],
            ].map(([l, v]) => (
              <div key={l}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{l}</div>
                <div style={{ fontSize: 13, marginTop: 4, color: l === 'ÂGE' && selected.age < 18 ? 'var(--danger)' : 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 8 }}>● DOCUMENT JOINT — ZONE SÉCURISÉE</div>
          <IdDocPreview firstName={selected.firstName} name={selected.lastName} dob={selected.dob} num={selected.num} type={selected.doc === 'CNI' ? 'CNI' : 'PSP'}/>
          {selected.reason && (
            <div className="field-error" style={{ marginTop: 16 }}><Icon name="x" size={14}/>{selected.reason}</div>
          )}
          {selected.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><Icon name="check" size={14}/> Approuver</button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Plus d'infos</button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}><Icon name="x" size={14}/> Rejeter</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============ Staff Access Requests ============
const STAFF_REQUESTS = [
  { id: 'REQ-2026-1842', name: 'Karim Hassani', email: 'k.hassani@mazaganscoot.ma', mat: 'MZ-T-0042', role: 'Maintenance', motif: 'Recrutement validé par RH (M. El Mansouri) — démarrage atelier maintenance El Jadida.', doc: 'cni_karim.jpg', date: '14/05 09:14', status: 'pending' },
  { id: 'REQ-2026-1841', name: 'Anas Belkadi', email: 'a.belkadi@mazaganscoot.ma', mat: 'MZ-T-0043', role: 'Maintenance', motif: 'Embauche atelier — technicien junior. Diplôme génie électrique 2024.', doc: 'cni_anas.jpg', date: '13/05 16:28', status: 'pending' },
  { id: 'REQ-2026-1840', name: 'Souad Bekkari', email: 's.bekkari@mazaganscoot.ma', mat: 'MZ-S-0011', role: 'Resp. station', motif: 'Gestion station S05 Faculté + S04 Cité Portugaise. Background hospitality 8 ans.', doc: 'cni_souad.jpg', date: '13/05 11:02', status: 'pending' },
  { id: 'REQ-2026-1839', name: 'Mehdi Ouali', email: 'm.ouali@mazaganscoot.ma', mat: 'MZ-T-0044', role: 'Maintenance', motif: 'Démarrage immédiat pour pic estival — embauche CDD.', doc: 'cni_mehdi.jpg', date: '12/05 14:44', status: 'pending' },
];

const AdminStaffRequests = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Demandes d'accès <span className="em">équipe</span></h1><div className="dash-sub">4 demandes en attente · validation manuelle obligatoire</div></div>
      <button className="btn btn-primary"><Icon name="plus" size={14}/> Inviter manuellement</button>
    </div>
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Toutes les demandes</h3>
        <div className="tag-row">
          <span className="pill warn"><span className="dot"/>En attente · 4</span>
          <span className="pill ok"><span className="dot"/>Approuvées · 12</span>
          <span className="pill danger"><span className="dot"/>Refusées · 2</span>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Ticket</th><th>Demandeur</th><th>Email pro</th><th>Matricule</th><th>Rôle</th><th>Date</th><th>Doc.</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {STAFF_REQUESTS.map((r) => (
            <tr key={r.id}>
              <td className="mono" style={{ color: 'var(--electric)' }}>{r.id}</td>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'Instrument Serif', fontSize: 14 }}>{r.name.split(' ').map(p => p[0]).join('')}</div>{r.name}</div></td>
              <td className="mono">{r.email}</td>
              <td className="mono">{r.mat}</td>
              <td>{r.role}</td>
              <td className="mono">{r.date}</td>
              <td><Icon name="file" size={14}/></td>
              <td><span className="pill warn"><span className="dot"/>En attente</span></td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: 11 }}><Icon name="check" size={11}/></button>
                  <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }}>Créer compte</button>
                  <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 11 }}><Icon name="x" size={11}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid-2" style={{ marginTop: 16 }}>
      <div className="card">
        <div className="card-head"><h3 className="card-title">Détail · {STAFF_REQUESTS[0].name}</h3><span className="card-sub">{STAFF_REQUESTS[0].id}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            ['EMAIL', STAFF_REQUESTS[0].email],
            ['MATRICULE', STAFF_REQUESTS[0].mat],
            ['RÔLE DEMANDÉ', STAFF_REQUESTS[0].role],
            ['DATE DEMANDE', STAFF_REQUESTS[0].date],
          ].map(([l, v]) => (
            <div key={l}><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{l}</div><div style={{ fontSize: 13, marginTop: 4 }}>{v}</div></div>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 6 }}>● MOTIF</div>
        <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 12, fontSize: 13, lineHeight: 1.55 }}>{STAFF_REQUESTS[0].motif}</div>
      </div>
      <div className="card">
        <div className="card-head"><h3 className="card-title">Document joint</h3><span className="card-sub">Zone sécurisée</span></div>
        <IdDocPreview firstName="KARIM" name="HASSANI" dob="22/08/1990" num="KH773811"/>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
          Document chiffré · accès tracé · ne pas redistribuer
        </div>
      </div>
    </div>
  </>
);

// ============ Password Tickets ============
const PWD_TICKETS = [
  { id: 'PWD-2026-0418', email: 'y.larbi@mazaganscoot.ma', mat: 'MZ-T-0039', role: 'Maintenance', motif: 'MDP oublié après congés. Pas d\'accès au gestionnaire.', date: '14/05 11:42', status: 'pending' },
  { id: 'PWD-2026-0417', email: 's.rachidi@mazaganscoot.ma', mat: 'MZ-T-0041', role: 'Maintenance', motif: 'Changement de téléphone — perte 2FA.', date: '13/05 18:02', status: 'pending' },
  { id: 'PWD-2026-0416', email: 'f.nadiri@mazaganscoot.ma', mat: 'MZ-T-0038', role: 'Maintenance', motif: 'Retour de mission terrain — compte verrouillé.', date: '12/05 09:31', status: 'reset' },
];

const AdminPwdTickets = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Tickets <span className="em">mot de passe</span></h1><div className="dash-sub">Demandes de réinitialisation des comptes internes · vérification manuelle</div></div>
    </div>
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Demandes</h3>
        <div className="tag-row">
          <span className="pill warn"><span className="dot"/>En attente · 2</span>
          <span className="pill ok"><span className="dot"/>Réinitialisés · 8</span>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Ticket</th><th>Email</th><th>Matricule</th><th>Rôle</th><th>Motif</th><th>Date</th><th>Statut</th><th>Action</th></tr></thead>
        <tbody>
          {PWD_TICKETS.map((t) => (
            <tr key={t.id}>
              <td className="mono" style={{ color: 'var(--electric)' }}>{t.id}</td>
              <td className="mono">{t.email}</td>
              <td className="mono">{t.mat}</td>
              <td>{t.role}</td>
              <td style={{ maxWidth: 280, fontSize: 13 }}>{t.motif}</td>
              <td className="mono">{t.date}</td>
              <td><span className={'pill ' + (t.status === 'reset' ? 'ok' : 'warn')}><span className="dot"/>{t.status === 'reset' ? 'MDP envoyé' : 'En attente'}</span></td>
              <td>
                {t.status === 'pending' ? (
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}><Icon name="refresh" size={11}/> Réinitialiser</button>
                ) : (
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Email envoyé</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="card" style={{ marginTop: 16, padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--warn)', color: '#14181f', display: 'grid', placeItems: 'center' }}><Icon name="settings" size={24}/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, lineHeight: 1.2 }}>Sécurité des réinitialisations internes</div>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '4px 0 0', lineHeight: 1.5 }}>
            Contrairement aux comptes clients, les MDP internes ne sont jamais réinitialisés automatiquement. Vérifiez l'identité du demandeur par téléphone avant de cliquer "Réinitialiser".
            Un mot de passe temporaire à usage unique est envoyé à l'email professionnel et doit être changé à la première connexion.
          </p>
        </div>
      </div>
    </div>
  </>
);

const AdminAnalytics = () => (
  <>
    <div className="dash-head">
      <div>
        <h1 className="dash-title">Control <span className="em">Tower</span></h1>
        <div className="dash-sub">Pilotez votre flotte, vos stations et vos revenus en temps réel — Mercredi 14 mai · 14:32</div>
      </div>
      <div className="dash-head-actions">
        <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Rechercher utilisateur, trottinette, ticket…"/><span className="kbd">⌘K</span></div>
        <button className="btn btn-ghost"><Icon name="download" size={14}/></button>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nouveau</button>
      </div>
    </div>

    <div className="kpi-grid">
      <div className="kpi">
        <div className="kpi-label"><span>Utilisateurs</span><Icon name="user" size={14}/></div>
        <div className="kpi-value"><Counter to={3247}/></div>
        <div className="kpi-delta">↑ +124 cette semaine</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Trottinettes actives</span><Icon name="scooter" size={14}/></div>
        <div className="kpi-value"><Counter to={108}/><span className="em">/120</span></div>
        <div className="kpi-delta">90% de la flotte en service</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Courses en direct</span><Icon name="bolt" size={14}/></div>
        <div className="kpi-value" style={{ color: 'var(--electric)' }}><Counter to={23}/></div>
        <div className="kpi-delta">● LIVE · pic à 14h</div>
      </div>
      <div className="kpi">
        <div className="kpi-label"><span>Revenu aujourd'hui</span><Icon name="wallet" size={14}/></div>
        <div className="kpi-value"><Counter to={8420}/><span className="em"> MAD</span></div>
        <div className="kpi-delta">↑ +18% vs hier</div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Revenus mensuels</h3>
          <div className="tag-row">
            <span className="pill electric"><span className="dot"/>MAD 2026</span>
            <span className="pill"><span className="dot"/>MAD 2025</span>
          </div>
        </div>
        <LineChart data={[42000, 48000, 51000, 58000, 64000, 71000, 76000, 82000, 79000, 84000, 92000, 98000]} height={240}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-3)' }}>
          {['JAN','FÉV','MAR','AVR','MAI','JUI','JUL','AOÛ','SEP','OCT','NOV','DÉC'].map(m => <span key={m}>{m}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>TOTAL ANNÉE</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 36 }}>845K <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>MAD</span></div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>MOYENNE / MOIS</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 36 }}>70K <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>MAD</span></div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>CROISSANCE</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 36, color: 'var(--electric)' }}>+34%</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3 className="card-title">État de la flotte</h3><span className="card-sub">120 trottinettes</span></div>
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center', padding: '20px 0' }}>
          <svg viewBox="0 0 100 100" width="200" height="200">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="6"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--electric)" strokeWidth="6"
              strokeDasharray="180 252" strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--cyan)" strokeWidth="6"
              strokeDasharray="48 252" strokeDashoffset="-180" transform="rotate(-90 50 50)" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--warn)" strokeWidth="6"
              strokeDasharray="14 252" strokeDashoffset="-228" transform="rotate(-90 50 50)" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--danger)" strokeWidth="6"
              strokeDasharray="10 252" strokeDashoffset="-242" transform="rotate(-90 50 50)" strokeLinecap="round"/>
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 48 }}>120</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>FLOTTE</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
          {[
            ['electric', 'Disponibles', '85'],
            ['cyan', 'En course', '23'],
            ['warn', 'Batterie faible', '7'],
            ['danger', 'Maintenance', '5'],
          ].map(([c, l, n]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${c})` }}/>{l}</span>
              <span className="mono" style={{ fontSize: 12 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: 16 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '20px 24px 16px', marginBottom: 0 }}>
          <h3 className="card-title">Carte opérationnelle</h3>
          <span className="card-sub">120 trottinettes · 18 stations</span>
        </div>
        <SmartMap height={440}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Activité par heure</h3><span className="card-sub">Aujourd'hui</span></div>
          <SimpleChart values={[15, 25, 18, 12, 32, 48, 62, 75, 85, 92, 78, 68]} highlight={9}/>
          <div className="chart-x">
            {['6h','8h','10h','12h','14h','16h','18h','20h','22h','0h','2h','4h'].map(h => <span key={h} className="lbl">{h}</span>)}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Alertes</h3><span className="card-sub">8 actives</span></div>
          {[
            ['danger', 'MZ-085 endommagée signalée', 'Sidi Bouzid · il y a 4 min'],
            ['warn', 'MZ-064 batterie 18%', 'Centre · il y a 12 min'],
            ['warn', 'Station S06 Marjane saturée', '94% · il y a 22 min'],
            ['cyan', 'Pic d\'usage prévu 17h–19h', 'Météo favorable'],
          ].map(([c, t, m], i) => (
            <div key={i} className="notif">
              <span className="notif-dot" style={{ background: `var(--${c})` }}/>
              <div className="notif-body">
                <div className="title">{t}</div>
                <div className="meta">{m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head">
        <h3 className="card-title">Courses en direct</h3>
        <div className="tag-row">
          <span className="pill electric"><span className="dot"/>23 actives</span>
          <span className="pill cyan"><span className="dot"/>8 démarrent</span>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Code</th><th>Utilisateur</th><th>Départ</th><th>Durée</th><th>Distance</th><th>Coût</th><th>Batterie</th><th>Statut</th><th></th></tr></thead>
        <tbody>
          {[
            ['MZ-014', 'Yassine B.', '14:32', '00:14', '3,2 km', '32,50', 68, 'ride'],
            ['MZ-027', 'Salma A.', '14:18', '00:28', '5,8 km', '58,00', 52, 'ride'],
            ['MZ-051', 'Omar T.', '14:38', '00:08', '1,2 km', '12,80', 84, 'ride'],
            ['MZ-101', 'Khalid M.', '14:25', '00:21', '4,6 km', '46,40', 71, 'ride'],
            ['MZ-108', 'Imane R.', '14:33', '00:13', '2,9 km', '29,80', 63, 'ride'],
            ['MZ-117', 'Nadia E.', '14:40', '00:06', '0,9 km', '9,40', 79, 'ride'],
          ].map((r, i) => (
            <tr key={i}>
              <td className="mono" style={{ color: 'var(--electric)' }}>{r[0]}</td>
              <td>{r[1]}</td>
              <td className="mono">{r[2]}</td>
              <td className="mono">{r[3]}</td>
              <td className="mono">{r[4]}</td>
              <td className="mono">{r[5]} MAD</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, height: 5, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: r[6] + '%', height: '100%', background: r[6] > 30 ? 'var(--electric)' : 'var(--warn)' }}/>
                  </div>
                  <span className="mono" style={{ fontSize: 11 }}>{r[6]}%</span>
                </div>
              </td>
              <td><span className="pill electric"><span className="dot"/>LIVE</span></td>
              <td><span style={{ color: 'var(--ink-3)', cursor: 'pointer' }}><Icon name="eye" size={14}/></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const AdminUsers = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Utilisateurs<span className="em">.</span></h1><div className="dash-sub">3 247 inscrits · 1 842 actifs ce mois</div></div>
      <div className="dash-head-actions">
        <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Email, téléphone, nom…"/></div>
        <button className="btn btn-ghost"><Icon name="download" size={14}/> Export</button>
      </div>
    </div>
    <div className="kpi-grid">
      {[
        ['Total inscrits', '3 247', '↑ +124 cette semaine'],
        ['Vérifiés ID', '2 891', '89% du total'],
        ['Étudiants', '742', '23% — tarif réduit'],
        ['Bannis / suspendus', '14', 'Décisions modération'],
      ].map(([l, v, d], i) => (
        <div key={i} className="kpi">
          <div className="kpi-label"><span>{l}</span></div>
          <div className="kpi-value" style={{ fontSize: 40 }}>{v}</div>
          <div className="kpi-delta">{d}</div>
        </div>
      ))}
    </div>
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Tous les utilisateurs</h3>
        <div className="tag-row">
          <span className="pill electric"><span className="dot"/>Actifs</span>
          <span className="pill"><span className="dot"/>Vérifiés</span>
          <span className="pill cyan"><span className="dot"/>Étudiants</span>
          <span className="pill danger"><span className="dot"/>Bannis</span>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Utilisateur</th><th>Email</th><th>Téléphone</th><th>Wallet</th><th>Trajets</th><th>Inscription</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {[
            ['Yassine Bennani', 'yassine@example.ma', '+212 6 12 34 56 78', '124,50', 47, '04/03/26', 'ok'],
            ['Salma Alaoui', 'salma.a@example.ma', '+212 6 88 22 11 90', '38,20', 102, '12/01/26', 'ok'],
            ['Omar Tahiri', 'omar.t@example.ma', '+212 6 70 55 88 12', '256,00', 23, '08/04/26', 'ok'],
            ['Khalid Moufid', 'k.moufid@example.ma', '+212 6 33 44 55 67', '12,80', 8, '02/05/26', 'cyan'],
            ['Imane Rahal', 'imane.r@example.ma', '+212 6 99 77 66 11', '189,40', 64, '15/02/26', 'ok'],
            ['Nadia El Amrani', 'nadia.e@example.ma', '+212 6 41 28 19 03', '0,00', 2, '11/05/26', 'warn'],
            ['Hicham Cherkaoui', 'h.cherk@example.ma', '+212 6 22 33 44 55', '0,00', 12, '24/03/26', 'danger'],
          ].map((r, i) => (
            <tr key={i}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'Instrument Serif', fontSize: 14 }}>{r[0].split(' ').map(p => p[0]).join('')}</div>{r[0]}</div></td>
              <td className="mono">{r[1]}</td>
              <td className="mono">{r[2]}</td>
              <td className="mono">{r[3]} MAD</td>
              <td className="mono">{r[4]}</td>
              <td className="mono">{r[5]}</td>
              <td><span className={'pill ' + r[6]}><span className="dot"/>{r[6] === 'ok' ? 'Actif' : r[6] === 'cyan' ? 'Étudiant' : r[6] === 'warn' ? 'À vérifier' : 'Banni'}</span></td>
              <td>
                <div style={{ display: 'flex', gap: 8, color: 'var(--ink-3)' }}>
                  <Icon name="eye" size={14}/>
                  <Icon name="edit" size={14}/>
                  <Icon name="x" size={14}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const AdminFleet = () => {
  const STATUSES = {
    'available': { c: 'electric', l: 'Disponible' },
    'reserved': { c: 'cyan', l: 'Réservée' },
    'ride': { c: 'warm', l: 'En course' },
    'low': { c: 'warn', l: 'Batterie faible' },
    'charging': { c: 'cyan', l: 'En charge' },
    'damaged': { c: 'danger', l: 'Endommagée' },
    'maintenance': { c: 'danger', l: 'Maintenance' },
  };
  const fleet = [
    ['MZ-001', 'Pro 2', 92, 'available', 'Centre Ville', '08/04/26'],
    ['MZ-002', 'Pro 2', 78, 'ride', 'Corniche', '12/04/26'],
    ['MZ-003', 'Pro 2', 18, 'low', 'Marjane', '02/03/26'],
    ['MZ-014', 'Pro 2', 68, 'ride', 'Centre Ville', '14/04/26'],
    ['MZ-027', 'Pro 2', 52, 'ride', 'Gare', '22/04/26'],
    ['MZ-031', 'Lite', 84, 'reserved', 'Faculté', '05/05/26'],
    ['MZ-042', 'Pro 2', 95, 'available', 'Sidi Bouzid', '01/05/26'],
    ['MZ-051', 'Pro 2', 12, 'charging', 'Centre Ville', '08/05/26'],
    ['MZ-064', 'Lite', 18, 'damaged', 'Corniche', '20/04/26'],
    ['MZ-085', 'Pro 2', 0, 'maintenance', 'Atelier EJD', '11/05/26'],
    ['MZ-092', 'Pro 2', 88, 'available', 'Port', '07/05/26'],
    ['MZ-108', 'Pro 2', 41, 'ride', 'Cité Portugaise', '03/05/26'],
  ];
  return (
    <>
      <div className="dash-head">
        <div><h1 className="dash-title">Flotte<span className="em"> · scooters</span></h1><div className="dash-sub">120 trottinettes · 7 modèles · Auto-diag toutes les 30 min</div></div>
        <div className="dash-head-actions">
          <div className="search-bar"><Icon name="search" size={14}/><input placeholder="Code, modèle, station…"/></div>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Ajouter</button>
        </div>
      </div>
      <div className="kpi-grid">
        {[
          ['Total flotte', '120', '↑ +12 en mai'],
          ['En service', '108', '90% — excellent'],
          ['Batterie moy.', '64%', '↑ +3 pts vs hier'],
          ['Km parcourus', '14 820', 'Ce mois — record'],
        ].map(([l, v, d], i) => (
          <div key={i} className="kpi">
            <div className="kpi-label"><span>{l}</span></div>
            <div className="kpi-value" style={{ fontSize: 40 }}>{v}</div>
            <div className="kpi-delta">{d}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Inventaire</h3>
          <div className="tag-row">
            {Object.entries(STATUSES).map(([k, v]) => (
              <span key={k} className={'pill ' + v.c}><span className="dot"/>{v.l}</span>
            ))}
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Code</th><th>Modèle</th><th>Batterie</th><th>Statut</th><th>Station / Position</th><th>Dernière révision</th><th>Actions</th></tr></thead>
          <tbody>
            {fleet.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ color: 'var(--electric)' }}>{r[0]}</td>
                <td>{r[1]}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 50, height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: r[2] + '%', height: '100%', background: r[2] > 50 ? 'var(--electric)' : r[2] > 20 ? 'var(--warn)' : 'var(--danger)' }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 11 }}>{r[2]}%</span>
                  </div>
                </td>
                <td><span className={'pill ' + STATUSES[r[3]].c}><span className="dot"/>{STATUSES[r[3]].l}</span></td>
                <td>{r[4]}</td>
                <td className="mono">{r[5]}</td>
                <td>
                  <div style={{ display: 'flex', gap: 10, color: 'var(--ink-3)' }}>
                    <Icon name="map" size={14}/><Icon name="edit" size={14}/><Icon name="wrench" size={14}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const AdminStations = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Stations<span className="em"> El Jadida</span></h1><div className="dash-sub">18 stations · Capacité totale 192 emplacements</div></div>
      <div className="dash-head-actions">
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nouvelle station</button>
      </div>
    </div>
    <div className="grid-2">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '20px 24px 16px', marginBottom: 0 }}>
          <h3 className="card-title">Vue cartographique</h3>
        </div>
        <SmartMap height={520}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STATIONS.map((s, i) => {
          const pct = Math.round((s.available / s.slots) * 100);
          return (
            <div key={s.code} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{s.code} · EJD</div>
                  <div style={{ fontFamily: 'Instrument Serif', fontSize: 24, marginTop: 4 }}>{s.name}</div>
                </div>
                <span className={'pill ' + (pct > 60 ? 'ok' : pct > 30 ? 'warn' : 'danger')}><span className="dot"/>{pct > 60 ? 'OK' : pct > 30 ? 'Moyen' : 'Critique'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
                <span>{s.available}/{s.slots} dispo.</span>
                <span>{s.slots - s.available} emplacements libres</span>
                <span>● {pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg)', borderRadius: 4, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: pct > 60 ? 'var(--electric)' : pct > 30 ? 'var(--warn)' : 'var(--danger)' }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

const AdminEarnings = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Revenus<span className="em"> & marges</span></h1><div className="dash-sub">Année 2026 — projection 980 K MAD · objectif 1 M atteint à 84%</div></div>
      <div className="dash-head-actions">
        <button className="btn btn-ghost"><Icon name="download" size={14}/> Export comptable</button>
      </div>
    </div>
    <div className="kpi-grid">
      {[
        ['Aujourd\'hui', '8 420 MAD', '+18%', 'ok'],
        ['Cette semaine', '58 200 MAD', '+12%', 'ok'],
        ['Ce mois', '178 K MAD', '+24%', 'ok'],
        ['Marge brute', '64%', '+2 pts', 'ok'],
      ].map(([l, v, d, c], i) => (
        <div key={i} className="kpi">
          <div className="kpi-label"><span>{l}</span></div>
          <div className="kpi-value" style={{ fontSize: 40 }}>{v}</div>
          <div className={'kpi-delta ' + (c === 'down' ? 'down' : '')}>↑ {d}</div>
        </div>
      ))}
    </div>
    <div className="grid-2">
      <div className="card">
        <div className="card-head"><h3 className="card-title">Revenu quotidien</h3><span className="card-sub">30 derniers jours</span></div>
        <LineChart data={[3200, 3800, 4100, 3900, 4500, 5200, 6100, 5800, 5400, 6200, 7100, 6800, 6400, 7200, 8100, 7800, 7400, 8200, 8900, 8200, 7800, 8500, 9200, 8800, 8400, 9100, 9800, 9200, 8800, 8420]} height={260}/>
      </div>
      <div className="card">
        <div className="card-head"><h3 className="card-title">Par source</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['Trajets standards', 142000, 'electric'],
            ['Pass mensuels', 28000, 'cyan'],
            ['Tarif étudiant', 18500, 'warm'],
            ['Recharge wallet', 8200, ''],
          ].map(([l, v, c]) => (
            <div key={l}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{l}</span>
                <span className="mono" style={{ fontSize: 12 }}>{v.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: (v / 142000 * 100) + '%', height: '100%', background: c ? `var(--${c})` : 'var(--ink-3)' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const AdminPromos = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Codes <span className="em">promo</span></h1><div className="dash-sub">12 actifs · 4 expirent ce mois</div></div>
      <button className="btn btn-primary"><Icon name="plus" size={14}/> Créer un code</button>
    </div>
    <div className="grid-3">
      {[
        ['MAZAGAN26', 'Lancement pilote', '−25 MAD', 1247, '31/12/26', 'ok'],
        ['ÉTUDIANT', 'Faculté El Jadida', '−40%', 742, 'permanent', 'cyan'],
        ['CORNICHE', 'Promo corniche', '−5 MAD', 184, '30/06/26', 'ok'],
        ['NOUVEAU', 'Nouveau rider', '3 trajets', 521, 'permanent', 'electric'],
        ['MARJANE', 'Partenariat', '−10%', 92, '15/06/26', 'warn'],
        ['SUMMER26', 'Été 2026', '−20%', 0, '01/07/26', ''],
      ].map(([c, t, d, used, exp, status], i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div className="mono" style={{ fontSize: 11, padding: '6px 10px', background: 'var(--surface-2)', border: '1px dashed var(--border-strong)', borderRadius: 8, letterSpacing: '0.1em' }}>{c}</div>
            <span className={'pill ' + status}><span className="dot"/>{exp === 'permanent' ? 'Permanent' : 'Actif'}</span>
          </div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 40, marginTop: 16, letterSpacing: '-0.02em' }}>{d}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{t}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>Utilisé · {used}×</span>
            <span>Expire · {exp}</span>
          </div>
        </div>
      ))}
    </div>
  </>
);

const AdminGeozones = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Zones <span className="em">géographiques</span></h1><div className="dash-sub">5 zones définies · Couverture 18 km²</div></div>
      <button className="btn btn-primary"><Icon name="plus" size={14}/> Dessiner zone</button>
    </div>
    <div className="grid-2">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <SmartMap height={520} showFilters={false}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          ['Z01', 'Centre Ville', 'Service complet', 'electric', '4,2 km²'],
          ['Z02', 'Corniche', 'Service complet', 'electric', '2,8 km²'],
          ['Z03', 'Cité Portugaise', 'Zone lente · 15 km/h', 'cyan', '0,6 km²'],
          ['Z04', 'Faculté Campus', 'Stationnement uniquement', 'warn', '1,2 km²'],
          ['Z05', 'Port / Plage', 'Zone interdite', 'danger', '0,9 km²'],
        ].map((z, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{z[0]}</div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, marginTop: 4 }}>{z[1]}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{z[2]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={'pill ' + z[3]}><span className="dot"/>{z[2].split(' ')[0]}</span>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>{z[4]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const AdminReports = () => (
  <>
    <div className="dash-head">
      <div><h1 className="dash-title">Rapports<span className="em">.</span></h1><div className="dash-sub">Export comptable, opérationnel et conformité</div></div>
    </div>
    <div className="grid-3">
      {[
        ['Rapport mensuel', 'Mai 2026 — automatique', '14 mai'],
        ['Conformité fiscale', 'TVA Q1 2026', '07 mai'],
        ['Audit batteries', 'Diagnostic mai', '11 mai'],
        ['Satisfaction client', 'Sondage avril', '02 mai'],
        ['Incidents flotte', '14 cas signalés', '14 mai'],
        ['Croissance utilisateurs', 'Cohorte Q1', '01 mai'],
      ].map(([t, d, date], i) => (
        <div key={i} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Icon name="file" size={24}/>
          <div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, lineHeight: 1.1 }}>{t}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{d}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Généré {date}</span>
            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}><Icon name="download" size={12}/></button>
          </div>
        </div>
      ))}
    </div>
  </>
);

const AdminDashboard = () => {
  const [active, setActive] = useStateAd('analytics');
  return (
    <div className="dash" data-screen-label="Admin Control Tower">
      <Sidebar nav={ADMIN_NAV} active={active} onChange={setActive} kind="admin"/>
      <main className="dash-main">
        {active === 'analytics' && <AdminAnalytics/>}
        {active === 'live' && <AdminAnalytics/>}
        {active === 'fleet' && <AdminFleet/>}
        {active === 'stations' && <AdminStations/>}
        {active === 'users' && <AdminUsers/>}
        {active === 'verifications' && <AdminVerifications/>}
        {active === 'staff-requests' && <AdminStaffRequests/>}
        {active === 'pwd-tickets' && <AdminPwdTickets/>}
        {active === 'maintenance' && <AdminFleet/>}
        {active === 'earnings' && <AdminEarnings/>}
        {active === 'promos' && <AdminPromos/>}
        {active === 'geozones' && <AdminGeozones/>}
        {active === 'reports' && <AdminReports/>}
        {active === 'settings' && <AdminReports/>}
      </main>
    </div>
  );
};

export { AdminDashboard };

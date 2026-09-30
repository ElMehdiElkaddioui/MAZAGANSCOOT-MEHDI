// Main App shell — public site has its own header.
// Designer/reviewer can switch between surfaces via the bottom-right Prototype pill.
import { useState as useStateApp, useEffect as useEffectApp } from 'react';
import { Icon } from './ui.jsx';
import { Landing } from './landing.jsx';
import { ClientAuth, StaffPortal } from './auth.jsx';
import { UserDashboard } from './user.jsx';
import { AdminDashboard } from './admin.jsx';
import { MaintenanceDashboard } from './maintenance.jsx';

const ROLES = [
  { id: 'site', label: 'Site public', icn: 'home' },
  { id: 'auth', label: 'Connexion / Inscription', icn: 'user' },
  { id: 'user', label: 'Espace utilisateur (démo)', icn: 'scooter' },
];

// Internal surfaces stay reachable programmatically (footer link → staff gate → login).
// They are intentionally NOT exposed in the public prototype switcher.

const ProtoSwitch = ({ role, setRole, theme, setTheme, collapsed, setCollapsed }) => {
  if (collapsed) {
    const r = ROLES.find((x) => x.id === role);
    const label = r?.label || (
      role === 'staff' ? 'Portail interne (privé)' :
      role === 'admin' ? 'Admin (privé)' :
      role === 'maintenance' ? 'Maintenance (privé)' : role
    );
    return (
      <div className="proto-switch collapsed" onClick={() => setCollapsed(false)}>
        <span className="proto-label"><span className="pdot"/>Aperçu prototype</span>
        <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{label}</span>
        <span className="proto-collapse" onClick={(e) => { e.stopPropagation(); setCollapsed(false); }}><Icon name="arr" size={11}/></span>
      </div>
    );
  }
  const isInternal = role === 'staff' || role === 'admin' || role === 'maintenance';
  return (
    <div className="proto-switch">
      <div className="proto-head">
        <span className="proto-label"><span className="pdot"/>Aperçu prototype</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="theme-toggle" style={{ width: 26, height: 26 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={12}/>
          </button>
          <span className="proto-collapse" onClick={() => setCollapsed(true)}><Icon name="x" size={11}/></span>
        </div>
      </div>
      {ROLES.map((r) => (
        <button key={r.id} className={'role-btn ' + (role === r.id ? 'active' : '')} onClick={() => setRole(r.id)}>
          <span className="dot"/>
          <span className="role-icn"><Icon name={r.icn} size={13}/></span>
          <span>{r.label}</span>
        </button>
      ))}
      {isInternal && (
        <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.1em', padding: '4px 8px' }}>● ESPACE PRIVÉ ACTIF</div>
          <button className="role-btn" onClick={() => setRole('site')} style={{ color: 'var(--warn)' }}>
            <span className="dot" style={{ background: 'var(--warn)' }}/>
            <span className="role-icn"><Icon name="x" size={13}/></span>
            <span>Quitter l'espace interne</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [role, setRole] = useStateApp(() => localStorage.getItem('mz_role') || 'site');
  const [theme, setTheme] = useStateApp(() => localStorage.getItem('mz_theme') || 'dark');
  const [collapsed, setCollapsed] = useStateApp(() => localStorage.getItem('mz_proto_collapsed') === '1');

  useEffectApp(() => {
    localStorage.setItem('mz_role', role);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [role]);

  useEffectApp(() => {
    localStorage.setItem('mz_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffectApp(() => {
    localStorage.setItem('mz_proto_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  window.__setRole = setRole;

  return (
    <div className="app">
      <div key={role} style={{ animation: 'fadeIn 0.5s ease' }}>
        {role === 'site' && <Landing/>}
        {role === 'auth' && <ClientAuth/>}
        {role === 'staff' && <StaffPortal/>}
        {role === 'user' && <UserDashboard/>}
        {role === 'admin' && <AdminDashboard/>}
        {role === 'maintenance' && <MaintenanceDashboard/>}
      </div>
      <ProtoSwitch role={role} setRole={setRole} theme={theme} setTheme={setTheme} collapsed={collapsed} setCollapsed={setCollapsed}/>
    </div>
  );
}

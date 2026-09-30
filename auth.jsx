// Authentication: client login, register w/ KYC, forgot password (multi-step)
// + Internal staff portal: gate, login, account request, password reset request
import { useState as useStateA } from 'react';
import { Icon } from './ui.jsx';

// ============ Shared: visual side panel ============
const AuthVisual = ({ title, subtitle, stats, accent = 'electric' }) => (
  <div className="auth-visual">
    <div style={{ position: 'relative' }}>
      <div className="hero-eyebrow">
        <span className="live" style={{ background: `var(--${accent})`, boxShadow: `0 0 12px var(--${accent})` }}/>
        <span>● MAZAGANSCOOT · EL JADIDA</span>
      </div>
    </div>
    <div style={{ position: 'relative' }}>
      <h2>{title}</h2>
      <p style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: 'var(--ink-2)', maxWidth: 460, lineHeight: 1.4, marginTop: 30 }}>
        {subtitle}
      </p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, position: 'relative' }}>
      {stats.map(([n, l]) => (
        <div key={l} style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 44, lineHeight: 1, letterSpacing: '-0.02em' }}>{n}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ============ Client Login ============
const ClientLogin = ({ onGo }) => {
  const [showPwd, setShowPwd] = useStateA(false);
  const [email, setEmail] = useStateA('yassine@example.ma');
  const [pwd, setPwd] = useStateA('••••••••••');
  const [err, setErr] = useStateA('');

  return (
    <>
      <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 56, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>Bienvenue.</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 36px' }}>Connectez-vous à votre espace client MazaganScoot.</p>
      <div className="field">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="field">
        <label>Mot de passe</label>
        <div className="input-wrap">
          <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={(e) => setPwd(e.target.value)}/>
          <span className="input-icon" onClick={() => setShowPwd(!showPwd)}><Icon name="eye" size={16}/></span>
        </div>
      </div>
      {err && <div className="field-error"><Icon name="x" size={14}/>{err}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: '#c5ff3a' }}/> Se souvenir de moi
        </label>
        <a onClick={() => onGo('forgot')} style={{ fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer', textDecoration: 'underline' }}>Mot de passe oublié ?</a>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
        if (!email || !email.includes('@')) { setErr('Email invalide.'); return; }
        if (!pwd || pwd.length < 6) { setErr('Mot de passe requis (6 caractères min.).'); return; }
        window.__setRole('user');
      }}>
        Se connecter
        <span className="arrow"><Icon name="arr" size={11}/></span>
      </button>
      <div className="divider">Ou continuez avec</div>
      <div className="social-row">
        <div className="social-btn">G · Google</div>
        <div className="social-btn">  · Apple</div>
      </div>
      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--ink-3)' }}>
        Pas encore de compte ? <a onClick={() => onGo('register')} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline' }}>Créer un compte</a>
      </p>
    </>
  );
};

// ============ Client Register — multi-step with KYC ============
const ClientRegister = ({ onGo }) => {
  const [step, setStep] = useStateA(1);
  const [data, setData] = useStateA({
    firstName: 'Yassine', lastName: 'Bennani', email: 'yassine@example.ma',
    phone: '+212 6 12 34 56 78', dob: '1996-03-14', password: '', confirm: '',
    docType: 'cni', docFile: null, terms: false, age: false,
  });
  const [err, setErr] = useStateA('');
  const set = (k, v) => setData({ ...data, [k]: v });

  const computeAge = (iso) => {
    if (!iso) return 0;
    const dob = new Date(iso);
    if (isNaN(dob)) return 0;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const validateStep1 = () => {
    if (!data.firstName || !data.lastName) return 'Nom et prénom requis.';
    if (!data.email.includes('@')) return 'Email invalide.';
    if (!data.phone) return 'Numéro de téléphone requis.';
    const age = computeAge(data.dob);
    if (age < 18) return `Vous devez avoir au moins 18 ans pour utiliser MazaganScoot. (âge calculé : ${age || '—'} ans)`;
    if (!data.password || data.password.length < 8) return 'Mot de passe : 8 caractères minimum.';
    if (data.password !== data.confirm) return 'Les mots de passe ne correspondent pas.';
    return '';
  };

  const validateStep2 = () => {
    if (!data.docFile) return 'Veuillez joindre votre document d\'identité.';
    return '';
  };

  const validateStep3 = () => {
    if (!data.age) return 'Vous devez confirmer avoir plus de 18 ans.';
    if (!data.terms) return 'Vous devez accepter les conditions d\'utilisation.';
    return '';
  };

  const next = () => {
    setErr('');
    let e = '';
    if (step === 1) e = validateStep1();
    if (step === 2) e = validateStep2();
    if (step === 3) e = validateStep3();
    if (e) { setErr(e); return; }
    if (step < 4) setStep(step + 1); else window.__setRole('user');
  };

  const age = computeAge(data.dob);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 48, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>
          {step === 1 && 'Votre profil.'}
          {step === 2 && 'Votre identité.'}
          {step === 3 && 'Confirmation.'}
          {step === 4 && 'En cours de vérification.'}
        </h1>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{step} / 4</span>
      </div>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 28px' }}>
        {step === 1 && 'Informations de base — ces données restent confidentielles.'}
        {step === 2 && 'Conformément à la loi marocaine, nous vérifions l\'identité de chaque rider.'}
        {step === 3 && 'Dernière étape avant la création de votre compte.'}
        {step === 4 && 'Votre compte est créé. La vérification par notre équipe prend généralement moins de 24h.'}
      </p>

      <div className="wizard-steps">
        {[1,2,3,4].map((n) => (
          <div key={n} className={'wizard-step ' + (n < step ? 'done' : n === step ? 'active' : '')}/>
        ))}
      </div>
      <div className="wizard-step-labels">
        <span className={step >= 1 ? (step === 1 ? 'active' : 'done') : ''}>Profil</span>
        <span className={step >= 2 ? (step === 2 ? 'active' : 'done') : ''}>Identité</span>
        <span className={step >= 3 ? (step === 3 ? 'active' : 'done') : ''}>Confirmation</span>
        <span className={step >= 4 ? (step === 4 ? 'active' : 'done') : ''}>Vérification</span>
      </div>

      {step === 1 && (
        <div className="slide-in">
          <div className="grid-1fr1fr">
            <div className="field"><label>Prénom</label><input value={data.firstName} onChange={(e) => set('firstName', e.target.value)}/></div>
            <div className="field"><label>Nom</label><input value={data.lastName} onChange={(e) => set('lastName', e.target.value)}/></div>
          </div>
          <div className="field"><label>Email</label><input value={data.email} onChange={(e) => set('email', e.target.value)}/></div>
          <div className="grid-1fr1fr">
            <div className="field"><label>Téléphone</label><input value={data.phone} onChange={(e) => set('phone', e.target.value)}/></div>
            <div className="field">
              <label>Date de naissance</label>
              <input type="date" value={data.dob} onChange={(e) => set('dob', e.target.value)}/>
              {age > 0 && <div className="field-hint" style={{ color: age >= 18 ? 'var(--success)' : 'var(--danger)' }}>● {age} ans · {age >= 18 ? 'Éligible' : 'Trop jeune'}</div>}
            </div>
          </div>
          <div className="grid-1fr1fr">
            <div className="field"><label>Mot de passe</label><input type="password" value={data.password} onChange={(e) => set('password', e.target.value)} placeholder="8 caractères min."/></div>
            <div className="field"><label>Confirmer le mot de passe</label><input type="password" value={data.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Répéter"/></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="slide-in">
          <div className="field">
            <label>Type de document</label>
            <div className="radio-row">
              <div className={'radio-card ' + (data.docType === 'cni' ? 'selected' : '')} onClick={() => set('docType', 'cni')}>
                <div className="ri">
                  <div className="rd">CNI</div>
                  <div className="radio-dot"/>
                </div>
                <div className="rt">Carte d'identité</div>
                <div className="rd">Marocaine — recto/verso</div>
              </div>
              <div className={'radio-card ' + (data.docType === 'passport' ? 'selected' : '')} onClick={() => set('docType', 'passport')}>
                <div className="ri">
                  <div className="rd">PSP</div>
                  <div className="radio-dot"/>
                </div>
                <div className="rt">Passeport</div>
                <div className="rd">Page identité</div>
              </div>
            </div>
          </div>
          <div className="field" style={{ marginTop: 20 }}>
            <label>Document d'identité</label>
            <div className={'upload-zone ' + (data.docFile ? 'has-file' : '')} onClick={() => set('docFile', data.docFile ? null : { name: data.docType === 'cni' ? 'cni_yassine_recto.jpg' : 'passeport_yassine.pdf', size: '2.4 Mo' })}>
              {!data.docFile && <>
                <div className="upload-icon"><Icon name="file" size={20}/></div>
                <h5>Déposez ou scannez votre document</h5>
                <p>JPG, PNG ou PDF · 10 Mo max · Recto/verso si CNI</p>
              </>}
              {data.docFile && (
                <div className="upload-file-row">
                  <div className="upload-file-thumb"><Icon name="check" size={20}/></div>
                  <div className="upload-file-info">
                    <div className="name">{data.docFile.name}</div>
                    <div className="size">{data.docFile.size} · Document chiffré · prêt à l'envoi</div>
                  </div>
                  <span className="pill ok"><span className="dot"/>Joint</span>
                </div>
              )}
            </div>
            <div className="field-hint">● Vos documents sont chiffrés et ne sont visibles que par l'équipe vérification autorisée.</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="slide-in">
          <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.12em' }}>● RÉCAPITULATIF</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>NOM</div><div style={{ fontSize: 14, marginTop: 2 }}>{data.firstName} {data.lastName}</div></div>
              <div><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>EMAIL</div><div style={{ fontSize: 14, marginTop: 2 }}>{data.email}</div></div>
              <div><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>TÉLÉPHONE</div><div style={{ fontSize: 14, marginTop: 2 }}>{data.phone}</div></div>
              <div><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>ÂGE</div><div style={{ fontSize: 14, marginTop: 2 }}>{age} ans</div></div>
              <div style={{ gridColumn: '1 / -1' }}><div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>DOCUMENT</div><div style={{ fontSize: 14, marginTop: 2 }}>{data.docType === 'cni' ? 'Carte Nationale d\'Identité' : 'Passeport'} · {data.docFile?.name}</div></div>
            </div>
          </div>
          <div className={'check-line ' + (data.age ? 'checked' : '')} onClick={() => set('age', !data.age)}>
            <span className="check-box"><Icon name="check" size={14}/></span>
            <span className="check-txt">Je confirme que mes informations sont exactes et que j'ai plus de <strong>18 ans</strong>.</span>
          </div>
          <div className={'check-line ' + (data.terms ? 'checked' : '')} onClick={() => set('terms', !data.terms)}>
            <span className="check-box"><Icon name="check" size={14}/></span>
            <span className="check-txt">J'accepte les <a style={{ textDecoration: 'underline' }}>conditions d'utilisation</a> et la <a style={{ textDecoration: 'underline' }}>politique de confidentialité</a> de MazaganScoot.</span>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="slide-in" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--electric-soft)', color: 'var(--electric)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
            <Icon name="check" size={36}/>
          </div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.01em' }}>Votre compte est créé !</div>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 380, margin: '14px auto 24px', lineHeight: 1.5 }}>
            Statut actuel : <span className="verif-badge pending"><span className="b-ic"><Icon name="clock" size={8}/></span>En attente de vérification</span>
            <br/><br/>
            Vous pouvez accéder à votre espace, mais ne pourrez pas démarrer de trajet avant que notre équipe ne valide votre document d'identité <strong>(généralement sous 24h)</strong>.
          </p>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => window.__setRole('user')}>
            Accéder à mon espace<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      )}

      {err && <div className="field-error"><Icon name="x" size={14}/>{err}</div>}

      {step < 4 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {step > 1 && <button className="btn btn-ghost" onClick={() => { setErr(''); setStep(step - 1); }}>← Retour</button>}
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={next}>
            {step === 3 ? 'Créer mon compte' : 'Continuer'}<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      )}

      {step < 4 && (
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
          Déjà inscrit ? <a onClick={() => onGo('login')} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline' }}>Se connecter</a>
        </p>
      )}
    </>
  );
};

// ============ Client Forgot Password (4 steps) ============
const ClientForgot = ({ onGo }) => {
  const [step, setStep] = useStateA(1);
  const [email, setEmail] = useStateA('yassine@example.ma');
  const [otp, setOtp] = useStateA(['', '', '', '', '', '']);
  const [pwd, setPwd] = useStateA('');
  const [confirm, setConfirm] = useStateA('');
  const [err, setErr] = useStateA('');

  const next = () => {
    setErr('');
    if (step === 1 && !email.includes('@')) { setErr('Email invalide.'); return; }
    if (step === 2 && otp.join('').length < 6) { setErr('Code incomplet — 6 chiffres requis.'); return; }
    if (step === 3) {
      if (!pwd || pwd.length < 8) { setErr('Mot de passe : 8 caractères minimum.'); return; }
      if (pwd !== confirm) { setErr('Les mots de passe ne correspondent pas.'); return; }
    }
    setStep(step + 1);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 48, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>
          {step === 1 && 'Mot de passe oublié.'}
          {step === 2 && 'Vérification.'}
          {step === 3 && 'Nouveau mot de passe.'}
          {step === 4 && 'Réinitialisé.'}
        </h1>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{step} / 4</span>
      </div>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 28px' }}>
        {step === 1 && 'Nous vous enverrons un code de vérification à 6 chiffres par email.'}
        {step === 2 && `Entrez le code à 6 chiffres envoyé à ${email}.`}
        {step === 3 && 'Choisissez un mot de passe sécurisé (8 caractères minimum).'}
        {step === 4 && 'Tout est en ordre. Vous pouvez maintenant vous connecter.'}
      </p>

      <div className="wizard-steps">
        {[1,2,3,4].map((n) => <div key={n} className={'wizard-step ' + (n < step ? 'done' : n === step ? 'active' : '')}/>)}
      </div>
      <div className="wizard-step-labels">
        <span className={step >= 1 ? (step === 1 ? 'active' : 'done') : ''}>Email</span>
        <span className={step >= 2 ? (step === 2 ? 'active' : 'done') : ''}>Code</span>
        <span className={step >= 3 ? (step === 3 ? 'active' : 'done') : ''}>Nouveau MDP</span>
        <span className={step >= 4 ? (step === 4 ? 'active' : 'done') : ''}>Succès</span>
      </div>

      {step === 1 && (
        <div className="slide-in">
          <div className="field"><label>Email du compte</label><input value={email} onChange={(e) => setEmail(e.target.value)}/></div>
        </div>
      )}
      {step === 2 && (
        <div className="slide-in">
          <div className="otp-grid">
            {otp.map((d, i) => (
              <input
                key={i}
                className={'otp-box ' + (d ? 'filled' : (otp.slice(0, i).every(x => x) && !d ? 'active' : ''))}
                style={{ textAlign: 'center', padding: 0 }}
                value={d}
                maxLength={1}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  const next = [...otp]; next[i] = v; setOtp(next);
                  if (v && i < 5) e.target.parentNode.children[i + 1]?.focus();
                }}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>Code non reçu ? <a style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline' }}>Renvoyer dans 0:24</a></p>
        </div>
      )}
      {step === 3 && (
        <div className="slide-in">
          <div className="field"><label>Nouveau mot de passe</label><input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="8 caractères min."/></div>
          <div className="field"><label>Confirmer</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Répéter"/></div>
          <div className="field-hint">● Au moins 8 caractères · une majuscule · un chiffre</div>
        </div>
      )}
      {step === 4 && (
        <div className="slide-in" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--electric-soft)', color: 'var(--electric)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
            <Icon name="check" size={36}/>
          </div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.01em' }}>Votre mot de passe a été réinitialisé avec succès.</div>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 360, margin: '14px auto 24px' }}>Vous pouvez maintenant utiliser votre nouveau mot de passe pour vous connecter.</p>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => onGo('login')}>
            Se connecter<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      )}

      {err && <div className="field-error"><Icon name="x" size={14}/>{err}</div>}

      {step < 4 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={() => step === 1 ? onGo('login') : setStep(step - 1)}>← Retour</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={next}>
            {step === 1 && 'Envoyer le code'}
            {step === 2 && 'Vérifier'}
            {step === 3 && 'Réinitialiser'}
            <span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      )}
    </>
  );
};

// ============ Client Auth wrapper ============
const ClientAuth = () => {
  const [view, setView] = useStateA('login'); // login | register | forgot

  return (
    <main className="auth" data-screen-label="Client Auth">
      <AuthVisual
        title={<><span>La médina,</span><br/><span className="em">à portée</span><br/><span>de roue.</span></>}
        subtitle={view === 'register' ? "Rejoignez 4 500 riders qui explorent El Jadida chaque mois en mobilité électrique." : view === 'forgot' ? "Récupérez l'accès à votre wallet et vos trajets en quelques étapes." : "Connectez-vous pour réserver, déverrouiller et payer vos trajets."}
        stats={[['120', 'Trottinettes'], ['18', 'Stations'], ['97%', 'Satisfaction']]}
      />
      <div className="auth-form-wrap">
        <div className="auth-form" style={{ maxWidth: 480 }}>
          {view === 'login' && <ClientLogin onGo={setView}/>}
          {view === 'register' && <ClientRegister onGo={setView}/>}
          {view === 'forgot' && <ClientForgot onGo={setView}/>}
        </div>
      </div>
    </main>
  );
};

// ============ Internal portal: gate ============
const InternalGate = ({ onGo }) => (
  <div className="portal-gate" data-screen-label="Internal Portal Gate">
    <div className="portal-gate-bg"/>
    <div className="portal-card">
      <div className="badge-internal"><span className="pip"/>● Portail interne MazaganScoot</div>
      <div className="lock-icon"><Icon name="settings" size={26}/></div>
      <h1>Espace équipe<span className="em">.</span></h1>
      <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
        Cet espace est réservé à l'équipe MazaganScoot. L'accès est autorisé uniquement aux comptes <strong style={{ color: 'var(--ink)' }}>approuvés par l'administrateur</strong>.
      </p>
      <div className="warn-banner">
        <p>● Toutes les connexions sont auditées. Une tentative d'accès non autorisé entraîne la suspension immédiate du compte et une notification au responsable sécurité.</p>
      </div>
      <div className="portal-roles">
        <div className="portal-role-tile">
          <div className="ic"><Icon name="chart" size={18}/></div>
          <h5>Administrateur</h5>
          <p>Pilotage global, finances, équipe, conformité.</p>
        </div>
        <div className="portal-role-tile">
          <div className="ic"><Icon name="wrench" size={18}/></div>
          <h5>Maintenance</h5>
          <p>Interventions terrain, batteries, réparations.</p>
        </div>
        <div className="portal-role-tile">
          <div className="ic"><Icon name="pin" size={18}/></div>
          <h5>Resp. station</h5>
          <p>Capacité, occupation, événements station.</p>
        </div>
      </div>
      <div className="portal-actions">
        <button className="btn btn-primary" onClick={() => onGo('login')}>
          Se connecter <span className="arrow"><Icon name="arr" size={11}/></span>
        </button>
        <button className="btn btn-ghost" onClick={() => onGo('request')}>
          Demander un accès
        </button>
        <button className="btn btn-ghost" onClick={() => onGo('forgot')}>
          Mot de passe oublié
        </button>
      </div>
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
        <span>● Audit log activé</span>
        <span>Compliance · 2FA requis</span>
        <span>MazaganScoot SARL · 2026</span>
      </div>
    </div>
  </div>
);

// ============ Internal staff Login ============
const StaffLogin = ({ onGo }) => {
  const [data, setData] = useStateA({ email: 'k.hassani@mazaganscoot.ma', pwd: '••••••••', mat: 'MZ-T-0042', role: 'maintenance' });
  const set = (k, v) => setData({ ...data, [k]: v });

  const go = () => {
    if (data.role === 'admin') window.__setRole('admin');
    else if (data.role === 'maintenance') window.__setRole('maintenance');
    else if (data.role === 'station') window.__setRole('admin'); // station manager → admin stations view
  };

  return (
    <main className="auth" data-screen-label="Staff Login">
      <AuthVisual
        title={<><span>Espace</span><br/><span className="em">équipe</span><br/><span>MazaganScoot.</span></>}
        subtitle="Accès sécurisé pour l'équipe approuvée : admin, maintenance, responsables de station."
        stats={[['8', 'Techniciens'], ['4', 'Admins'], ['24/7', 'Audit log']]}
        accent="warn"
      />
      <div className="auth-form-wrap">
        <div className="auth-form" style={{ maxWidth: 480 }}>
          <div className="badge-internal" style={{ marginBottom: 24 }}><span className="pip"/>● Connexion interne</div>
          <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 56, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>Connexion équipe<span className="em" style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>.</span></h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 36px' }}>Tous les accès sont enregistrés et audités.</p>

          <div className="field"><label>Email professionnel</label><input value={data.email} onChange={(e) => set('email', e.target.value)}/></div>
          <div className="grid-1fr1fr">
            <div className="field"><label>Mot de passe</label><input type="password" value={data.pwd} onChange={(e) => set('pwd', e.target.value)}/></div>
            <div className="field"><label>Matricule</label><input value={data.mat} onChange={(e) => set('mat', e.target.value)}/></div>
          </div>
          <div className="field">
            <label>Rôle</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['admin', 'Administrateur', 'chart'],
                ['maintenance', 'Maintenance', 'wrench'],
                ['station', 'Resp. station', 'pin'],
              ].map(([id, l, icn]) => (
                <div key={id} className={'radio-card ' + (data.role === id ? 'selected' : '')} onClick={() => set('role', id)} style={{ padding: 12 }}>
                  <div className="ri">
                    <Icon name={icn} size={14}/>
                    <div className="radio-dot"/>
                  </div>
                  <div className="rt" style={{ fontSize: 16 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={go}>
            Connexion sécurisée<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 28, color: 'var(--ink-3)' }}>
            <a onClick={() => onGo('request')} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--ink-2)' }}>Demande d'accès équipe</a>
            <a onClick={() => onGo('forgot')} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--ink-2)' }}>Mot de passe oublié</a>
          </div>
        </div>
      </div>
    </main>
  );
};

// ============ Staff access request ============
const StaffRequest = ({ onGo }) => {
  const [data, setData] = useStateA({
    name: 'Karim Hassani', email: 'k.hassani@mazaganscoot.ma', phone: '+212 6 22 11 88 44',
    mat: 'MZ-T-0042', dob: '1990-08-22', role: 'maintenance', motif: 'Recrutement validé par RH (M. El Mansouri) — démarrage atelier maintenance El Jadida.',
    idDoc: { name: 'cni_karim.jpg', size: '1.8 Mo' }, workDoc: { name: 'lettre_engagement.pdf', size: '320 Ko' },
  });
  const set = (k, v) => setData({ ...data, [k]: v });
  const [sent, setSent] = useStateA(false);

  if (sent) return (
    <main className="auth" data-screen-label="Staff Request Sent">
      <AuthVisual title={<>Demande<br/><span className="em">envoyée.</span></>} subtitle="Notre administrateur traitera votre demande sous 48h." stats={[['48h', 'Délai moyen'], ['100%', 'Audit'], ['24/7', 'Support']]} accent="warn"/>
      <div className="auth-form-wrap"><div className="auth-form" style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--electric-soft)', color: 'var(--electric)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
          <Icon name="mail" size={36}/>
        </div>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 44, margin: '0 0 14px', letterSpacing: '-0.02em', fontWeight: 400 }}>Votre demande d'accès a été envoyée.</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
          L'administrateur examinera votre dossier et vous recevrez une réponse <strong>par email</strong> après validation. Vous ne pourrez pas vous connecter avant approbation explicite.
        </p>
        <div style={{ margin: '24px auto', maxWidth: 360, padding: 16, background: 'var(--surface-2)', borderRadius: 14, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
          Ticket #REQ-2026-{Math.floor(Math.random() * 9000 + 1000)} · Statut : EN ATTENTE
        </div>
        <button className="btn btn-ghost" onClick={() => onGo('gate')}>← Retour au portail</button>
      </div></div>
    </main>
  );

  return (
    <main className="auth" data-screen-label="Staff Request">
      <AuthVisual title={<>Demande<br/>d'accès<br/><span className="em">équipe.</span></>} subtitle="Soumettez une demande pour rejoindre l'équipe technique, station ou support de MazaganScoot." stats={[['8', 'Techniciens'], ['4', 'Admins'], ['12', 'Stations']]} accent="warn"/>
      <div className="auth-form-wrap"><div className="auth-form" style={{ maxWidth: 560 }}>
        <div className="badge-internal" style={{ marginBottom: 24 }}><span className="pip"/>● Demande d'accès</div>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 48, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>Rejoignez l'équipe.</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 28px' }}>Tous les champs sont obligatoires. La vérification prend moins de 48h ouvrées.</p>

        <div className="grid-1fr1fr">
          <div className="field"><label>Nom complet</label><input value={data.name} onChange={(e) => set('name', e.target.value)}/></div>
          <div className="field"><label>Email professionnel</label><input value={data.email} onChange={(e) => set('email', e.target.value)}/></div>
        </div>
        <div className="grid-1fr1fr">
          <div className="field"><label>Téléphone</label><input value={data.phone} onChange={(e) => set('phone', e.target.value)}/></div>
          <div className="field"><label>Matricule</label><input value={data.mat} onChange={(e) => set('mat', e.target.value)}/></div>
        </div>
        <div className="field"><label>Date de naissance</label><input type="date" value={data.dob} onChange={(e) => set('dob', e.target.value)}/></div>
        <div className="field">
          <label>Rôle demandé</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              ['maintenance', 'Maintenance', 'wrench'],
              ['station', 'Resp. station', 'pin'],
              ['support', 'Support client', 'help'],
            ].map(([id, l, icn]) => (
              <div key={id} className={'radio-card ' + (data.role === id ? 'selected' : '')} onClick={() => set('role', id)} style={{ padding: 12 }}>
                <div className="ri"><Icon name={icn} size={14}/><div className="radio-dot"/></div>
                <div className="rt" style={{ fontSize: 16 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Motif de la demande</label>
          <textarea rows="3" value={data.motif} onChange={(e) => set('motif', e.target.value)}/>
        </div>
        <div className="grid-1fr1fr">
          <div className="field">
            <label>Document d'identité</label>
            <div className={'upload-zone ' + (data.idDoc ? 'has-file' : '')} onClick={() => set('idDoc', data.idDoc ? null : { name: 'cni.jpg', size: '1.8 Mo' })} style={{ padding: data.idDoc ? 14 : 24 }}>
              {!data.idDoc && <><div className="upload-icon" style={{ width: 36, height: 36, margin: '0 auto 8px' }}><Icon name="file" size={16}/></div><p>Joindre CNI/passeport</p></>}
              {data.idDoc && <div className="upload-file-row"><div className="upload-file-thumb" style={{ width: 36, height: 36 }}><Icon name="check" size={14}/></div><div className="upload-file-info"><div className="name" style={{ fontSize: 12 }}>{data.idDoc.name}</div><div className="size">{data.idDoc.size}</div></div></div>}
            </div>
          </div>
          <div className="field">
            <label>Document professionnel (optionnel)</label>
            <div className={'upload-zone ' + (data.workDoc ? 'has-file' : '')} onClick={() => set('workDoc', data.workDoc ? null : { name: 'autorisation.pdf', size: '320 Ko' })} style={{ padding: data.workDoc ? 14 : 24 }}>
              {!data.workDoc && <><div className="upload-icon" style={{ width: 36, height: 36, margin: '0 auto 8px' }}><Icon name="file" size={16}/></div><p>Lettre, contrat…</p></>}
              {data.workDoc && <div className="upload-file-row"><div className="upload-file-thumb" style={{ width: 36, height: 36 }}><Icon name="check" size={14}/></div><div className="upload-file-info"><div className="name" style={{ fontSize: 12 }}>{data.workDoc.name}</div><div className="size">{data.workDoc.size}</div></div></div>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-ghost" onClick={() => onGo('gate')}>← Annuler</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSent(true)}>
            Envoyer la demande<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      </div></div>
    </main>
  );
};

// ============ Staff forgot password ============
const StaffForgot = ({ onGo }) => {
  const [data, setData] = useStateA({ email: '', mat: '', role: 'maintenance', motif: '' });
  const [sent, setSent] = useStateA(false);
  const set = (k, v) => setData({ ...data, [k]: v });

  if (sent) return (
    <main className="auth" data-screen-label="Staff Forgot Sent">
      <AuthVisual title={<>Demande<br/><span className="em">enregistrée.</span></>} subtitle="L'administrateur traitera votre demande et vous enverra un mot de passe temporaire par email." stats={[['24h', 'Délai moyen'], ['100%', 'Audit'], ['1', 'Lien sécurisé']]} accent="warn"/>
      <div className="auth-form-wrap"><div className="auth-form" style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--electric-soft)', color: 'var(--electric)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
          <Icon name="check" size={36}/>
        </div>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 44, margin: '0 0 14px', letterSpacing: '-0.02em', fontWeight: 400 }}>Votre demande de réinitialisation a été envoyée à l'administrateur.</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
          Pour des raisons de sécurité, les mots de passe internes ne sont jamais réinitialisés automatiquement. Vous recevrez un mot de passe temporaire à <strong>{data.email || 'votre email professionnel'}</strong> après validation.
        </p>
        <div style={{ margin: '24px auto', maxWidth: 360, padding: 16, background: 'var(--surface-2)', borderRadius: 14, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-3)' }}>
          Ticket #PWD-2026-{Math.floor(Math.random() * 9000 + 1000)} · Statut : EN ATTENTE
        </div>
        <button className="btn btn-ghost" onClick={() => onGo('gate')}>← Retour au portail</button>
      </div></div>
    </main>
  );

  return (
    <main className="auth" data-screen-label="Staff Forgot">
      <AuthVisual title={<>Mot de passe<br/><span className="em">équipe.</span></>} subtitle="Pour des raisons de sécurité, la réinitialisation des comptes internes passe par l'administrateur." stats={[['24h', 'Délai'], ['100%', 'Audit'], ['MFA', 'Requis']]} accent="warn"/>
      <div className="auth-form-wrap"><div className="auth-form" style={{ maxWidth: 480 }}>
        <div className="badge-internal" style={{ marginBottom: 24 }}><span className="pip"/>● Réinitialisation interne</div>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 44, margin: '0 0 8px', letterSpacing: '-0.02em', fontWeight: 400 }}>Demande de réinitialisation<span style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>.</span></h1>
        <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 28px' }}>Votre demande sera examinée par l'administrateur. Un mot de passe temporaire vous sera envoyé par email après validation.</p>

        <div className="field"><label>Email professionnel</label><input value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="prenom.nom@mazaganscoot.ma"/></div>
        <div className="grid-1fr1fr">
          <div className="field"><label>Matricule</label><input value={data.mat} onChange={(e) => set('mat', e.target.value)} placeholder="MZ-T-XXXX"/></div>
          <div className="field">
            <label>Rôle</label>
            <select value={data.role} onChange={(e) => set('role', e.target.value)}>
              <option value="admin">Administrateur</option>
              <option value="maintenance">Maintenance</option>
              <option value="station">Resp. station</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>
        <div className="field"><label>Motif de la demande</label><textarea rows="3" value={data.motif} onChange={(e) => set('motif', e.target.value)} placeholder="Ex : MDP oublié après congés, changement de poste…"/></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-ghost" onClick={() => onGo('gate')}>← Retour</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSent(true)}>
            Envoyer la demande<span className="arrow"><Icon name="arr" size={11}/></span>
          </button>
        </div>
      </div></div>
    </main>
  );
};

// ============ Internal staff wrapper ============
const StaffPortal = () => {
  const [view, setView] = useStateA('gate'); // gate | login | request | forgot
  return (
    <div data-screen-label="Internal Staff">
      {view === 'gate' && <InternalGate onGo={setView}/>}
      {view === 'login' && <StaffLogin onGo={setView}/>}
      {view === 'request' && <StaffRequest onGo={setView}/>}
      {view === 'forgot' && <StaffForgot onGo={setView}/>}
    </div>
  );
};

export { ClientAuth, StaffPortal };

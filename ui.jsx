// Shared UI components & icons
import { useState, useEffect, useRef } from 'react';

// Icon component — tiny line icons
const Icon = ({ name, size = 16 }) => {
  const paths = {
    map: <><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/></>,
    scooter: <><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="2"/><path d="M8 18h7l-3-12h-3"/><path d="M15 6l1-3h2"/></>,
    wallet: <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="15" r="1"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    pause: <><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></>,
    play: <path d="M6 4l14 8-14 8z"/>,
    stop: <rect x="5" y="5" width="14" height="14" rx="2"/>,
    qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></>,
    battery: <><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/></>,
    bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/></>,
    wrench: <path d="M14 7a4 4 0 1 0 5 5l-9 9-3-3 9-9a4 4 0 0 0-2-2z"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowUp: <><path d="M5 19V5M12 12L5 5l-7 7" transform="rotate(45 12 12)"/></>,
    star: <path d="M12 2l3 7 7 .8-5 5 1.5 7L12 18l-6.5 3.8L7 14.8l-5-5L9 9z"/>,
    pin: <><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></>,
    home: <><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>,
    arr: <path d="M7 17L17 7M9 7h8v8"/>,
    arrLeft: <path d="M17 7L7 17M7 9v8h8" transform="rotate(180 12 12)"/>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 1 1 0-5C12 3 12 8 12 8s0-5 4.5-5a2.5 2.5 0 1 1 0 5"/></>,
    coin: <><circle cx="12" cy="12" r="9"/><path d="M9 9c1-1.5 5-1.5 6 0s-6 1-6 3 5 1.5 6 0M12 6v2M12 16v2"/></>,
    flag: <><path d="M4 22V4a3 3 0 0 1 5-2c1 .8 2 .8 3 0a3 3 0 0 1 5 2v9a3 3 0 0 1-5 2c-1-.8-2-.8-3 0a3 3 0 0 0-5 0"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    helmet: <path d="M3 14c0-6 4-10 9-10s9 4 9 10v3H3v-3zM3 17h18v2H3zM7 14V8"/>,
    plug: <><path d="M9 2v4M15 2v4M7 6h10v6a5 5 0 0 1-10 0V6zM12 16v6"/></>,
    layers: <><path d="M12 2l10 6-10 6L2 8z"/><path d="M2 14l10 6 10-6M2 17l10 6 10-6"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.5 9a3 3 0 0 1 5 2c0 2-3 2-3 4M12 17v.5"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></>,
    phone: <path d="M5 4a2 2 0 0 1 2-2h2l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v2a2 2 0 0 1-2 2A16 16 0 0 1 5 4z"/>,
    check: <path d="M5 12l5 5 9-11"/>,
    x: <path d="M6 6l12 12M6 18L18 6"/>,
    fr: <><rect x="2" y="6" width="20" height="12" fill="white" stroke="currentColor"/><rect x="2" y="6" width="6.67" height="12" fill="#0055A4"/><rect x="15.33" y="6" width="6.67" height="12" fill="#EF4135"/></>,
    flame: <path d="M12 2c2 4-2 6-2 10a4 4 0 0 0 8 0c0-2-1-3-1-3 0 3-2 4-2 4 1-3-3-7-3-11z"/>,
    truck: <><rect x="1" y="6" width="13" height="11" rx="1"/><path d="M14 9h4l3 3v5h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    discount: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="8" cy="8" r="1.5"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2 2 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-7l3 3M21 12a9 9 0 0 1-15 7l-3-3"/><path d="M21 3v6h-6M3 21v-6h6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

// Animated counter
const Counter = ({ to, suffix = "", duration = 1500, format = (n) => n.toLocaleString('fr-FR') }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf, started = null;
    const tick = (t) => {
      if (!started) started = t;
      const p = Math.min(1, (t - started) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        raf = requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    if (ref.current) io.observe(ref.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to, duration]);
  return <span ref={ref}>{format(n)}{suffix}</span>;
};

// Scooter illustration (SVG, original)
const ScooterSVG = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* deck */}
    <rect x="50" y="120" width="100" height="8" rx="2" fill="#1d2128" stroke="#2a2f38" strokeWidth="1"/>
    {/* stem */}
    <path d="M150 124 L160 60" stroke="#2a2f38" strokeWidth="3" strokeLinecap="round"/>
    {/* handlebar */}
    <path d="M140 60 L180 60" stroke="#c5ff3a" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="140" cy="60" r="3" fill="#c5ff3a"/>
    <circle cx="180" cy="60" r="3" fill="#c5ff3a"/>
    {/* display */}
    <rect x="153" y="68" width="14" height="10" rx="2" fill="#0e1116" stroke="#c5ff3a" strokeWidth="0.8"/>
    {/* front wheel */}
    <circle cx="160" cy="148" r="22" fill="#0e1116" stroke="#2a2f38" strokeWidth="2"/>
    <circle cx="160" cy="148" r="6" fill="#2a2f38"/>
    <path d="M160 130 L160 166 M142 148 L178 148" stroke="#1d2128" strokeWidth="1"/>
    {/* rear wheel */}
    <circle cx="50" cy="148" r="22" fill="#0e1116" stroke="#2a2f38" strokeWidth="2"/>
    <circle cx="50" cy="148" r="6" fill="#2a2f38"/>
    <path d="M50 130 L50 166 M32 148 L68 148" stroke="#1d2128" strokeWidth="1"/>
    {/* fender */}
    <path d="M138 148 a22 22 0 0 1 44 0" stroke="#2a2f38" strokeWidth="1.5" fill="none"/>
    {/* battery strip */}
    <rect x="58" y="122" width="60" height="2" fill="#c5ff3a" opacity="0.8"/>
    {/* glow */}
    <circle cx="160" cy="148" r="30" fill="#c5ff3a" opacity="0.05"/>
  </svg>
);

export { Icon, Counter, ScooterSVG };

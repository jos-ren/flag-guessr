
const COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'jp', name: 'Japan' },
  { code: 'cn', name: 'China' },
  { code: 'br', name: 'Brazil' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  { code: 'in', name: 'India' },
  { code: 'mx', name: 'Mexico' },
  { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' },
  { code: 'ru', name: 'Russia' },
  { code: 'za', name: 'South Africa' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'eg', name: 'Egypt' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
  { code: 'kr', name: 'South Korea' },
  { code: 'th', name: 'Thailand' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'id', name: 'Indonesia' },
  { code: 'my', name: 'Malaysia' },
  { code: 'ph', name: 'Philippines' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'tr', name: 'Turkey' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'fi', name: 'Finland' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'gr', name: 'Greece' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'ke', name: 'Kenya' },
  { code: 'gh', name: 'Ghana' },
  { code: 'ma', name: 'Morocco' },
  { code: 'pe', name: 'Peru' },
  { code: 'at', name: 'Austria' },
  { code: 'cz', name: 'Czech Republic' },
  { code: 'hu', name: 'Hungary' },
  { code: 've', name: 'Venezuela' },
  { code: 'ua', name: 'Ukraine' },
];

const HS_KEY = 'fg_highscore';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOptions(correct, all) {
  const others = shuffle(all.filter(c => c.code !== correct.code)).slice(0, 3);
  return shuffle([correct, ...others]);
}

function getResultMessage(streak) {
  if (streak === 0) return { text: 'Ouch.', sub: 'First one got you.' };
  if (streak >= 20) return { text: 'Legendary.', sub: 'You are the map.' };
  if (streak >= 12) return { text: 'Outstanding.', sub: 'A well-stamped passport.' };
  if (streak >= 7)  return { text: 'Impressive.', sub: 'Strong cartographic instincts.' };
  if (streak >= 4)  return { text: 'Decent run.', sub: 'A well-travelled mind.' };
  return { text: 'Keep going.', sub: 'The world takes practice.' };
}

const FONT_OPTIONS = [
  { id: 'raleway',  label: 'Raleway',               heading: "'Raleway', sans-serif",              mono: "'Space Mono', monospace",    vibe: 'Art Deco Map' },
  { id: 'barlow',   label: 'Barlow Semi Condensed',  heading: "'Barlow Semi Condensed', sans-serif", mono: "'Space Mono', monospace",    vibe: 'Survey Label' },
  { id: 'nunito',   label: 'Nunito',                 heading: "'Nunito', sans-serif",               mono: "'DM Mono', monospace",       vibe: 'Friendly Guide' },
  { id: 'dmsans',   label: 'DM Sans',                heading: "'DM Sans', sans-serif",              mono: "'DM Mono', monospace",       vibe: 'Clean & Simple' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"darkMode": false, "fontId": "nunito"}/*EDITMODE-END*/;

function FlagGuesser() {
  const [darkMode, setDarkMode] = React.useState(TWEAK_DEFAULTS.darkMode);
  const [fontId, setFontId] = React.useState(TWEAK_DEFAULTS.fontId || 'nunito');
  const [tweaksVisible, setTweaksVisible] = React.useState(false);
  const activeFont = FONT_OPTIONS.find(f => f.id === fontId) || FONT_OPTIONS[2];

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data && e.data.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data && e.data.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const toggleDark = (val) => {
    setDarkMode(val);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { darkMode: val, fontId } }, '*');
  };
  const changeFont = (id) => {
    setFontId(id);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { darkMode, fontId: id } }, '*');
  };

  // Game state
  const [current, setCurrent] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [streak, setStreak] = React.useState(0);
  const [finalStreak, setFinalStreak] = React.useState(0);
  const [stumpedBy, setStumpedBy] = React.useState(null);
  const [highScore, setHighScore] = React.useState(() => parseInt(localStorage.getItem(HS_KEY) || '0', 10));
  const [phase, setPhase] = React.useState('gameover'); // 'active' | 'answered' | 'leaving' | 'gameover'
  const [animKey, setAnimKey] = React.useState(0);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [isNewHigh, setIsNewHigh] = React.useState(false);
  const deckRef = React.useRef([]);
  const timerRef = React.useRef(null);

  function nextCountry(excludeCode) {
    if (deckRef.current.length === 0) {
      deckRef.current = shuffle(COUNTRIES).filter(c => c.code !== excludeCode);
    }
    return deckRef.current.shift();
  }

  function dealNext(excludeCode) {
    const country = nextCountry(excludeCode);
    setCurrent(country);
    setOptions(getOptions(country, COUNTRIES));
    setSelected(null);
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }

  const startGame = React.useCallback(() => {
    deckRef.current = shuffle([...COUNTRIES]);
    setStreak(0);
    setFinalStreak(0);
    setStumpedBy(null);
    setIsNewHigh(false);
    setSelected(null);
    setPhase('active');
    const country = deckRef.current.shift();
    setCurrent(country);
    setOptions(getOptions(country, COUNTRIES));
    setImgLoaded(false);
    setAnimKey(k => k + 1);
  }, []);

  React.useEffect(() => { /* start on mount handled by gameover screen */ }, []);

  const handleSelect = React.useCallback((country) => {
    if (selected || phase !== 'active') return;
    setSelected(country);
    setPhase('answered');
    const isCorrect = country.code === current.code;

    if (isCorrect) {
      setStreak(s => s + 1);
      timerRef.current = setTimeout(() => {
        setPhase('leaving');
        setTimeout(() => {
          dealNext(country.code);
          setPhase('active');
        }, 320);
      }, 1100);
    } else {
      // Game over
      setStumpedBy(current);
      setStreak(prev => {
        const ended = prev;
        setFinalStreak(ended);
        setHighScore(best => {
          if (ended > best) {
            localStorage.setItem(HS_KEY, ended);
            setIsNewHigh(true);
            return ended;
          }
          return best;
        });
        return prev;
      });
      timerRef.current = setTimeout(() => {
        setPhase('gameover');
      }, 1400);
    }
  }, [selected, phase, current]);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const isGameOver = phase === 'gameover';
  const isLeaving = phase === 'leaving';
  const result = getResultMessage(finalStreak);
  const dm = darkMode;

  const t = dm ? {
    bg: '#0b0c10', dot: 'rgba(255,255,255,0.04)', text: '#eceaf6',
    textSecondary: '#555870', accent: '#e8c547', accentText: '#0b0c10',
    accentGlow: 'rgba(232,197,71,0.2)', progressTrack: '#1e2030',
    flagShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.5)',
    btnBg: '#161820', btnBorder: '#252738', btnText: '#c8c6d8',
    btnHoverBg: '#1e2130', btnHoverBorder: '#3a3d55', btnHoverText: '#eceaf6',
    correctBg: '#0f2e1a', correctBorder: '#3ddc84', correctText: '#3ddc84',
    wrongBg: '#2a0f10', wrongBorder: '#ff4d4d', wrongText: '#ff4d4d',
    revealBg: '#0a2118', ringBg: '#161820', titleColor: '#2e3048',
    promptColor: '#434660', cardBg: '#111318', cardBorder: '#1e2130',
    statBg: '#161820', statBorder: '#252738',
  } : {
    bg: '#f0ede6', dot: 'rgba(0,0,0,0.045)', text: '#1a1816',
    textSecondary: '#9a9080', accent: '#b8970f', accentText: '#ffffff',
    accentGlow: 'rgba(184,151,15,0.2)', progressTrack: '#ddd8cc',
    flagShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.12)',
    btnBg: '#ffffff', btnBorder: '#ddd8cc', btnText: '#2a2720',
    btnHoverBg: '#faf7f2', btnHoverBorder: '#b8a890', btnHoverText: '#1a1816',
    correctBg: '#edfaf3', correctBorder: '#16a34a', correctText: '#16a34a',
    wrongBg: '#fef2f2', wrongBorder: '#dc2626', wrongText: '#dc2626',
    revealBg: '#edfaf3', ringBg: '#ffffff', titleColor: '#c0b898',
    promptColor: '#9a9080', cardBg: '#faf7f2', cardBorder: '#e8e2d8',
    statBg: '#ffffff', statBorder: '#ddd8cc',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: t.bg,
      backgroundImage: `radial-gradient(circle, ${t.dot} 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: activeFont.heading,
      transition: 'background-color 0.4s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600;700;800&family=Barlow+Semi+Condensed:wght@600;700&family=Nunito:wght@600;700;800&family=DM+Sans:wght@500;600;700&family=Space+Mono:wght@400;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fg-btn {
          background: var(--btn-bg);
          border: 1.5px solid var(--btn-border);
          border-radius: 12px;
          padding: 16px 12px;
          color: var(--btn-text);
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          text-align: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s, opacity 0.15s;
          line-height: 1.2;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }
        .fg-btn:hover:not(:disabled):not(.fg-correct):not(.fg-wrong):not(.fg-dimmed) {
          background: var(--btn-hover-bg);
          border-color: var(--btn-hover-border);
          color: var(--btn-hover-text);
          transform: translateY(-1px);
        }
        .fg-btn:disabled { cursor: default; }
        .fg-btn.fg-entering {
          animation: ansEnter 0.38s cubic-bezier(.2,0,.3,1) both;
          animation-delay: var(--ans-delay, 0s);
        }
        .fg-btn.fg-correct {
          background: var(--correct-bg) !important;
          border-color: var(--correct-border) !important;
          color: var(--correct-text) !important;
          animation: correctPop 0.4s cubic-bezier(.3,1.4,.5,1) forwards;
        }
        .fg-btn.fg-wrong {
          background: var(--wrong-bg) !important;
          border-color: var(--wrong-border) !important;
          color: var(--wrong-text) !important;
          animation: shake 0.45s ease forwards;
        }
        .fg-btn.fg-dimmed { opacity: 0.22; }

        @keyframes ansEnter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes correctPop {
          0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-7px); }
          40%,80% { transform: translateX(7px); }
        }
        @keyframes flagEnter {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          0% { transform: scale(1); } 45% { transform: scale(1.18); } 75% { transform: scale(0.96); } 100% { transform: scale(1); }
        }
        .fg-badge-pop { animation: badgePop 0.5s cubic-bezier(.3,1.4,.5,1) forwards; }
        .fg-gameover-enter { animation: fadeUp 0.5s cubic-bezier(.2,0,.3,1) forwards; }

        /* Tweaks */
        .fg-tweaks-panel {
          position: fixed; bottom: 20px; right: 20px;
          background: var(--btn-bg); border: 1.5px solid var(--btn-border);
          border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          z-index: 999; min-width: 210px;
          font-family: var(--font-heading);
        }
        .fg-tweaks-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--text-secondary);
          margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;
        }
        .fg-tweaks-close {
          background: none; border: none; cursor: pointer;
          color: var(--text-secondary); font-size: 16px; padding: 0; line-height: 1;
        }
        .fg-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
        .fg-toggle-label { font-size: 14px; font-weight: 700; color: var(--text); }
        .fg-toggle {
          width: 40px; height: 22px; border-radius: 99px;
          background: var(--progress-track); position: relative;
          cursor: pointer; border: none; transition: background 0.2s; flex-shrink: 0;
        }
        .fg-toggle.on { background: var(--accent); }
        .fg-toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; border-radius: 50%; background: white;
          transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .fg-toggle.on::after { transform: translateX(18px); }
      `}</style>

      <style>{`
        :root {
          --btn-bg: ${t.btnBg}; --btn-border: ${t.btnBorder}; --btn-text: ${t.btnText};
          --btn-hover-bg: ${t.btnHoverBg}; --btn-hover-border: ${t.btnHoverBorder}; --btn-hover-text: ${t.btnHoverText};
          --correct-bg: ${t.correctBg}; --correct-border: ${t.correctBorder}; --correct-text: ${t.correctText};
          --wrong-bg: ${t.wrongBg}; --wrong-border: ${t.wrongBorder}; --wrong-text: ${t.wrongText};
          --accent: ${t.accent}; --text: ${t.text}; --text-secondary: ${t.textSecondary};
          --progress-track: ${t.progressTrack}; --font-heading: ${activeFont.heading}; --font-mono: ${activeFont.mono};
        }
      `}</style>

      {/* Tweaks panel */}
      {tweaksVisible && (
        <div className="fg-tweaks-panel">
          <div className="fg-tweaks-title">
            Tweaks
            <button className="fg-tweaks-close" onClick={() => { setTweaksVisible(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}>✕</button>
          </div>
          <div className="fg-toggle-row">
            <span className="fg-toggle-label">Dark mode</span>
            <button className={`fg-toggle ${darkMode ? 'on' : ''}`} onClick={() => toggleDark(!darkMode)} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.textSecondary, marginBottom: 10 }}>Font</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FONT_OPTIONS.map(f => (
              <button key={f.id} onClick={() => changeFont(f.id)} style={{
                background: fontId === f.id ? (dm ? '#1e2030' : '#fff8e6') : 'transparent',
                border: `1.5px solid ${fontId === f.id ? t.accent : t.btnBorder}`,
                borderRadius: 8, padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
              }}>
                <div style={{ fontFamily: f.heading, fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1 }}>{f.label}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: t.textSecondary, marginTop: 3, letterSpacing: '0.08em' }}>{f.vibe}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Game Over screen ── */}
      {isGameOver ? (
        <div className="fg-gameover-enter" style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Label */}
          <div style={{ fontFamily: activeFont.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: t.textSecondary, marginBottom: 20 }}>Game Over</div>

          {/* Stumped-by flag */}
          {stumpedBy && (
            <div style={{ width: '100%', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ fontFamily: activeFont.heading, fontSize: 17, fontWeight: 800, color: t.text }}>{stumpedBy.name}</div>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: dm ? '#ff4d4d' : '#dc2626', flexShrink: 0 }} />
                <div style={{ fontFamily: activeFont.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.textSecondary }}>stumped you</div>
              </div>
              <div style={{
                borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10',
                boxShadow: `0 0 0 2px ${dm ? 'rgba(255,77,77,0.5)' : 'rgba(220,38,38,0.25)'}, ${t.flagShadow}`,
              }}>
                <img
                  src={`https://flagcdn.com/w640/${stumpedBy.code}.png`}
                  alt={stumpedBy.name}
                  draggable="false"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 14 }}>
            <div style={{
              flex: 1, background: t.statBg, border: `1.5px solid ${t.statBorder}`,
              borderRadius: 14, padding: '18px 16px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: activeFont.mono, fontSize: 34, fontWeight: 700, color: t.text, lineHeight: 1, marginBottom: 7 }}>{finalStreak}</div>
              <div style={{ fontFamily: activeFont.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.textSecondary }}>This run</div>
            </div>
            <div style={{
              flex: 1, background: t.statBg,
              border: `1.5px solid ${isNewHigh ? t.accent : t.statBorder}`,
              borderRadius: 14, padding: '18px 16px', textAlign: 'center',
              boxShadow: isNewHigh ? `0 0 24px ${t.accentGlow}` : 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}>
              <div style={{ fontFamily: activeFont.mono, fontSize: 34, fontWeight: 700, color: isNewHigh ? t.accent : t.text, lineHeight: 1, marginBottom: 7 }}>{highScore}</div>
              <div style={{ fontFamily: activeFont.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: isNewHigh ? t.accent : t.textSecondary }}>
                {isNewHigh ? '✦ new best' : 'Best ever'}
              </div>
            </div>
          </div>

          <button onClick={startGame} style={{
            background: t.accent, border: 'none', borderRadius: 12,
            padding: '15px 0', fontFamily: activeFont.heading,
            fontSize: 16, fontWeight: 800, color: t.accentText,
            cursor: 'pointer', letterSpacing: '0.04em',
            boxShadow: `0 4px 24px ${t.accentGlow}`,
            transition: 'transform 0.15s',
            width: '100%',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Try Again
          </button>
        </div>

      ) : current ? (
        /* ── Game screen ── */
        <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: activeFont.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: t.textSecondary, textTransform: 'uppercase' }}>
              Flag Guesser
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: streak >= 3 ? (dm ? '#1c1f10' : '#fffbea') : t.btnBg,
              border: `1.5px solid ${streak >= 3 ? t.accent : t.btnBorder}`,
              borderRadius: 99, padding: '5px 14px',
              transition: 'background 0.3s, border-color 0.3s',
            }}>
              <span style={{ fontFamily: activeFont.mono, fontSize: 13, fontWeight: 700, color: streak >= 3 ? t.accent : t.textSecondary }}>
                {streak} {streak === 1 ? 'correct' : 'in a row'}
              </span>
            </div>
          </div>

          {/* Flag */}
          <div key={`flag-${animKey}`} style={{
            borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10',
            marginBottom: 22, boxShadow: t.flagShadow,
            opacity: isLeaving ? 0 : 1,
            transform: isLeaving ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
            animation: !isLeaving ? 'flagEnter 0.4s cubic-bezier(.2,0,.3,1) forwards' : 'none',
          }}>
            <img
              src={`https://flagcdn.com/w640/${current.code}.png`}
              alt="country flag"
              onLoad={() => setImgLoaded(true)}
              draggable="false"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.25s ease' }}
            />
          </div>

          {/* Prompt */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: t.promptColor, marginBottom: 12,
            opacity: isLeaving ? 0 : 1, transition: 'opacity 0.2s ease',
          }}>Which country is this?</div>

          {/* Answers */}
          <div key={`opts-${animKey}`} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            opacity: isLeaving ? 0 : 1, transform: isLeaving ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
          }}>
            {options.map((country, i) => {
              const isSelected = selected && selected.code === country.code;
              const isCorrectAnswer = selected && country.code === current.code;
              const isWrong = isSelected && country.code !== current.code;
              const isDimmed = selected && !isSelected && !isCorrectAnswer;
              let cls = 'fg-btn';
              if (!selected) cls += ' fg-entering';
              if (isCorrectAnswer && selected) cls += ' fg-correct';
              else if (isWrong) cls += ' fg-wrong';
              else if (isDimmed) cls += ' fg-dimmed';
              return (
                <button
                  key={country.code}
                  className={cls}
                  style={!selected ? { '--ans-delay': `${i * 0.06}s` } : {}}
                  onClick={() => handleSelect(country)}
                  disabled={!!selected}
                >
                  {country.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

window.FlagGuesser = FlagGuesser;

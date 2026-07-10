/* @ds-bundle: {"format":3,"namespace":"TallegDesignSystem_2740dd","components":[],"sourceHashes":{"ui_kits/talvaerkstedet-app/app.jsx":"653f0470bc6d","ui_kits/talvaerkstedet-app/games.jsx":"59894ab19ac5","ui_kits/talvaerkstedet-app/screens.jsx":"29c361c0ef81","ui_kits/talvaerkstedet-app/ui.jsx":"c292b2bd17b9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TallegDesignSystem_2740dd = window.TallegDesignSystem_2740dd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/talvaerkstedet-app/app.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Talværkstedet UI kit — app shell & state
const {
  useState: useApp,
  useEffect: useAppEffect
} = React;
const SAVE_KEY = 'talvaerkstedet-save-v2';
const BLOCK = 5; // ARITH_BLOCK_SIZE
const STAR_PER = 2; // stars per correct answer
const TOTAL_GEARS = 5;
function load() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function App() {
  const saved = load();
  const [screen, setScreen] = useApp(saved.name ? 'main' : 'name');
  const [name, setName] = useApp(saved.name || '');
  const [stars, setStars] = useApp(saved.stars || 0);
  const [gears, setGears] = useApp(saved.gears || 0);
  const [progress, setProgress] = useApp(saved.progress || 0);
  const [activeGame, setActiveGame] = useApp(saved.activeGame || 'regnestykker');
  const [justPopped, setJustPopped] = useApp(null);
  const [celebration, setCelebration] = useApp(null);
  const [confetti, setConfetti] = useApp(false);
  useAppEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      name,
      stars,
      gears,
      progress,
      activeGame
    }));
  }, [name, stars, gears, progress, activeGame]);
  const burst = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1900);
  };
  const onCorrect = () => {
    setStars(s => s + STAR_PER);
    burst();
    const np = progress + 1;
    if (np >= BLOCK && gears < TOTAL_GEARS) {
      const repaired = gears; // index of gear being repaired
      setGears(g => g + 1);
      setProgress(0);
      setJustPopped(repaired);
      setTimeout(() => setJustPopped(null), 700);
      setTimeout(() => setCelebration({
        title: 'Et tandhjul repareret!',
        text: `Flot, ${name}! ${repaired + 1} af ${TOTAL_GEARS} tandhjul er fikset.`
      }), 500);
    } else {
      setProgress(np >= BLOCK ? BLOCK : np);
    }
  };
  const restart = () => {
    localStorage.removeItem(SAVE_KEY);
    setName('');
    setStars(0);
    setGears(0);
    setProgress(0);
    setActiveGame('regnestykker');
    setCelebration(null);
    setScreen('name');
  };
  const start = n => {
    setName(n);
    setScreen('main');
  };
  if (screen === 'name') return /*#__PURE__*/React.createElement(NameScreen, {
    onStart: start
  });
  const gameProps = {
    onCorrect,
    progress,
    blockSize: BLOCK
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Header, {
    stars: stars,
    onRestart: restart
  }), /*#__PURE__*/React.createElement(MachinePanel, {
    gears: gears,
    justPopped: justPopped,
    name: name
  }), /*#__PURE__*/React.createElement(TabBar, {
    active: activeGame,
    stars: stars,
    onPick: setActiveGame
  }), activeGame === 'regnestykker' && /*#__PURE__*/React.createElement(Regnestykker, _extends({
    key: "reg"
  }, gameProps)), activeGame === 'tallinje' && /*#__PURE__*/React.createElement(Tallinje, _extends({
    key: "tal"
  }, gameProps)), (activeGame === 'gange' || activeGame === 'divider') && /*#__PURE__*/React.createElement("div", {
    className: "task"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-instruction instruction"
  }, "Kommer snart!"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      color: 'var(--text-light)'
    }
  }, "Dette minispil er ikke en del af UI-kit-demoen endnu.")), /*#__PURE__*/React.createElement(Confetti, {
    run: confetti
  }), celebration && /*#__PURE__*/React.createElement(Celebration, _extends({}, celebration, {
    onClose: () => setCelebration(null)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/talvaerkstedet-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/talvaerkstedet-app/games.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Talværkstedet UI kit — minigames
const {
  useState: useStateG,
  useEffect: useEffectG
} = React;
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
const rint = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// ---------------- Regnestykker (arithmetic) ----------------
function makeArith() {
  const op = Math.random() < 0.5 ? '+' : '−';
  let a, b, ans;
  if (op === '+') {
    a = rint(11, 48);
    b = rint(11, 48);
    ans = a + b;
  } else {
    a = rint(30, 89);
    b = rint(11, a - 10);
    ans = a - b;
  }
  const set = new Set([ans]);
  while (set.size < 4) {
    const d = ans + [-1, 1, -10, 10, -2, 2][rint(0, 5)];
    if (d > 0) set.add(d);
  }
  return {
    a,
    b,
    op,
    ans,
    options: shuffle([...set])
  };
}
function Regnestykker({
  onCorrect,
  progress,
  blockSize
}) {
  const [q, setQ] = useStateG(makeArith);
  const [picked, setPicked] = useStateG(null); // value
  const [solved, setSolved] = useStateG(false);
  const [fb, setFb] = useStateG(null);
  const pick = v => {
    if (solved) return;
    if (v === q.ans) {
      setPicked(v);
      setSolved(true);
      setFb({
        kind: 'ok',
        title: 'Rigtigt!',
        text: 'Godt klaret — du fik den helt rigtige!'
      });
      onCorrect();
    } else {
      setPicked(v);
      setFb({
        kind: 'try',
        title: 'Ikke helt — prøv igen!',
        text: `${q.a} ${q.op} ${q.b}: tæl roligt efter. Du er tæt på!`
      });
    }
  };
  const next = () => {
    setQ(makeArith());
    setPicked(null);
    setSolved(false);
    setFb(null);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "task"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-instruction instruction"
  }, "Hvad er svaret?"), /*#__PURE__*/React.createElement("div", {
    className: "progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill",
    style: {
      width: progress / blockSize * 100 + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "t-equation equation"
  }, q.a, " ", q.op, " ", q.b, " = ", /*#__PURE__*/React.createElement("span", {
    className: "ans-slot"
  }, solved ? q.ans : '?')), /*#__PURE__*/React.createElement("div", {
    className: "options"
  }, q.options.map(v => {
    let cls = 'arith-btn';
    if (picked === v && v === q.ans) cls += ' correct';else if (picked === v) cls += ' wrong';else if (solved && v === q.ans) cls += ' correct';
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      className: cls,
      disabled: solved,
      onClick: () => pick(v)
    }, v);
  }))), fb && /*#__PURE__*/React.createElement(FeedbackBox, _extends({}, fb, {
    onNext: solved ? next : null
  })));
}

// ---------------- Tallinje (number line) ----------------
// Harder: only multiples of 5 are labelled; in-between marks are blank,
// and targets are never on a label, so the child must count.
function Tallinje({
  onCorrect,
  progress,
  blockSize
}) {
  const MAX = 10;
  const TARGETS = [1, 2, 3, 4, 6, 7, 8, 9];
  const pickTarget = () => TARGETS[rint(0, TARGETS.length - 1)];
  const [target, setTarget] = useStateG(pickTarget);
  const [picked, setPicked] = useStateG(null);
  const [solved, setSolved] = useStateG(false);
  const [fb, setFb] = useStateG(null);
  const frogLeft = (picked != null ? picked : 0) / MAX * 100;
  const pick = n => {
    if (solved) return;
    setPicked(n);
    if (n === target) {
      setSolved(true);
      setFb({
        kind: 'ok',
        title: 'Rigtigt!',
        text: `Frøen hoppede helt rigtigt til ${target}!`
      });
      onCorrect();
    } else {
      setFb({
        kind: 'try',
        title: 'Ikke helt — prøv igen!',
        text: `Tæl tern fra nærmeste tal hen til ${target}.`
      });
    }
  };
  const next = () => {
    setTarget(pickTarget());
    setPicked(null);
    setSolved(false);
    setFb(null);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "task"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-instruction instruction"
  }, "Hop til ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--purple)'
    }
  }, target)), /*#__PURE__*/React.createElement("div", {
    className: "progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill",
    style: {
      width: progress / blockSize * 100 + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "numline-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "numline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nl-frog",
    style: {
      left: frogLeft + '%'
    }
  }, "\uD83D\uDC38"), Array.from({
    length: MAX + 1
  }, (_, n) => {
    const labelled = n % 5 === 0;
    const isPicked = picked === n;
    let cls = 'nl-tick ' + (labelled ? 'major' : 'minor');
    if (labelled && n === 0) cls += ' start';
    if (isPicked && n === target) cls += ' correct';else if (isPicked) cls += ' wrong';
    if (isPicked && !labelled) cls += ' revealed';
    // show a number when: it's a label, OR this blank mark was just picked
    const showNum = labelled || isPicked;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      className: cls,
      style: {
        left: n / MAX * 100 + '%'
      },
      onClick: () => pick(n)
    }, showNum ? /*#__PURE__*/React.createElement("span", {
      className: "nl-num"
    }, n) : /*#__PURE__*/React.createElement("span", {
      className: "nl-bar"
    }));
  })))), fb && /*#__PURE__*/React.createElement(FeedbackBox, _extends({}, fb, {
    onNext: solved ? next : null
  })));
}
Object.assign(window, {
  Regnestykker,
  Tallinje
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/talvaerkstedet-app/games.jsx", error: String((e && e.message) || e) }); }

// ui_kits/talvaerkstedet-app/screens.jsx
try { (() => {
// Talværkstedet UI kit — shell screens
const {
  useState: useStateS,
  useEffect: useEffectS
} = React;

// --- Onboarding name screen ---
function NameScreen({
  onStart
}) {
  const [name, setName] = useStateS('');
  const [out, setOut] = useStateS(false);
  const go = () => {
    const n = name.trim() || 'ven';
    setOut(true);
    setTimeout(() => onStart(n), 380);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `namescreen${out ? ' out' : ''}`
  }, /*#__PURE__*/React.createElement(Gear, {
    className: "ns-gear"
  }), /*#__PURE__*/React.createElement("h1", {
    className: "ns-title"
  }, "Talv\xE6rkstedet \u2699\uFE0F"), /*#__PURE__*/React.createElement("p", {
    className: "ns-sub"
  }, "Hj\xE6lp robotten i gang igen!", /*#__PURE__*/React.createElement("br", null), "Hvad hedder du?"), /*#__PURE__*/React.createElement("input", {
    className: "ns-input",
    value: name,
    maxLength: 14,
    placeholder: "Dit navn",
    onChange: e => setName(e.target.value),
    onKeyDown: e => e.key === 'Enter' && go(),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "green",
    big: true,
    onClick: go
  }, "Spil!")));
}

// --- Header ---
function Header({
  stars,
  onRestart
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-mark.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "wm"
  }, "Talv\xE6rkstedet")), /*#__PURE__*/React.createElement("div", {
    className: "hdr-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "stars-chip"
  }, "\u2B50 ", stars), /*#__PURE__*/React.createElement(IconButton, {
    title: "Hj\xE6lp"
  }, "?"), /*#__PURE__*/React.createElement(IconButton, {
    title: "Start forfra",
    onClick: onRestart
  }, "\u21BA"));
}

// --- Machine panel (robot + 5 gears) ---
function MachinePanel({
  gears,
  justPopped,
  name
}) {
  const TOTAL = 5;
  return /*#__PURE__*/React.createElement("div", {
    className: "machine"
  }, /*#__PURE__*/React.createElement("div", {
    className: "machine-bot"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/mascot-placeholder.svg",
    alt: "Robot"
  })), /*#__PURE__*/React.createElement("div", {
    className: "machine-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gears"
  }, Array.from({
    length: TOTAL
  }, (_, i) => /*#__PURE__*/React.createElement(Gear, {
    key: i,
    className: `gear${i < gears ? ' on' : ''}${justPopped === i ? ' pop' : ''}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "machine-status"
  }, gears === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, "Saml stjerner og repar\xE9r robotten, ", name, "!"), gears > 0 && gears < TOTAL && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, gears, " af ", TOTAL), " tandhjul repareret!"), gears >= TOTAL && /*#__PURE__*/React.createElement("b", null, "Robotten er helt repareret! \uD83C\uDF89"))));
}

// --- Minigame tab bar ---
const GAMES = [{
  id: 'tallinje',
  emoji: '📏',
  name: 'Tallinje',
  req: 0
}, {
  id: 'regnestykker',
  emoji: '🔢',
  name: 'Regnestykker',
  req: 0
}, {
  id: 'gange',
  emoji: '✖️',
  name: 'Gangeværk',
  req: 40
}, {
  id: 'divider',
  emoji: '➗',
  name: 'Delestykker',
  req: 90
}];
function TabBar({
  active,
  stars,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, GAMES.map(g => {
    const locked = stars < g.req;
    return /*#__PURE__*/React.createElement("button", {
      key: g.id,
      className: `tab${active === g.id ? ' active' : ''}${locked ? ' locked' : ''}`,
      onClick: () => !locked && onPick(g.id)
    }, /*#__PURE__*/React.createElement("span", null, g.emoji, " ", g.name), locked && /*#__PURE__*/React.createElement("span", {
      className: "req"
    }, "\uD83D\uDD12 ", g.req, " \u2B50"));
  }));
}
Object.assign(window, {
  NameScreen,
  Header,
  MachinePanel,
  TabBar,
  GAMES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/talvaerkstedet-app/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/talvaerkstedet-app/ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Talværkstedet UI kit — shared primitives
const {
  useState,
  useEffect,
  useRef
} = React;

// --- Gear SVG (matches logo mark teeth) ---
function Gear({
  className = '',
  style
}) {
  const teeth = [0, 60, 120, 180, 240, 300];
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    viewBox: "0 0 48 48",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "currentColor"
  }, teeth.map(a => /*#__PURE__*/React.createElement("rect", {
    key: a,
    x: "20",
    y: "0",
    width: "8",
    height: "12",
    rx: "2.5",
    transform: `rotate(${a} 24 24)`
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "16"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "6",
    fill: "#FFF8EC"
  }));
}

// --- Buttons ---
function Button({
  color = 'green',
  big,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `btn ${color}${big ? ' big' : ''}`
  }, rest), children);
}
function IconButton({
  title,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-btn",
    title: title
  }, rest), children);
}

// --- Feedback box (slides up) ---
function FeedbackBox({
  kind,
  title,
  text,
  onNext
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `feedback ${kind === 'ok' ? 'ok' : 'try'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "fb-ico"
  }, kind === 'ok' ? '🎉' : '💡'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fb-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "fb-text"
  }, text)), /*#__PURE__*/React.createElement("div", {
    className: "fb-spacer"
  }), kind === 'ok' && onNext && /*#__PURE__*/React.createElement(Button, {
    color: "blue",
    onClick: onNext
  }, "N\xE6ste opgave \u2192"));
}

// --- Celebration overlay ---
function Celebration({
  title,
  text,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "celebrate",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "emoji"
  }, "\u2699\uFE0F"), /*#__PURE__*/React.createElement("div", {
    className: "ttl"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "txt"
  }, text), /*#__PURE__*/React.createElement(Button, {
    color: "green",
    big: true,
    onClick: onClose
  }, "Videre!")));
}

// --- Confetti burst ---
function Confetti({
  run
}) {
  if (!run) return null;
  const colors = ['#4A90E2', '#5CB85C', '#F5A623', '#E8661A', '#7B61FF', '#E91E8C'];
  const pieces = Array.from({
    length: 70
  }, (_, i) => ({
    left: Math.random() * 100,
    bg: colors[i % colors.length],
    dur: 1.4 + Math.random() * 1.4,
    delay: Math.random() * 0.5,
    rot: Math.random() * 360
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "confetti"
  }, pieces.map((p, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      left: p.left + '%',
      background: p.bg,
      animationDuration: p.dur + 's',
      animationDelay: p.delay + 's',
      transform: `rotate(${p.rot}deg)`
    }
  })));
}
Object.assign(window, {
  Gear,
  Button,
  IconButton,
  FeedbackBox,
  Celebration,
  Confetti
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/talvaerkstedet-app/ui.jsx", error: String((e && e.message) || e) }); }

})();

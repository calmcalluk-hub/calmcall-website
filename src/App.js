import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   CALMCALL — MARKETING SITE
   Design tokens
   ============================================================ */
const T = {
  teal: "#1C4F47",
  tealDeep: "#123832",
  tealBright: "#2A7C6F",
  charcoal: "#1A1F26",
  ink: "#2B2F36",
  porcelain: "#FAF9F6",
  porcelainDeep: "#F2F0EA",
  amber: "#E8A33D",
  amberDeep: "#C87F1F",
  white: "#FFFFFF",
  line: "#E4E1D8",
  muted: "#6B7280",
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ============================================================
   SHARED: Nav + Footer
   ============================================================ */
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "try", label: "Try CalmCall" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

function AnnouncementBanner() {
  return (
    <div style={{ background: T.teal, padding: "10px 28px", textAlign: "center" }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.white, fontWeight: 500 }}>
        Now onboarding UK trades &amp; service businesses &mdash; <span style={{ color: T.amber, fontWeight: 600 }}>book your demo today</span>
      </span>
    </div>
  );
}

function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: scrolled ? "rgba(250,249,246,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.line}` : "1px solid transparent",
        transition: "all .25s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => { setPage("home"); setMobileOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}
        >
          <img src="/logo.jpeg" alt="CalmCall" style={{ width: 42, height: 42, borderRadius: 10, objectFit: "cover" }} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: T.charcoal, letterSpacing: -0.3 }}>
            CalmCall
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-desktop">
          {NAV_LINKS.filter(l => l.id !== "home").map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: FONT_BODY, fontSize: 14.5, fontWeight: 500,
                color: page === l.id ? T.teal : T.ink,
                padding: 0,
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => setPage("contact")}
            style={{
              background: T.teal, color: T.white, border: "none",
              padding: "10px 22px", borderRadius: 100,
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            Book a Demo
          </button>
        </div>

        <button
          className="nav-burger"
          onClick={() => setMobileOpen(v => !v)}
          style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.charcoal }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: T.porcelain, borderTop: `1px solid ${T.line}`, padding: "8px 28px 20px" }} className="nav-mobile-panel">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => { setPage(l.id); setMobileOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", padding: "12px 0",
                fontFamily: FONT_BODY, fontSize: 16, fontWeight: 500,
                color: page === l.id ? T.teal : T.ink, borderBottom: `1px solid ${T.line}`,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DEMO_NUMBER = "0114 697 4507";
const DEMO_TEL = "tel:+441146974507";

function CallDemo({ dark, center, style }) {
  return (
    <a href={DEMO_TEL} aria-label={`Call our AI receptionist on ${DEMO_NUMBER}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", padding: "10px 18px 10px 10px", borderRadius: 100,
        background: dark ? "rgba(255,255,255,0.08)" : T.white, border: `1px solid ${dark ? "rgba(255,255,255,0.16)" : T.line}`,
        margin: center ? "0 auto" : 0, ...style }}>
      <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "50%", background: T.amber, color: T.charcoal, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
      </span>
      <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: dark ? "rgba(255,255,255,0.65)" : T.muted }}>Hear it live: ring our AI receptionist</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: dark ? T.white : T.charcoal, letterSpacing: 0.3 }}>{DEMO_NUMBER}</span>
      </span>
    </a>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: T.charcoal, color: "rgba(255,255,255,0.75)", padding: "64px 28px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/logo.jpeg" alt="CalmCall" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} />
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: T.white }}>CalmCall</span>
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
              Business call control without the overwhelm. Never let a missed call become a missed opportunity.
            </p>
            <a href="mailto:calmcalluk@gmail.com" style={{ fontFamily: FONT_BODY, fontSize: 14, color: T.amber, textDecoration: "none", fontWeight: 500 }}>
              calmcalluk@gmail.com
            </a>
            <div style={{ marginTop: 20 }}><CallDemo dark /></div>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Company</p>
              {["home", "about", "blog", "contact"].map(id => (
                <button key={id} onClick={() => setPage(id)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", padding: 0, textTransform: "capitalize" }}>
                  {id}
                </button>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Product</p>
              <button onClick={() => setPage("try")} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", padding: 0 }}>Try CalmCall</button>
              <button onClick={() => setPage("pricing")} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", padding: 0 }}>Pricing</button>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, color: "rgba(255,255,255,0.4)" }}>Basic</span>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, color: "rgba(255,255,255,0.4)" }}>Pro</span>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Enterprise</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 CalmCall. All rights reserved.</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Business Call Control Without The Overwhelm</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   HERO PHONE — walks through the whole CalmCall journey:
   answer in your voice → triage → diary → customer text → takings
   ============================================================ */
const PHONE_STEPS = [
  "Answers in your voice",
  "Sorts calls by urgency",
  "Books it in the diary",
  "Texts your customer",
  "Shows what you won",
];

function EcosystemPhone() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const t = setInterval(() => setStep(s => (s + 1) % PHONE_STEPS.length), 3800);
    return () => clearInterval(t);
  }, [paused]);

  const Status = () => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px 0", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, color: T.charcoal }}>
      <span>9:41</span><span aria-hidden="true">&#9679;&#9679;&#9679;</span>
    </div>
  );
  const Header = ({ title }) => (
    <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/logo.jpeg" alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: "cover" }} />
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: T.charcoal }}>{title}</span>
    </div>
  );
  const screen = { background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column" };
  const small = { fontFamily: FONT_BODY, fontSize: 12, color: T.muted, margin: 0 };
  const dot = c => ({ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 });

  const screens = [
    // 0 — AI answering in the owner's cloned voice
    <div key="0" style={screen}>
      <Status />
      <div style={{ padding: "28px 20px 0", textAlign: "center" }}>
        <p style={{ ...small, marginBottom: 6 }}>Answering for you</p>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: T.charcoal, margin: "0 0 14px" }}>07700 900 332</p>
        <Waveform color={T.teal} bars={22} height={34} />
        <p style={{ ...small, marginTop: 8 }}>In Dave's own voice</p>
      </div>
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ alignSelf: "flex-start", maxWidth: "86%", background: T.white, border: `1px solid ${T.line}`, borderRadius: "14px 14px 14px 4px", padding: "9px 12px", fontFamily: FONT_BODY, fontSize: 12.5, lineHeight: 1.45, color: T.charcoal }}>
          Hi, it's Dave's Plumbing. Dave's on a job &ndash; I'm his assistant. What can I help with?
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: "86%", background: T.teal, borderRadius: "14px 14px 4px 14px", padding: "9px 12px", fontFamily: FONT_BODY, fontSize: 12.5, lineHeight: 1.45, color: T.white }}>
          Boiler's packed in. No heating and two kids at home.
        </div>
      </div>
    </div>,
    // 1 — Traffic-light triage
    <div key="1" style={screen}>
      <Status /><Header title="Calls" />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["#E24B4A", "Priya Shah", "Boiler out, no heating", "Urgent"],
          ["#E8A33D", "Sarah Nguyen", "Quote for a kitchen tap", "This week"],
          ["#2A7C6F", "Grace Okafor", "Saturday opening hours", "Low"],
        ].map(([c, name, note, tag]) => (
          <div key={name} style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={dot(c)} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.charcoal, margin: 0 }}>{name}</p>
              <p style={{ ...small, fontSize: 11.5 }}>{note}</p>
            </div>
            <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, fontWeight: 600, color: c }}>{tag}</span>
          </div>
        ))}
        <p style={{ ...small, fontSize: 11.5, marginTop: 6, lineHeight: 1.5 }}>Full transcript and summary on every call.</p>
      </div>
    </div>,
    // 2 — Diary
    <div key="2" style={screen}>
      <Status /><Header title="Diary" />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ ...small, fontWeight: 600 }}>Today</p>
        {[["11:00", "Service, R. Patel", false], ["14:30", "Boiler repair, Priya", true], ["16:00", "Quote visit, Sarah", false]].map(([time, title, isNew]) => (
          <div key={time} style={{ background: isNew ? T.teal : T.white, border: isNew ? "none" : `1px solid ${T.line}`, borderRadius: 12, padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: isNew ? "rgba(255,255,255,0.75)" : T.muted, display: "block" }}>{time}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: isNew ? T.white : T.charcoal, fontWeight: 600 }}>{title}</span>
            </div>
            {isNew && <span style={{ background: T.amber, color: T.charcoal, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100 }}>New</span>}
          </div>
        ))}
      </div>
    </div>,
    // 3 — Customer text with tracking link
    <div key="3" style={screen}>
      <Status /><Header title="Messages" />
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "88%", background: T.teal, borderRadius: "16px 16px 4px 16px", padding: "11px 14px" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.white, margin: 0, lineHeight: 1.5 }}>
            Hi Priya, you're booked for 14:30 today. Follow Dave's arrival here: <span style={{ color: T.amber, textDecoration: "underline" }}>calmcall.co.uk/t/8KD2</span>
          </p>
        </div>
        <p style={{ ...small, fontSize: 11, alignSelf: "flex-end" }}>Delivered</p>
        <div style={{ alignSelf: "flex-start", background: T.white, border: `1px solid ${T.line}`, borderRadius: "16px 16px 16px 4px", padding: "9px 13px", fontFamily: FONT_BODY, fontSize: 12.5, color: T.charcoal }}>
          Brilliant, thank you!
        </div>
      </div>
    </div>,
    // 4 — Revenue
    <div key="4" style={screen}>
      <Status /><Header title="This week" />
      <div style={{ padding: 18 }}>
        <p style={small}>Won from calls you couldn't take</p>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 600, color: T.teal, margin: "4px 0 18px" }}>&pound;1,240</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90, marginBottom: 8 }} aria-hidden="true">
          {[30, 55, 20, 70, 45, 90, 60].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? T.amber : T.tealBright, borderRadius: 4, opacity: i === 5 ? 1 : 0.8 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...small, fontSize: 10.5 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <p style={{ ...small, marginTop: 16, lineHeight: 1.5 }}>7 jobs booked from missed calls.</p>
      </div>
    </div>,
  ];

  return (
    <div style={{ width: 280, margin: "0 auto" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ width: 280, height: 560, borderRadius: 44, background: T.charcoal, border: `8px solid ${T.charcoal}`, boxShadow: "0 40px 80px rgba(28,79,71,0.25), 0 10px 30px rgba(0,0,0,0.15)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: T.charcoal, borderRadius: "0 0 16px 16px", zIndex: 10 }} />
        {screens[step]}
      </div>
      <p aria-live="polite" style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 13.5, color: T.charcoal, marginTop: 18, fontWeight: 600 }}>{PHONE_STEPS[step]}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {PHONE_STEPS.map((label, i) => (
          <button key={label} onClick={() => { setStep(i); setPaused(true); }} aria-label={`Show: ${label}`} aria-current={i === step}
            style={{ width: i === step ? 24 : 8, height: 8, padding: 0, border: "none", borderRadius: 4, background: i === step ? T.amber : T.line, cursor: "pointer", transition: "width .3s" }} />
        ))}
      </div>
    </div>
  );
}

function Waveform({ color, bars = 28, height = 40 }) {
  // Static, deterministic "voice" shape — no animation needed.
  const heights = Array.from({ length: bars }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height }}>
      {heights.map((h, i) => (
        <span key={i} style={{ width: 3, height: `${Math.round(h * 100)}%`, background: color, borderRadius: 2 }} />
      ))}
    </div>
  );
}

/* ============================================================
   MISSED CALL WIDGET — hero attention-grabber + interactive cost calculator
   Two distinct states: compact ticker card, then a fuller detailed calculator
   ============================================================ */
function MissedCallWidget() {
  const examples = [
    { time: "09:42", job: "Brake job enquiry", value: 280 },
    { time: "11:15", job: "Emergency boiler repair", value: 340 },
    { time: "13:03", job: "Kitchen tap replacement", value: 165 },
  ];
  const [idx, setIdx] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const [callsPerDay, setCallsPerDay] = useState(15);
  const [missedPct, setMissedPct] = useState(30);
  const [convertPct, setConvertPct] = useState(35);
  const [jobValue, setJobValue] = useState(220);

  useEffect(() => {
    if (showCalc) return;
    const len = examples.length;
    const t = setInterval(() => setIdx(i => (i + 1) % len), 2600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalc]);

  const current = examples[idx];
  const missedPerDay = Math.round((callsPerDay * missedPct) / 100);
  const lostJobsPerWeek = Math.round(missedPerDay * (convertPct / 100) * 5);
  const lostPerMonth = Math.round(lostJobsPerWeek * jobValue * 4.33);

  const Slider = ({ label, value, setValue, min, max, prefix, suffix }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <label style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted }}>{label}</label>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal }}>{prefix || ""}{value}{suffix || ""}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => setValue(Number(e.target.value))} style={{ width: "100%", accentColor: T.teal }} />
    </div>
  );

  if (!showCalc) {
    return (
      <div style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 18, padding: "20px 22px", maxWidth: 400, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "#FBEDEA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>
            &#128222;
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: "#B8483A", margin: 0 }}>Missed call at {current.time}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.charcoal, margin: "2px 0 0", fontWeight: 500 }}>{current.job} &mdash; worth around &pound;{current.value}</p>
          </div>
        </div>
        <button onClick={() => setShowCalc(true)} style={{
          width: "100%", background: T.porcelainDeep, border: "none", borderRadius: 100,
          padding: "10px 0", fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.teal, cursor: "pointer",
        }}>
          What's this costing your business? &rarr;
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "28px 30px", maxWidth: 440, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: T.amberDeep, margin: 0 }}>What's it costing you?</p>
        <button onClick={() => setShowCalc(false)} style={{ background: "none", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }} aria-label="Back">&times;</button>
      </div>
      <Slider label="Calls per day" value={callsPerDay} setValue={setCallsPerDay} min={2} max={60} />
      <Slider label="Roughly missed" value={missedPct} setValue={setMissedPct} min={0} max={100} suffix="%" />
      <Slider label="Turn into a job" value={convertPct} setValue={setConvertPct} min={0} max={100} suffix="%" />
      <Slider label="Average job value" value={jobValue} setValue={setJobValue} min={20} max={2000} prefix="£" />
      <div style={{ background: T.teal, borderRadius: 14, padding: "18px 20px", marginTop: 6, textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>Estimated lost revenue per month</p>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 600, color: T.white, margin: 0 }}>&pound;{lostPerMonth.toLocaleString()}</p>
      </div>
    </div>
  );
}

/* ============================================================
   BUSINESS TYPE FINDER — "type your business" widget on the homepage
   ============================================================ */
const BUSINESS_LIBRARY = [
  { name: "Mechanics", aliases: ["mechanic", "garage", "car repair", "auto repair", "mot"], line: "A missed call is a car left on the ramp — and a customer already ringing the garage down the road." },
  { name: "Plumbers", aliases: ["plumber", "plumbing"], line: "A missed call at 7am is a burst pipe going to whoever picks up first." },
  { name: "Electricians", aliases: ["electrician", "electrical"], line: "No answer on a call-out, and the customer's already dialling the next name on the list." },
  { name: "Locksmiths", aliases: ["locksmith", "lock out", "lockout"], line: "Someone locked out doesn't wait around — they call the next locksmith within a minute." },
  { name: "Jewellers", aliases: ["jeweller", "jewelry", "jewellery"], line: "A missed call could be a repair, a valuation, or a customer ready to spend four figures." },
  { name: "Beauticians", aliases: ["beautician", "beauty salon", "nail salon", "nail tech", "hairdresser", "hair salon", "barber"], line: "A missed booking call is an empty chair that afternoon — and a client who books elsewhere." },
  { name: "Roofers", aliases: ["roofer", "roofing"], line: "Storm damage enquiries go to whoever answers first, not whoever does the best work." },
  { name: "Estate Agents", aliases: ["estate agent", "letting agent", "property agent"], line: "A missed call from a hot lead is a viewing booked with a rival agency instead." },
  { name: "Dentists", aliases: ["dentist", "dental practice", "dental clinic"], line: "A patient in pain rarely waits for a callback — they ring the next practice straight away." },
  { name: "Vets", aliases: ["vet", "veterinary", "vets"], line: "A missed call from a worried pet owner is an emergency going to the practice down the road." },
  { name: "Personal Trainers", aliases: ["personal trainer", "pt", "fitness coach"], line: "A missed enquiry call is a new client signing up with someone who actually picked up." },
  { name: "Cleaners", aliases: ["cleaner", "cleaning company", "cleaning service"], line: "A missed call is a booking gone to whichever cleaner answered first." },
  { name: "Removals", aliases: ["removal", "man and van", "movers", "moving company"], line: "Quote enquiries move fast — miss the call and the job's gone to a faster responder." },
  { name: "Photographers", aliases: ["photographer", "photography"], line: "A missed call about a wedding date is a booking made with someone else within the hour." },
  { name: "Florists", aliases: ["florist", "flower shop"], line: "Same-day orders don't wait for a voicemail callback — they go to the next florist on Google." },
  { name: "Tattoo Studios", aliases: ["tattoo", "tattoo artist", "tattoo studio"], line: "A missed consultation call is a booking made at the studio next door." },
  { name: "Gyms", aliases: ["gym", "fitness studio", "leisure centre"], line: "A missed membership enquiry rarely calls back — they just join wherever answered first." },
  { name: "Restaurants", aliases: ["restaurant", "takeaway", "eatery"], line: "A missed booking call on a Friday night is a table that sits empty." },
  { name: "Caterers", aliases: ["caterer", "catering"], line: "A missed catering enquiry is a full order going straight to a competitor." },
  { name: "Builders", aliases: ["builder", "building contractor", "construction"], line: "A missed call about a quote is a job going to whichever builder rang back first." },
  { name: "Painters & Decorators", aliases: ["painter", "decorator", "painting and decorating"], line: "A missed call is a job lost to the decorator who actually picked up." },
  { name: "Gardeners", aliases: ["gardener", "landscaper", "landscaping"], line: "Seasonal enquiries move fast — miss the call and the job's gone before you're free to ring back." },
  { name: "Pest Control", aliases: ["pest control", "exterminator"], line: "A call about pests rarely waits — it becomes an emergency call to whoever answers." },
  { name: "Driving Instructors", aliases: ["driving instructor", "driving school"], line: "A missed enquiry from a nervous new learner usually just goes to the next instructor on the list." },
  { name: "Accountants", aliases: ["accountant", "accountancy", "bookkeeper"], line: "A missed call from a new client enquiry is a relationship that starts with your competitor instead." },
  { name: "Solicitors", aliases: ["solicitor", "lawyer", "law firm"], line: "Someone in a legal bind rarely waits around for a callback." },
  { name: "Recruitment Agencies", aliases: ["recruiter", "recruitment agency", "staffing agency"], line: "A missed call from a candidate or client is a placement that starts somewhere else." },
  { name: "IT Support", aliases: ["it support", "it company", "tech support", "managed service provider"], line: "A business with a system down escalates fast — and they'll ring the next provider." },
  { name: "Window Cleaners", aliases: ["window cleaner", "window cleaning"], line: "A missed call is a round booking going to whoever picked up the phone." },
  { name: "Chimney Sweeps", aliases: ["chimney sweep"], line: "A missed call before winter is a booking that goes to the sweep who actually answered." },
  { name: "Physiotherapists", aliases: ["physiotherapist", "physio", "osteopath", "chiropractor"], line: "Someone in pain rarely waits — they book with the next clinic that answers." },
  { name: "Wedding Planners", aliases: ["wedding planner", "event planner", "event hire"], line: "A missed call about a wedding date is a booking made elsewhere within the hour." },
  { name: "Taxi Firms", aliases: ["taxi", "private hire", "minicab"], line: "A missed call is a fare gone to the firm that actually picked up." },
  { name: "Car Valeting", aliases: ["car valet", "car detailing", "mobile valeting"], line: "A missed call is a booking gone to the next valet down the road." },
];

function findBusinessMatch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  let best = null;
  let bestScore = -1;
  for (const b of BUSINESS_LIBRARY) {
    const name = b.name.toLowerCase();
    let score = -1;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 90;
    else if (b.aliases.some(a => a === q)) score = 85;
    else if (b.aliases.some(a => a.startsWith(q))) score = 70;
    else if (name.includes(q)) score = 60;
    else if (b.aliases.some(a => a.includes(q))) score = 50;
    else if (q.length > 3 && b.aliases.some(a => q.includes(a))) score = 40;
    if (score > bestScore) { bestScore = score; best = b; }
  }
  return bestScore >= 40 ? best : null;
}

function BusinessTypeFinder({ setPage }) {
  const [query, setQuery] = useState("");
  const match = findBusinessMatch(query);
  const hasTyped = query.trim().length > 0;

  return (
    <div style={{ maxWidth: 640, margin: "56px auto 0" }}>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 14, textAlign: "center" }}>
        Don't see your trade?
      </p>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }} aria-hidden="true">
          &#128269;
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type your business here — e.g. hairdresser, builder, vet..."
          style={{
            width: "100%", padding: "16px 20px 16px 50px", border: `1.5px solid ${T.line}`, borderRadius: 100,
            fontFamily: FONT_BODY, fontSize: 15, color: T.charcoal, outline: "none", boxSizing: "border-box", background: T.white,
          }}
        />
        {hasTyped && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear"
            style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.muted, fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            &times;
          </button>
        )}
      </div>

      {hasTyped && (
        <div style={{
          marginTop: 18, background: T.white, borderRadius: 18, border: `1px solid ${T.line}`,
          padding: "24px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        }}>
          {match ? (
            <>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.teal, marginBottom: 8 }}>
                For {match.name.toLowerCase()}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, lineHeight: 1.6, color: T.ink, marginBottom: 18 }}>
                {match.line}
              </p>
            </>
          ) : (
            <>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.teal, marginBottom: 8 }}>
                For {query.trim()}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, lineHeight: 1.6, color: T.ink, marginBottom: 18 }}>
                We haven't got a canned example for that one yet — but if a ringing phone ever costs you a customer, CalmCall's built for you too. Book a demo and we'll show you exactly how it'd fit.
              </p>
            </>
          )}
          <button onClick={() => setPage("contact")} style={{
            background: T.teal, color: T.white, border: "none", padding: "12px 26px", borderRadius: 100,
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            See how it'd work for you
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   HOME PAGE
   Edit these three constants to change prices and the voice sample.
   ============================================================ */
const HOME_PLANS = [
  { name: "Basic", price: "£49.99", per: "/month", from: true, line: "SMS capture for single business owners. Every missed caller gets an instant reply, and you get a callback reminder." },
  { name: "Pro", price: "£89.99", per: "/month", from: true, tag: "Most popular", line: "Your own branded call app, with diary, instant callback, red-amber-green triage and a dedicated account manager." },
  { name: "Enterprise", price: "Custom", per: "", from: false, line: "For teams: a director's dashboard, live location tracking for vans and team-wide callback tracking." },
];
const GARAGE_PHOTO_SRC = "/garage-mechanics.jpg";
const VOICE_CLONE_PRICE = "£19.99";
const VOICE_SAMPLE_SRC = null; // e.g. "/voice-sample.mp3" — the play button appears once this is set

const ECOSYSTEM = [
  ["Answers every call", "Picks up when you can't, has a proper conversation and takes the details. Not a voicemail."],
  ["Sounds like you", "Clone your own voice so regular customers hear a voice they know."],
  ["Transcripts and summaries", "Read any call in seconds: who, what, where and how urgent."],
  ["Red, amber, green triage", "Emergencies go to the top. Price checks wait until you're free."],
  ["Diary and bookings", "Jobs, callbacks and appointments land straight in your calendar."],
  ["Customer texts", "Confirmations, reminders and on-my-way messages go out automatically."],
  ["Customer tracking link", "Customers follow your arrival like a takeaway order, so they stop ringing to ask."],
  ["Team map and revenue", "See where every van is, and exactly what CalmCall won you this week."],
];

const COMPARE_ROWS = [
  ["Answers missed calls", true, true],
  ["Speaks in your own voice", false, true],
  ["Books jobs into your diary", false, true],
  ["Texts confirmations and reminders", false, true],
  ["Customer tracking link", false, true],
  ["Team map and revenue dashboard", false, true],
  ["Works on iPhone and Android", "Often one", true],
  ["Pricing", "Capped minutes", "Flat monthly"],
];

const FAQS = [
  ["Do I keep my own number?", "Yes. Your calls forward to CalmCall only when you want them to: when you miss one, when you're busy, or out of hours."],
  ["How long does setup take?", "Around ten minutes. We set it up with you on a short call, then you ring your own number to hear it answer."],
  ["Does it work on Android?", "Yes. CalmCall runs on iPhone, Android and desktop, with nothing to download from an app store."],
  ["Will callers know it's an assistant?", "Yes. Even in your cloned voice, it introduces itself as your assistant, so customers are never misled."],
  ["How does voice cloning work?", `You record a short script in the app and your voice is ready the same day. It's a one-time ${VOICE_CLONE_PRICE} setup, on any plan.`],
  ["Is it only for trades?", "No. It's built just as much for barbers, salons, beauticians, tattoo studios and anyone else who takes bookings by phone."],
];

const H2 = ({ children, light, center }) => (
  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 3.6vw, 42px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: -0.5, color: light ? T.white : T.charcoal, margin: "0 0 18px", textAlign: center ? "center" : "left", maxWidth: 720, marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }}>
    {children}
  </h2>
);
const Lede = ({ children, light, center }) => (
  <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.65, color: light ? "rgba(255,255,255,0.78)" : T.muted, maxWidth: 580, margin: center ? "0 auto" : 0, textAlign: center ? "center" : "left" }}>
    {children}
  </p>
);
const btnPrimary = { background: T.teal, color: T.white, border: "none", padding: "16px 30px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: "pointer" };
const btnGhost = { background: "none", color: T.charcoal, border: `1.5px solid ${T.line}`, padding: "16px 30px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: "pointer" };

function Mark({ value, strong }) {
  if (value === true) return <span aria-label="Yes" style={{ color: strong ? T.amber : T.teal, fontWeight: 700, fontSize: 17 }}>&#10003;</span>;
  if (value === false) return <span aria-label="No" style={{ color: strong ? "rgba(255,255,255,0.35)" : "#C9C5BA", fontSize: 17 }}>&ndash;</span>;
  return <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: strong ? T.white : T.muted }}>{value}</span>;
}

function Home({ setPage }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const toggleSample = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero-section" style={{ background: `linear-gradient(180deg, ${T.porcelain} 0%, ${T.porcelainDeep} 100%)`, padding: "72px 28px 64px" }}>
        <div className="hero-grid" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "center" }}>
          <EcosystemPhone />
          <div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(40px, 5.4vw, 66px)", lineHeight: 1.03, fontWeight: 600, color: T.charcoal, letterSpacing: -1.5, margin: "0 0 24px" }}>
              Your calls, bookings and customers, handled.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18.5, lineHeight: 1.6, color: T.ink, maxWidth: 520, margin: "0 0 34px" }}>
              CalmCall answers when you can't, in your own voice. It books the job, texts the customer, lets them track you to the door, and shows you what it all earned.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 30 }}>
              <button onClick={() => setPage("contact")} style={btnPrimary}>Book a demo</button>
              <button onClick={() => setPage("try")} style={btnGhost}>Try it yourself</button>
            </div>
            <div style={{ marginBottom: 30 }}><CallDemo /></div>
            <ul className="proof-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", maxWidth: 520 }}>
              {["Works on iPhone and Android", "Flat price, no minute caps", "Live in about ten minutes", "Keep your own number"].map(t => (
                <li key={t} style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: T.charcoal, display: "flex", gap: 10, alignItems: "center" }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: T.teal, color: T.white, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>&#10003;</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* VIDEO: missed call, missed job */}
      <section style={{ padding: "96px 28px", background: T.white }}>
        <div className="split-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: T.amberDeep, margin: "0 0 14px" }}>Every ring counts</p>
            <H2>Missed call. Missed job.</H2>
            <Lede>
              Most customers won't leave a voicemail. They ring the next number on Google. CalmCall picks up every call you can't, books the work in and texts you the details.
            </Lede>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
              <button onClick={() => setPage("contact")} style={btnPrimary}>Book a demo</button>
            </div>
          </div>
          <div style={{ maxWidth: 340, width: "100%", margin: "0 auto", aspectRatio: "9 / 16", borderRadius: 24, overflow: "hidden", background: T.charcoal, boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}>
            <video src="/calmcall-home.mp4" poster="/calmcall-home-poster.jpg" autoPlay muted loop playsInline controls preload="metadata"
              aria-label="A phone ringing unanswered on a van workbench: missed call, missed job"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* REAL-WORLD PHOTO: hands full, phone ringing */}
      <section style={{ padding: "96px 28px", background: T.teal, overflow: "hidden" }}>
        <div className="split-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: 64, alignItems: "center" }}>
          <div style={{ position: "relative", maxWidth: 440, width: "100%", margin: "0 auto" }}>
            <img src={GARAGE_PHOTO_SRC} alt="Two mechanics working under a car raised on a ramp in a garage" loading="lazy"
              style={{ display: "block", width: "100%", aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "50% 72%", borderRadius: 24, boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }} />
            <div className="photo-card photo-card-top" style={{ position: "absolute", top: 24, left: -28, background: T.white, borderRadius: 16, padding: "12px 16px", boxShadow: "0 14px 34px rgba(0,0,0,0.22)", maxWidth: 230 }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, color: "#E24B4A", margin: "0 0 3px" }}>Incoming call, 10:42</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal, margin: 0, lineHeight: 1.35 }}>Nobody's free to pick up.</p>
            </div>
            <div className="photo-card photo-card-bottom" style={{ position: "absolute", bottom: 28, right: -28, background: T.white, borderRadius: 16, padding: "14px 16px", boxShadow: "0 14px 34px rgba(0,0,0,0.22)", maxWidth: 260, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: "50%", background: T.teal, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>&#10003;</span>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, color: T.teal, margin: "0 0 3px" }}>Answered by CalmCall</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal, margin: 0, lineHeight: 1.35 }}>Brake pads booked, Thursday 9am. Customer texted.</p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: T.amber, margin: "0 0 14px" }}>A real Tuesday morning</p>
            <H2 light>Both hands full. Phone still ringing.</H2>
            <Lede light>
              Two of you under a car, exhaust halfway off. That call could be next week's best job, and by the time you've washed your hands they've rung someone else.
            </Lede>
            <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Answered in your voice while you keep working", "Job booked straight into the diary", "Customer gets a text, you get the details"].map(t => (
                <li key={t} style={{ fontFamily: FONT_BODY, fontSize: 16, color: T.white, display: "flex", gap: 12, alignItems: "center" }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: T.amber, color: T.charcoal, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>&#10003;</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TWO LANES */}
      <section style={{ padding: "96px 28px", background: T.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <H2>Built for people who can't stop to pick up.</H2>
          <div className="lanes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 44, borderTop: `2px solid ${T.charcoal}` }}>
            {[
              { title: "Trades", hook: "Never miss a job.", body: "Under a sink, up a ladder, flat on your back under a car. CalmCall takes the call, spots the emergency and books it in.", who: "Plumbers, electricians, mechanics, roofers, locksmiths, builders" },
              { title: "Appointments", hook: "Never miss a booking.", body: "Mid-fade, mid-tattoo, mid-treatment. CalmCall books the slot, sends the reminder and cuts no-shows.", who: "Barbers, salons, beauticians, tattoo studios, nail techs" },
            ].map((l, i) => (
              <div key={l.title} className="lane" style={{ padding: i === 0 ? "32px 40px 8px 0" : "32px 0 8px 40px", borderLeft: i === 1 ? `1px solid ${T.line}` : "none" }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: T.teal, margin: "0 0 10px" }}>{l.title}</p>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: T.charcoal, margin: "0 0 14px", lineHeight: 1.15 }}>{l.hook}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.65, color: T.ink, margin: "0 0 16px" }}>{l.body}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.6, color: T.muted, margin: 0 }}>{l.who}</p>
              </div>
            ))}
          </div>
          <BusinessTypeFinder setPage={setPage} />
        </div>
      </section>

      {/* COST OF MISSED CALLS */}
      <section style={{ padding: "96px 28px", background: T.porcelainDeep }}>
        <div className="split-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <H2>Voicemail doesn't win work.</H2>
            <Lede>Most people who reach voicemail don't leave a message. They ring the next name on Google. Work out what that's costing you each month.</Lede>
          </div>
          <MissedCallWidget />
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section style={{ padding: "96px 28px", background: T.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <H2>One app runs the lot.</H2>
          <Lede>Answering is where CalmCall starts, not where it stops. Everything below comes in one login and one monthly bill.</Lede>
          <dl className="eco-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 56, margin: "48px 0 0" }}>
            {ECOSYSTEM.map(([title, desc]) => (
              <div key={title} style={{ padding: "22px 0", borderTop: `2px solid ${T.tealBright}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: "50%", background: T.teal, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                <div>
                  <dt style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: T.teal, marginBottom: 6 }}>{title}</dt>
                  <dd style={{ fontFamily: FONT_BODY, fontSize: 15.5, lineHeight: 1.6, color: T.ink, margin: 0 }}>{desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* VOICE CLONING */}
      <section style={{ padding: "96px 28px", background: T.teal }}>
        <div className="split-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }}>
          <div>
            <H2 light>Your customers hear you, not a robot.</H2>
            <Lede light>
              Record a short script and CalmCall answers in your own voice. Regulars hear someone they recognise, and new callers get a local business, not a call centre. It still introduces itself as your assistant, so nobody's misled.
            </Lede>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: T.white, margin: "26px 0 0" }}>
              <strong style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: T.amber, marginRight: 10 }}>{VOICE_CLONE_PRICE}</strong>
              one-time setup, on any plan
            </p>
          </div>
          <div style={{ background: T.tealDeep, borderRadius: 24, padding: "36px 32px", textAlign: "center" }}>
            <Waveform color={T.amber} bars={36} height={70} />
            {VOICE_SAMPLE_SRC ? (
              <>
                <audio ref={audioRef} src={VOICE_SAMPLE_SRC} onEnded={() => setPlaying(false)} preload="none" />
                <button onClick={toggleSample} style={{ ...btnPrimary, background: T.amber, color: T.charcoal, marginTop: 26 }}>
                  {playing ? "Pause sample" : "Play a cloned voice"}
                </button>
              </>
            ) : (
              <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: "rgba(255,255,255,0.75)", margin: "22px 0 0" }}>
                Hear it on your demo: we'll clone your voice live.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CUSTOMER TRACKER (shared with the Try page) */}
      <div style={{ paddingTop: 72, background: T.porcelain }}>
        <CustomerTrackerDemo />
      </div>

      {/* COMPARISON */}
      <section style={{ padding: "96px 28px", background: T.white }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <H2>An answering bot takes a message. CalmCall runs the job.</H2>
          <div style={{ overflowX: "auto", marginTop: 40 }}>
            <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontFamily: FONT_BODY }}>
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: "left", padding: "14px 16px", fontSize: 14, color: T.muted, fontWeight: 600 }}><span className="sr-only">Feature</span></th>
                  <th scope="col" style={{ padding: "14px 16px", fontSize: 14, color: T.muted, fontWeight: 600, width: 150 }}>Typical answering bot</th>
                  <th scope="col" style={{ padding: "14px 16px", fontSize: 15, color: T.white, fontWeight: 700, width: 150, background: T.teal, borderRadius: "14px 14px 0 0" }}>CalmCall</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(([label, them, us], i) => (
                  <tr key={label}>
                    <th scope="row" style={{ textAlign: "left", padding: "15px 16px", fontSize: 15, fontWeight: 500, color: T.charcoal, borderTop: `1px solid ${T.line}` }}>{label}</th>
                    <td style={{ textAlign: "center", padding: "15px 16px", borderTop: `1px solid ${T.line}` }}><Mark value={them} /></td>
                    <td style={{ textAlign: "center", padding: "15px 16px", background: T.teal, borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: i === COMPARE_ROWS.length - 1 ? "0 0 14px 14px" : 0 }}><Mark value={us} strong /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section style={{ padding: "96px 28px", background: T.porcelainDeep }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <H2>Simple monthly prices. No meter running.</H2>
          <Lede>Other services count your minutes, so a chatty caller costs you money. CalmCall doesn't.</Lede>
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 44 }}>
            {HOME_PLANS.map((p, i) => (
              <div key={p.name} style={{ background: i === 1 ? T.teal : T.white, borderRadius: 20, padding: "28px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 12px" }}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600, color: i === 1 ? T.amber : T.teal, margin: 0 }}>{p.name}</p>
                  {p.tag && <span style={{ background: T.amber, color: T.charcoal, fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{p.tag}</span>}
                </div>
                {p.from && <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: i === 1 ? "rgba(255,255,255,0.6)" : T.muted, margin: "0 0 2px" }}>From</p>}
                <p style={{ margin: "0 0 14px" }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 600, color: i === 1 ? T.white : T.charcoal }}>{p.price}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: i === 1 ? "rgba(255,255,255,0.6)" : T.muted }}>{p.per}</span>
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, color: i === 1 ? "rgba(255,255,255,0.8)" : T.ink, margin: 0 }}>{p.line}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: T.ink, margin: "24px 0 0" }}>
            Add your own voice for a one-time {VOICE_CLONE_PRICE}.{" "}
            <button onClick={() => setPage("pricing")} style={{ background: "none", border: "none", padding: 0, color: T.teal, fontWeight: 600, fontSize: 15, cursor: "pointer", textDecoration: "underline" }}>Compare plans in full</button>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "96px 28px", background: T.white }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <H2>Questions people ask on demos</H2>
          <div style={{ marginTop: 32 }}>
            {FAQS.map(([q, a]) => (
              <details key={q} className="faq" style={{ borderTop: `1px solid ${T.line}`, padding: "4px 0" }}>
                <summary style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: T.charcoal, padding: "16px 0", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", gap: 16 }}>
                  {q}<span aria-hidden="true" className="faq-icon" style={{ color: T.teal, fontFamily: FONT_BODY }}>+</span>
                </summary>
                <p style={{ fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.65, color: T.muted, margin: "0 0 18px", maxWidth: 640 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 28px", background: T.teal, textAlign: "center" }}>
        <H2 light center>Hear it answer a call for your business.</H2>
        <div style={{ marginBottom: 36 }}>
          <Lede light center>A 15-minute demo with your trade, your prices and your voice. No pressure, no jargon.</Lede>
        </div>
        <button onClick={() => setPage("contact")} style={{ ...btnPrimary, background: T.white, color: T.teal, fontWeight: 700 }}>Book a demo</button>
      </section>
    </div>
  );
}

/* ============================================================
   TRY CALMCALL — fully interactive phone demo
   ============================================================ */
const DEMO_TABS = [
  { id: "home", label: "Home", icon: "\u{1F3E0}" },
  { id: "calls", label: "Calls", icon: "\u{1F4DE}" },
  { id: "calendar", label: "Diary", icon: "\u{1F4C5}" },
  { id: "map", label: "Live Map", icon: "\u{1F4CD}" },
  { id: "leads", label: "Leads", icon: "\u{1F3AF}" },
  { id: "team", label: "Team", icon: "\u{1F4CA}" },
];
const DEMO_TAB_TITLES = { home: "CalmCall", calls: "Calls", calendar: "Diary", map: "Live Map", leads: "Leads", team: "Team" };

const DEMO_CALL_EXAMPLE = { name: "John Walsh", initials: "JW", phone: "07700 900 214", note: "Hi it's John, my brakes are grinding on my BMW 1 Series and it needs looked at as soon as possible. Please call back at 13:15.", value: 280 };
const DEMO_CALL_STEP_LABELS = ["Incoming call", "Call missed — CalmCall answers instantly", "Capturing the job", "Booked & confirmed"];

const DEMO_URGENCY_COLOR = { red: "#E24B4A", amber: "#E8A33D", green: "#2A7C6F" };
const DEMO_URGENCY_LABEL = { red: "Urgent", amber: "Standard", green: "Low priority" };

const DEMO_CALLS = [
  { id: 1, name: "Priya Shah", initials: "PS", phone: "07700 900 332", time: "08:20", urgency: "red", note: "Boiler emergency — no heating, two kids in the house." },
  { id: 2, name: "John Walsh", initials: "JW", phone: "07700 900 214", time: "09:05", urgency: "red", note: "Brakes grinding on his BMW 1 Series — wants it looked at today." },
  { id: 3, name: "Sarah Nguyen", initials: "SN", phone: "07700 900 558", time: "11:42", urgency: "amber", note: "Wants a quote for a kitchen tap replacement, flexible on timing." },
  { id: 4, name: "Mike Ferreira", initials: "MF", phone: "07700 900 771", time: "13:10", urgency: "amber", note: "General enquiry about annual service pricing." },
  { id: 5, name: "Grace Okafor", initials: "GO", phone: "07700 900 108", time: "15:36", urgency: "green", note: "Just double-checking opening hours for Saturday." },
];

const DEMO_CAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_CAL_EVENTS = {
  Mon: [{ time: "09:00", title: "MOT — T. Green" }, { time: "13:15", title: "Callback — John, brakes", isNew: true }],
  Tue: [{ time: "10:30", title: "Callback — Priya, boiler", isNew: true }, { time: "14:00", title: "Install — R. Patel" }],
  Wed: [{ time: "11:00", title: "Quote visit — Sarah N." }],
  Thu: [],
  Fri: [{ time: "09:30", title: "Service — M. Ferreira" }, { time: "16:00", title: "Callback — Grace O." }],
  Sat: [{ time: "10:00", title: "Emergency call-out" }],
  Sun: [],
};

const DEMO_LOCATIONS = [
  { id: 1, name: "Dave", initials: "D", top: "26%", left: "60%", status: "En route", detail: "Heading to 42 Mill Lane — ETA 12 min.", color: "#E8A33D" },
  { id: 2, name: "Aisha", initials: "A", top: "56%", left: "28%", status: "On site", detail: "Kitchen refit — started 09:15, roughly 2 hours remaining.", color: "#2A7C6F" },
  { id: 3, name: "Tom", initials: "T", top: "70%", left: "72%", status: "Available", detail: "Free since 11:40 — nearest to the next job in the queue.", color: "#6B7280" },
];

const DEMO_LEAD_STAGES = [
  { id: "new", label: "New", color: "#E24B4A" },
  { id: "contacted", label: "Contacted", color: "#E8A33D" },
  { id: "booked", label: "Booked", color: "#2A7C6F" },
  { id: "won", label: "Won", color: "#1C4F47" },
];
const DEMO_LEADS_SEED = [
  { id: 1, name: "Priya Shah", value: 340, source: "Missed call", stage: "new" },
  { id: 2, name: "John Walsh", value: 280, source: "Missed call", stage: "new" },
  { id: 3, name: "Sarah Nguyen", value: 165, source: "SMS enquiry", stage: "contacted" },
  { id: 4, name: "Mike Ferreira", value: 120, source: "Missed call", stage: "contacted" },
  { id: 5, name: "R. Patel", value: 890, source: "Website", stage: "booked" },
  { id: 6, name: "T. Green", value: 75, source: "Repeat customer", stage: "won" },
];

const DEMO_STAFF = [
  { id: 1, name: "Dave Coleman", initials: "DC", status: "On the road", calls: 6, color: "#E8A33D" },
  { id: 2, name: "Aisha Bello", initials: "AB", status: "On site", calls: 4, color: "#2A7C6F" },
  { id: 3, name: "Tom Ricci", initials: "TR", status: "Available", calls: 9, color: "#1C4F47" },
  { id: 4, name: "You (Director)", initials: "YOU", status: "Reviewing", calls: 3, color: "#1A1F26" },
];

function InteractivePhone() {
  const [tab, setTab] = useState("home");
  const [detail, setDetail] = useState(null);
  const [calDay, setCalDay] = useState("Mon");
  const [leadsState, setLeadsState] = useState(DEMO_LEADS_SEED);
  const [callStep, setCallStep] = useState(0);

  const changeTab = (id) => { setTab(id); setDetail(null); };

  // Auto-advance the "example call" walkthrough while the Home tab is showing.
  useEffect(() => {
    if (tab !== "home") return;
    const t = setInterval(() => setCallStep(s => (s + 1) % 4), 2600);
    return () => clearInterval(t);
  }, [tab]);

  const rowButtonStyle = { width: "100%", textAlign: "left", background: T.white, border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "block" };
  const sectionLabel = { fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.muted, marginBottom: 10 };
  const detailEyebrow = { fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.amberDeep, marginBottom: 8 };
  const detailTitle = { fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: T.charcoal, marginBottom: 10 };
  const primaryBtn = { flex: 1, background: T.teal, color: T.white, border: "none", padding: "12px 0", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, cursor: "pointer" };
  const secondaryBtn = { flex: 1, background: T.porcelainDeep, color: T.charcoal, border: "none", padding: "12px 0", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, cursor: "pointer" };
  const statTile = { background: T.porcelainDeep, borderRadius: 12, padding: "14px 12px", textAlign: "center" };

  const HomeScreen = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
      <div style={{ background: T.teal, borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 4px", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Money made this month</p>
        <p style={{ margin: "0 0 6px", fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: T.white }}>&pound;4,280</p>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>From 14 calls that would otherwise have been missed</p>
      </div>

      <p style={sectionLabel}>See it happen</p>
      <button
        onClick={() => setCallStep(s => (s + 1) % 4)}
        style={{ width: "100%", textAlign: "left", background: T.white, border: `1px solid ${T.line}`, borderRadius: 16, padding: "18px 18px 16px", cursor: "pointer" }}
      >
        {callStep === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0 4px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.teal, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 20, color: T.white, fontWeight: 600 }}>
              {DEMO_CALL_EXAMPLE.initials}
            </div>
            <p style={{ margin: "0 0 3px", fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted }}>Incoming call&hellip;</p>
            <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: T.charcoal }}>{DEMO_CALL_EXAMPLE.phone}</p>
          </div>
        )}
        {callStep === 1 && (
          <>
            <div style={{ background: "#FBEDEA", borderRadius: 12, padding: "12px 14px", marginBottom: 4 }}>
              <p style={{ margin: "0 0 3px", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: "#B8483A", textTransform: "uppercase", letterSpacing: 0.5 }}>Missed call</p>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13.5, color: T.charcoal, fontWeight: 500 }}>{DEMO_CALL_EXAMPLE.name} &middot; {DEMO_CALL_EXAMPLE.phone}</p>
            </div>
            <p style={{ margin: "10px 0 0", fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>CalmCall answered instantly, so {DEMO_CALL_EXAMPLE.name.split(" ")[0]} never hit silence or a generic voicemail.</p>
          </>
        )}
        {callStep === 2 && (
          <>
            <p style={{ margin: "0 0 8px", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Capturing the enquiry</p>
            <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 14.5, fontStyle: "italic", color: T.charcoal, lineHeight: 1.5 }}>&ldquo;{DEMO_CALL_EXAMPLE.note}&rdquo;</p>
          </>
        )}
        {callStep === 3 && (
          <>
            <p style={{ margin: "0 0 8px", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: 0.5 }}>Booked &amp; confirmed</p>
            <div style={{ background: T.teal, borderRadius: "14px 14px 4px 14px", padding: "10px 14px", marginBottom: 8 }}>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12.5, color: T.white, lineHeight: 1.5 }}>Thanks for calling! We&rsquo;ve booked your callback for 13:15 today.</p>
            </div>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: T.muted }}>&pound;{DEMO_CALL_EXAMPLE.value} job value protected.</p>
          </>
        )}
      </button>
      <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 11.5, color: T.muted, margin: "10px 0 0" }}>{DEMO_CALL_STEP_LABELS[callStep]}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {DEMO_CALL_STEP_LABELS.map((_, i) => (
          <div key={i} style={{ width: i === callStep ? 16 : 6, height: 6, borderRadius: 4, background: i === callStep ? T.amber : T.line, transition: "all .3s" }} />
        ))}
      </div>
    </div>
  );

  const CallsScreen = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
      <p style={sectionLabel}>TODAY &mdash; {DEMO_CALLS.length} missed calls</p>
      {DEMO_CALLS.map(c => (
        <button key={c.id} onClick={() => setDetail({ type: "call", data: c })} style={rowButtonStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.porcelainDeep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: T.charcoal, position: "relative", flexShrink: 0 }}>
              {c.initials}
              <span style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: DEMO_URGENCY_COLOR[c.urgency], border: `2px solid ${T.white}` }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal }}>{c.name}</p>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.note}</p>
            </div>
            <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, flexShrink: 0 }}>{c.time}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const CalendarScreen = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", padding: "14px 12px 10px", gap: 6, flexShrink: 0 }}>
        {DEMO_CAL_DAYS.map(d => (
          <button key={d} onClick={() => setCalDay(d)} style={{
            flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: calDay === d ? T.teal : "transparent", color: calDay === d ? T.white : T.muted,
            fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
          }}>{d}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 18px 18px" }}>
        {DEMO_CAL_EVENTS[calDay].length === 0 ? (
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, textAlign: "center", marginTop: 40 }}>Nothing booked for {calDay}.</p>
        ) : DEMO_CAL_EVENTS[calDay].map((ev, i) => (
          <button key={i} onClick={() => setDetail({ type: "event", data: ev })} style={{ ...rowButtonStyle, background: ev.isNew ? T.teal : T.white, borderColor: ev.isNew ? T.teal : T.line }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 12, color: ev.isNew ? "rgba(255,255,255,0.75)" : T.muted }}>{ev.time}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: ev.isNew ? T.white : T.charcoal }}>{ev.title}</span>
              </div>
              {ev.isNew && <span style={{ background: T.amber, color: T.charcoal, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100 }}>NEW</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const MapScreen = () => (
    <div style={{ flex: 1, position: "relative", background: "#EDEAE1", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "22%", left: 0, right: 0, height: 3, background: "#DEDACD" }} />
      <div style={{ position: "absolute", top: "62%", left: 0, right: 0, height: 3, background: "#DEDACD" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "35%", width: 3, background: "#DEDACD" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "78%", width: 3, background: "#DEDACD" }} />
      {DEMO_LOCATIONS.map(v => (
        <button key={v.id} onClick={() => setDetail({ type: "van", data: v })} style={{
          position: "absolute", top: v.top, left: v.left, transform: "translate(-50%,-50%)",
          width: 34, height: 34, borderRadius: "50%", background: v.color, border: `3px solid ${T.white}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: T.white, cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.18)", padding: 0,
        }}>{v.initials}</button>
      ))}
      <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: "6px 12px" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, color: T.charcoal }}>Live &middot; 3 on the road</span>
      </div>
    </div>
  );

  const LeadsScreen = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
      {DEMO_LEAD_STAGES.map(stage => {
        const items = leadsState.filter(l => l.stage === stage.id);
        if (!items.length) return null;
        return (
          <div key={stage.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color, flexShrink: 0 }} />
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: T.muted }}>{stage.label} &middot; {items.length}</p>
            </div>
            {items.map(l => (
              <button key={l.id} onClick={() => setDetail({ type: "lead", data: l })} style={rowButtonStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal }}>{l.name}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.teal }}>&pound;{l.value}</span>
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: T.muted }}>{l.source}</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );

  const TeamScreen = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <div style={statTile}>
          <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: T.charcoal }}>19</p>
          <p style={{ margin: "2px 0 0", fontFamily: FONT_BODY, fontSize: 11, color: T.muted }}>Calls today</p>
        </div>
        <div style={statTile}>
          <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: T.charcoal }}>94%</p>
          <p style={{ margin: "2px 0 0", fontFamily: FONT_BODY, fontSize: 11, color: T.muted }}>Answered</p>
        </div>
      </div>
      <p style={sectionLabel}>TEAM</p>
      {DEMO_STAFF.map(s => (
        <button key={s.id} onClick={() => setDetail({ type: "staff", data: s })} style={rowButtonStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: T.white, flexShrink: 0 }}>{s.initials}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: T.charcoal }}>{s.name}</p>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: T.muted }}>{s.status}</p>
            </div>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.muted, flexShrink: 0 }}>{s.calls} calls</span>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ position: "relative", width: 280, height: 560, margin: "0 auto" }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 44, background: T.charcoal,
        border: "8px solid " + T.charcoal, boxShadow: "0 40px 80px rgba(28,79,71,0.25), 0 10px 30px rgba(0,0,0,0.15)",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: T.charcoal, borderRadius: "0 0 16px 16px", zIndex: 30 }} />
        <div style={{ background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px 0", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, color: T.charcoal, flexShrink: 0 }}>
            <span>9:41</span>
            <span style={{ fontSize: 10 }}>&#9679;&#9679;&#9679;</span>
          </div>
          <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img src="/logo.jpeg" alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: "cover" }} />
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: T.charcoal }}>{DEMO_TAB_TITLES[tab]}</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {tab === "home" && <HomeScreen />}
            {tab === "calls" && <CallsScreen />}
            {tab === "calendar" && <CalendarScreen />}
            {tab === "map" && <MapScreen />}
            {tab === "leads" && <LeadsScreen />}
            {tab === "team" && <TeamScreen />}
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${T.line}`, background: T.white, flexShrink: 0 }}>
            {DEMO_TABS.map(t => (
              <button key={t.id} onClick={() => changeTab(t.id)} style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
                <span style={{ fontSize: 16, opacity: tab === t.id ? 1 : 0.4 }}>{t.icon}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, fontWeight: 600, color: tab === t.id ? T.teal : T.muted }}>{t.label}</span>
              </button>
            ))}
          </div>

          <div
            onClick={() => setDetail(null)}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(26,31,38,0.35)",
              opacity: detail ? 1 : 0,
              pointerEvents: detail ? "auto" : "none",
              transition: "opacity .2s ease",
              zIndex: 20,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                background: T.white, borderRadius: "20px 20px 0 0",
                padding: "20px 20px 24px",
                transform: detail ? "translateY(0)" : "translateY(100%)",
                transition: "transform .25s ease",
                maxHeight: "78%", overflowY: "auto",
              }}
            >
              {detail?.type === "call" && (
                <>
                  <p style={detailEyebrow}>Missed call &middot; {DEMO_URGENCY_LABEL[detail.data.urgency]}</p>
                  <h4 style={detailTitle}>{detail.data.name}</h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, marginBottom: 14 }}>{detail.data.phone} &middot; {detail.data.time}</p>
                  <div style={{ background: T.porcelainDeep, borderRadius: 12, padding: "14px 16px", fontFamily: FONT_BODY, fontSize: 13.5, fontStyle: "italic", color: T.ink, lineHeight: 1.5, marginBottom: 18 }}>
                    &ldquo;{detail.data.note}&rdquo;
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={primaryBtn}>Call back</button>
                    <button style={secondaryBtn}>Add to diary</button>
                  </div>
                </>
              )}
              {detail?.type === "event" && (
                <>
                  <p style={detailEyebrow}>{calDay} &middot; {detail.data.time}</p>
                  <h4 style={detailTitle}>{detail.data.title}</h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, lineHeight: 1.6, marginBottom: 18 }}>Synced straight to the diary the moment it was booked &mdash; no manual entry needed.</p>
                  <button style={primaryBtn}>Open in diary</button>
                </>
              )}
              {detail?.type === "van" && (
                <>
                  <p style={detailEyebrow}>{detail.data.status}</p>
                  <h4 style={detailTitle}>{detail.data.name}</h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, lineHeight: 1.6, marginBottom: 18 }}>{detail.data.detail}</p>
                  <button style={primaryBtn}>Message {detail.data.name}</button>
                </>
              )}
              {detail?.type === "lead" && (() => {
                const stageIdx = DEMO_LEAD_STAGES.findIndex(s => s.id === detail.data.stage);
                const next = DEMO_LEAD_STAGES[stageIdx + 1];
                return (
                  <>
                    <p style={detailEyebrow}>{DEMO_LEAD_STAGES[stageIdx].label} &middot; &pound;{detail.data.value} est.</p>
                    <h4 style={detailTitle}>{detail.data.name}</h4>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, marginBottom: 18 }}>Sourced from: {detail.data.source}</p>
                    {next ? (
                      <button
                        style={primaryBtn}
                        onClick={() => {
                          const movedId = detail.data.id;
                          setLeadsState(ls => ls.map(l => l.id === movedId ? { ...l, stage: next.id } : l));
                          setDetail(d => ({ ...d, data: { ...d.data, stage: next.id } }));
                        }}
                      >
                        Move to {next.label}
                      </button>
                    ) : (
                      <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.teal, fontWeight: 600 }}>&#10003; Won &mdash; nice work.</p>
                    )}
                  </>
                );
              })()}
              {detail?.type === "staff" && (
                <>
                  <p style={detailEyebrow}>{detail.data.status}</p>
                  <h4 style={detailTitle}>{detail.data.name}</h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, lineHeight: 1.6, marginBottom: 18 }}>Handled {detail.data.calls} calls today &mdash; visible to directors in real time, across every staff member's phone.</p>
                  <button style={primaryBtn}>View full activity</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, marginTop: 16, fontWeight: 500, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
        Tap around &mdash; home, calls, diary, live map, leads and team are all live in this demo.
      </p>
    </div>
  );
}

const TRY_DEMO_FEATURES = [
  { title: "Missed call capture & triage", tier: "Basic, Pro & Enterprise", desc: "Every missed call captured and colour-coded red, amber or green — so you always know who to call back first." },
  { title: "Calendar & callbacks", tier: "Pro & Enterprise", desc: "Callbacks land straight in your diary the moment they're captured — no manual booking." },
  { title: "Live location tracking", tier: "Enterprise", desc: "See every van and every job on the map in real time, wherever your team is working." },
  { title: "Lead pipeline", tier: "Pro & Enterprise", desc: "Track every enquiry from first contact through to a won job, without it slipping through the cracks." },
  { title: "Team & director dashboard", tier: "Enterprise", desc: "Full visibility across every staff member's calls, callbacks and performance, in one place." },
];

/* ============================================================
   CUSTOMER TRACKER DEMO
   Embeds public/calmcall-live-tracker-v2.html — a self-contained
   page with its own fonts, CSS variables and vanilla JS. It stays a
   standalone file (and a standalone URL) so it can be edited on its
   own; the iframe keeps its global styles from colliding with ours.
   ============================================================ */
const TRACKER_SRC = "/calmcall-live-tracker-v2.html";

function CustomerTrackerDemo() {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let observer;

    // The tracker is served from our own /public, so it's same-origin and we
    // can measure it directly rather than having it post its height up.
    // Measure its content wrapper rather than <body>: the body is min-height
    // 100vh, which inside an iframe just echoes back whatever height we set.
    const measure = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || !doc.body) return;
        const stage = doc.querySelector(".stage-wrap");
        if (!stage) {
          setHeight(doc.body.scrollHeight);
          return;
        }
        const bodyStyle = doc.defaultView.getComputedStyle(doc.body);
        const pad = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
        setHeight(Math.ceil(stage.getBoundingClientRect().height + pad));
      } catch (e) {
        /* keep the last known height */
      }
    };

    const onLoad = () => {
      measure();
      try {
        const doc = frame.contentDocument;
        const stage = doc && doc.querySelector(".stage-wrap");
        if (stage && typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(measure);
          observer.observe(stage);
        }
      } catch (e) {
        /* no-op */
      }
    };

    frame.addEventListener("load", onLoad);
    window.addEventListener("resize", measure);
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") onLoad();

    return () => {
      frame.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measure);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section style={{ padding: "20px 28px 90px", background: T.porcelain }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 14 }}>
            And what your customer sees
          </p>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(26px, 3.2vw, 34px)", fontWeight: 600, color: T.charcoal, maxWidth: 620, margin: "0 auto 14px", lineHeight: 1.2 }}>
            The tracking link they get by text.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: T.muted, maxWidth: 560, margin: "0 auto" }}>
            Tap through the stages of a job to see the page your customer opens &mdash; booked, on the way, on site, complete.
          </p>
        </div>

        <div style={{ borderRadius: 22, overflow: "hidden", border: `1px solid ${T.line}`, background: T.white }}>
          <iframe
            ref={frameRef}
            {...(typeof window !== "undefined" && window.__CALMCALL_TRACKER_HTML__
              ? { srcDoc: window.__CALMCALL_TRACKER_HTML__ }
              : { src: TRACKER_SRC })}
            title="CalmCall customer job tracker demo"
            loading="lazy"
            scrolling="no"
            style={{ display: "block", width: "100%", height, border: "none" }}
          />
        </div>

        <p style={{ textAlign: "center", marginTop: 18 }}>
          <a
            href={TRACKER_SRC}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: T.teal }}
          >
            Open the customer view in a new tab &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}

function TryDemo({ setPage }) {
  return (
    <div>
      <section style={{ padding: "80px 28px 40px", background: T.porcelain, textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>Try It Yourself</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, maxWidth: 680, margin: "0 auto 18px", lineHeight: 1.15 }}>
          This is what your team would actually use.
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, color: T.muted, maxWidth: 560, margin: "0 auto" }}>
          A live, working example &mdash; not a screenshot. Tap through calls, the diary, live van tracking, leads and the team dashboard exactly as your business would see them.
        </p>
        <div style={{ marginTop: 28 }}><CallDemo center /></div>
      </section>

      <section style={{ padding: "20px 28px 60px", background: T.porcelain }}>
        <InteractivePhone />
      </section>

      <CustomerTrackerDemo />

      <section style={{ padding: "20px 28px 100px", background: T.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(26px, 3.2vw, 34px)", fontWeight: 600, color: T.charcoal, textAlign: "center", marginBottom: 48 }}>
            Everything in this demo, all in your app.
          </h2>
          <div className="trydemo-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TRY_DEMO_FEATURES.map(f => (
              <div key={f.title} style={{ background: T.porcelainDeep, borderRadius: 18, padding: "26px 24px" }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.amberDeep, marginBottom: 10 }}>{f.tier}</p>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: T.charcoal, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.6, color: T.muted }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 28px", background: T.teal, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: T.white, marginBottom: 20 }}>
            Like what you see?
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36 }}>
            This is a simplified example &mdash; your real app is branded to your business, with your own data from day one.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background: T.white, color: T.teal, border: "none", padding: "16px 32px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 700, cursor: "pointer" }}>
              Book a Demo
            </button>
            <button onClick={() => setPage("pricing")} style={{ background: "none", color: T.white, border: "1.5px solid rgba(255,255,255,0.4)", padding: "16px 32px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: "pointer" }}>
              See Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PRICING PAGE
   ============================================================ */
function Pricing({ setPage }) {
  const [mobileTier, setMobileTier] = useState("pro");
  const tierMeta = [
    {
      key: "basic", name: "Basic", tag: null, bestFor: "Single business owners", from: "From £49.99/mo",
      desc: "SMS-only capture. The simplest way to stop losing calls.",
      highlights: [
        "Never let a missed call go unanswered",
        "Customer gets an instant reply, automatically",
        "Live in minutes — no training needed",
      ],
      cta: "Start with Basic", highlight: false,
    },
    {
      key: "pro", name: "Pro", tag: "Most popular", bestFor: "Solo traders", from: "From £89.99/mo",
      desc: "The full branded app — your own personal call CRM.",
      highlights: [
        "Your own branded call app",
        "Colour-coded urgency, so you call the right people first",
        "A dedicated manager who knows your business",
      ],
      cta: "Start with Pro", highlight: true,
    },
    {
      key: "enterprise", name: "Enterprise", tag: null, bestFor: "Teams", from: null,
      desc: "Full visibility across every call, every job, every van.",
      highlights: [
        "See every call, every staff member, in real time",
        "Track vans and jobs with live location tracking",
        "Built to scale as your team grows",
      ],
      cta: "Talk to us", highlight: false,
    },
  ];

  // "full" = included, "partial" = limited/personal-only version, null = not included
  const groups = [
    {
      label: "Missed call capture",
      rows: [
        { label: "Instant SMS when a call is missed", basic: "full", pro: "full", enterprise: "full" },
        { label: "Customer confirmation SMS", basic: "full", pro: "full", enterprise: "full" },
        { label: "15-minute callback reminder", basic: "full", pro: "full", enterprise: "full" },
      ],
    },
    {
      label: "Personal call app",
      rows: [
        { label: "Premium branded app", basic: null, pro: "full", enterprise: "full" },
        { label: "Calendar & instant callback", basic: null, pro: "full", enterprise: "full" },
        { label: "Red / amber / green urgency triage", basic: null, pro: "full", enterprise: "full" },
        { label: "Dedicated accounts manager", basic: null, pro: "full", enterprise: "full" },
        { label: "Fully tweakable to your business", basic: null, pro: "full", enterprise: "full" },
      ],
    },
    {
      label: "Team & director visibility",
      rows: [
        { label: "App on every staff member's phone", basic: null, pro: "partial", enterprise: "full" },
        { label: "Director's dashboard — staff engagement & call tracking", basic: null, pro: null, enterprise: "full" },
        { label: "Live location tracker for driving jobs", basic: null, pro: null, enterprise: "full" },
        { label: "Team-wide callback tracking", basic: null, pro: null, enterprise: "full" },
        { label: "Lead capture per staff member", basic: null, pro: null, enterprise: "full" },
      ],
    },
  ];

  const Mark = ({ state, highlight }) => {
    if (state === "full") {
      return <span style={{ color: highlight ? T.amber : T.teal, fontWeight: 700, fontSize: 16 }}>✓</span>;
    }
    if (state === "partial") {
      return <span style={{ color: highlight ? "rgba(255,255,255,0.55)" : T.muted, fontWeight: 600, fontSize: 12, letterSpacing: 0.3 }}>Basic only</span>;
    }
    return <span style={{ color: highlight ? "rgba(255,255,255,0.25)" : "#D8D5CB", fontSize: 15 }}>—</span>;
  };

  return (
    <div>
      <section style={{ padding: "80px 28px 40px", textAlign: "center", background: T.porcelain }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>Pricing</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, marginBottom: 18 }}>
          Find the right level of control.
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, color: T.muted, maxWidth: 540, margin: "0 auto" }}>
          Three tiers, each one earning the next. Book a demo and we'll recommend the right fit for your business.
        </p>
      </section>

      {/* Tier header cards */}
      <section style={{ padding: "40px 28px 0", background: T.porcelain }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="pricing-grid">
          {tierMeta.map(t => (
            <div key={t.key} style={{
              background: t.highlight ? T.teal : T.white,
              borderRadius: 24, padding: "32px 28px",
              border: t.highlight ? "none" : `1px solid ${T.line}`,
              boxShadow: t.highlight ? "0 24px 60px rgba(28,79,71,0.28)" : "0 2px 10px rgba(0,0,0,0.02)",
              position: "relative",
            }}>
              {t.tag && (
                <div style={{ position: "absolute", top: -14, left: 28, background: T.amber, color: T.charcoal, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 100 }}>
                  {t.tag}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: t.highlight ? T.white : T.charcoal, margin: 0 }}>{t.name}</h3>
                {t.from && (
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: t.highlight ? T.white : T.muted, background: t.highlight ? "rgba(255,255,255,0.16)" : T.porcelainDeep, padding: "4px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>
                    {t.from}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: t.highlight ? T.amber : T.amberDeep, marginBottom: 12 }}>
                Best for {t.bestFor}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.highlight ? "rgba(255,255,255,0.8)" : T.muted, marginBottom: 20, minHeight: 40, lineHeight: 1.5 }}>{t.desc}</p>
              <div style={{ marginBottom: 24 }}>
                {t.highlights.map(h => (
                  <div key={h} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: t.highlight ? T.amber : T.teal, fontWeight: 700, fontSize: 13, marginTop: 2 }}>✓</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: t.highlight ? "rgba(255,255,255,0.88)" : T.ink, lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("contact")} style={{
                width: "100%", padding: "14px 0", borderRadius: 100, border: "none", cursor: "pointer",
                fontFamily: FONT_BODY, fontSize: 14.5, fontWeight: 600,
                background: t.highlight ? T.white : T.porcelainDeep,
                color: t.highlight ? T.teal : T.charcoal,
              }}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table (desktop) */}
      <section style={{ padding: "48px 28px 100px", background: T.porcelain }}>
        <div className="pricing-table-desktop" style={{ maxWidth: 1080, margin: "0 auto", overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", background: T.white, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.line}` }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "18px 24px", fontFamily: FONT_BODY, fontSize: 13, color: T.muted, fontWeight: 600, background: T.porcelainDeep }}></th>
                {tierMeta.map(t => (
                  <th key={t.key} style={{
                    textAlign: "center", padding: "18px 16px",
                    fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600,
                    color: t.highlight ? T.white : T.charcoal,
                    background: t.highlight ? T.teal : T.porcelainDeep,
                  }}>
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, gi) => (
                <React.Fragment key={g.label}>
                  <tr>
                    <td colSpan={4} style={{
                      padding: "16px 24px 8px",
                      fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                      color: T.amberDeep, background: T.white, borderTop: gi === 0 ? "none" : `1px solid ${T.line}`,
                    }}>
                      {g.label}
                    </td>
                  </tr>
                  {g.rows.map(r => (
                    <tr key={r.label}>
                      <td style={{ padding: "12px 24px", fontFamily: FONT_BODY, fontSize: 14.5, color: T.ink, borderTop: `1px solid ${T.line}` }}>
                        {r.label}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px 16px", borderTop: `1px solid ${T.line}` }}>
                        <Mark state={r.basic} highlight={false} />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px 16px", background: "rgba(28,79,71,0.04)", borderTop: `1px solid ${T.line}` }}>
                        <Mark state={r.pro} highlight={false} />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px 16px", borderTop: `1px solid ${T.line}` }}>
                        <Mark state={r.enterprise} highlight={false} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feature comparison table (mobile) — tier picker + single-column checklist, no horizontal scrolling */}
        <div className="pricing-table-mobile" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, background: T.porcelainDeep, borderRadius: 100, padding: 5 }}>
            {tierMeta.map(t => (
              <button
                key={t.key}
                onClick={() => setMobileTier(t.key)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 100, border: "none", cursor: "pointer",
                  fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600,
                  background: mobileTier === t.key ? T.teal : "transparent",
                  color: mobileTier === t.key ? T.white : T.muted,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div style={{ background: T.white, borderRadius: 20, border: `1px solid ${T.line}`, overflow: "hidden" }}>
            {groups.map((g, gi) => (
              <div key={g.label} style={{ borderTop: gi === 0 ? "none" : `1px solid ${T.line}` }}>
                <p style={{
                  margin: 0, padding: "16px 20px 8px",
                  fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                  color: T.amberDeep,
                }}>
                  {g.label}
                </p>
                {g.rows.map(r => (
                  <div key={r.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "12px 20px", borderTop: `1px solid ${T.line}`,
                  }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: T.ink, lineHeight: 1.4 }}>{r.label}</span>
                    <span style={{ flexShrink: 0 }}>
                      <Mark state={r[mobileTier]} highlight={false} />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.muted, textAlign: "center", maxWidth: 520, margin: "24px auto 0" }}>
          Not sure which tier fits? Book a 15-minute demo and we'll walk through the right setup for your team.
        </p>
      </section>
    </div>
  );
}

/* ============================================================
   ABOUT PAGE
   ============================================================ */
function About() {
  return (
    <div>
      <section style={{ padding: "80px 28px 60px", background: T.porcelain, textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>About CalmCall</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, maxWidth: 700, margin: "0 auto 20px", lineHeight: 1.15 }}>
          Built by people who understand a ringing phone is a business opportunity.
        </h1>
      </section>

      <section style={{ padding: "20px 28px 100px", background: T.porcelain }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.8, color: T.ink, marginBottom: 24 }}>
            CalmCall started with a simple observation: tradespeople lose real money every single day, not because they aren't good at their jobs, but because they're too busy doing them to answer the phone.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.8, color: T.ink, marginBottom: 24 }}>
            Voicemail doesn't fix that. Most callers hang up rather than leave a message, and by the time you're free to call back, they've already found someone else. We built CalmCall to close that gap — instantly, personally, and without adding another complicated system to your day.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.8, color: T.ink, marginBottom: 24 }}>
            The product is deliberately simple to start: when you miss a call, CalmCall greets the customer in your own voice, captures what they need, and tells you immediately — so you can call back informed, not guessing.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.8, color: T.ink }}>
            We're starting with mechanics, plumbers, electricians, locksmiths, jewellers, beauticians and the wide range of service businesses who feel this problem every week — and building toward becoming the calm, reliable operating system every small business runs on.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   BLOG PAGE
   ============================================================ */
function Blog() {
  const posts = [
    {
      title: "Why voicemail is costing you customers",
      excerpt: "Most callers won't leave a voicemail — they'll just call the next business on the list. Here's what the data says, and what to do about it.",
      date: "8 Jul 2026", tag: "Insights",
    },
    {
      title: "The five-minute rule: why speed to callback matters more than you think",
      excerpt: "Contacting a lead within five minutes makes them dramatically more likely to convert. Here's how to actually hit that window.",
      date: "2 Jul 2026", tag: "Sales",
    },
    {
      title: "Running a multi-van team? Here's what you're losing without call visibility",
      excerpt: "When you've got staff on the road, missed calls aren't just lost jobs — they're lost visibility. Here's how directors are solving it.",
      date: "28 Jun 2026", tag: "Enterprise",
    },
  ];
  return (
    <div>
      <section style={{ padding: "80px 28px 40px", background: T.porcelain, textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>The Blog</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, marginBottom: 16 }}>
          Ideas on calm, control, and customers.
        </h1>
      </section>
      <section style={{ padding: "40px 28px 100px", background: T.porcelain }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 20 }}>
          {posts.map(p => (
            <div key={p.title} style={{ background: T.white, borderRadius: 20, padding: "32px 36px", border: `1px solid ${T.line}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: T.teal, background: T.porcelainDeep, padding: "4px 12px", borderRadius: 100 }}>{p.tag}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted }}>{p.date}</span>
              </div>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: T.charcoal, marginBottom: 10 }}>{p.title}</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.65, color: T.muted }}>{p.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
const ContactField = ({ label, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{label}</label>
    {children}
  </div>
);

function Contact() {
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", trade: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/mbdnjann", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          business: form.business,
          email: form.email,
          phone: form.phone,
          trade: form.trade,
          message: form.message,
          _subject: `New CalmCall demo request \u2014 ${form.business || form.name}`,
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong sending your request \u2014 please try again or email us directly.");
      }
    } catch {
      setError("Something went wrong sending your request \u2014 please try again or email us directly.");
    }
    setSending(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", border: `1.5px solid ${T.line}`, borderRadius: 12,
    fontFamily: FONT_BODY, fontSize: 15, color: T.charcoal, outline: "none", boxSizing: "border-box", background: T.white,
  };

  return (
    <div>
      <section style={{ padding: "80px 28px 40px", background: T.porcelain, textAlign: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>Book a Demo</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, marginBottom: 16 }}>
          Let's show you CalmCall.
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, color: T.muted, maxWidth: 480, margin: "0 auto" }}>
          15 minutes, no pressure. We'll walk through exactly how it'd work for your business.
        </p>
        <div style={{ marginTop: 28 }}><CallDemo center /></div>
      </section>

      <section style={{ padding: "40px 28px 100px", background: T.porcelain }}>
        <div style={{ maxWidth: 560, margin: "0 auto", background: T.white, borderRadius: 24, padding: "44px 40px", border: `1px solid ${T.line}` }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.porcelainDeep, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, color: T.teal }}>✓</div>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: T.charcoal, marginBottom: 10 }}>Thanks, {form.name.split(" ")[0]}</h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: T.muted }}>We've got your details — someone from CalmCall will be in touch shortly to book your demo.</p>
            </div>
          ) : (
            <>
              <ContactField label="Full name">
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </ContactField>
              <ContactField label="Business name">
                <input style={inputStyle} value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="Your business" />
              </ContactField>
              <ContactField label="Email">
                <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@business.co.uk" />
              </ContactField>
              <ContactField label="Phone">
                <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07..." />
              </ContactField>
              <ContactField label="What trade / business are you?">
                <input style={inputStyle} value={form.trade} onChange={e => setForm(f => ({ ...f, trade: e.target.value }))} placeholder="e.g. Plumber, Mechanic, Salon..." />
              </ContactField>
              <ContactField label="Anything you'd like us to know?">
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Optional" />
              </ContactField>
              {error && <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: "#B8483A", marginBottom: 14 }}>{error}</p>}
              <button onClick={submit} disabled={sending} style={{ width: "100%", background: T.teal, color: T.white, border: "none", padding: "16px 0", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: sending ? "default" : "pointer", marginTop: 8, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Sending..." : "Book My Demo"}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
const PAGE_PATHS = { home: "/", try: "/try", pricing: "/pricing", about: "/about", blog: "/blog", contact: "/contact" };

function pathToPage(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const found = Object.entries(PAGE_PATHS).find(([, p]) => p === clean);
  return found ? found[0] : "home";
}

export default function App() {
  const [page, setPageState] = useState(() => pathToPage(window.location.pathname));

  // Keep the URL and browser history in sync with the current page, so the
  // back/forward buttons work between pages instead of just changing state.
  const setPage = (id) => {
    setPageState(id);
    const path = PAGE_PATHS[id] || "/";
    if (window.location.pathname !== path) {
      window.history.pushState({ page: id }, "", path);
    }
  };

  useEffect(() => {
    // Make sure the very first history entry carries page info too.
    window.history.replaceState({ page }, "", PAGE_PATHS[page] || "/");
    const onPopState = () => setPageState(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const renderPage = () => {
    switch (page) {
      case "try": return <TryDemo setPage={setPage} />;
      case "pricing": return <Pricing setPage={setPage} />;
      case "about": return <About />;
      case "blog": return <Blog />;
      case "contact": return <Contact />;
      default: return <Home setPage={setPage} />;
    }
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: T.porcelain, minHeight: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <AnnouncementBanner />
      <Nav page={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font-family: inherit; }
        .pricing-table-mobile { display: none; }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .trades-grid { grid-template-columns: 1fr 1fr !important; }
          .scenario-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .lanes-grid, .split-grid, .eco-grid, .plans-grid { grid-template-columns: 1fr !important; }
          .lane { padding: 28px 0 8px !important; border-left: none !important; }
          .lane + .lane { border-top: 1px solid #E4E1D8; }
          .hero-grid { gap: 36px !important; }
          .hero-section { padding-top: 28px !important; }
          .photo-card-top { left: -8px !important; top: 16px !important; }
          .photo-card-bottom { right: -8px !important; bottom: 16px !important; }
          .trydemo-features-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-burger { display: block !important; }
          .pricing-table-desktop { display: none !important; }
          .pricing-table-mobile { display: block !important; }
        }
        @media (max-width: 480px) {
          .proof-list { grid-template-columns: 1fr !important; }
        }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .faq summary::-webkit-details-marker { display: none; }
        .faq[open] .faq-icon { transform: rotate(45deg); }
        .faq-icon { transition: transform .2s; font-size: 22px; line-height: 1; }
        button:focus-visible, a:focus-visible, summary:focus-visible, input:focus-visible { outline: 3px solid #E8A33D; outline-offset: 3px; }
        @media (min-width: 861px) {
          .nav-mobile-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

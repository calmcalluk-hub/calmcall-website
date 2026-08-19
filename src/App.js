import React, { useState, useEffect } from "react";

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
              <button onClick={() => setPage("pricing")} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", padding: 0 }}>Pricing</button>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, color: "rgba(255,255,255,0.4)" }}>Basic</span>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, marginBottom: 10, color: "rgba(255,255,255,0.4)" }}>Elite</span>
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
   PHONE MOCKUP — signature hero element
   ============================================================ */
function PhoneMockup() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 3600);
    return () => clearInterval(t);
  }, []);

  const StatusBar = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 0", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, color: T.charcoal }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ fontSize: 10 }}>&#9679;&#9679;&#9679;</span>
      </div>
    </div>
  );

  const AppHeader = ({ title }) => (
    <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/logo.jpeg" alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: "cover" }} />
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: T.charcoal }}>{title}</span>
    </div>
  );

  const screens = [
    // 0 — Incoming call
    <div key="0" style={{ background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: T.teal, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 30, color: T.white, fontWeight: 600 }}>JW</div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, marginBottom: 6 }}>Incoming call</p>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: T.charcoal, marginBottom: 60 }}>07700 900 214</p>
        <div style={{ display: "flex", gap: 48, marginTop: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E24B4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: T.white }}>&#128222;</div>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: T.white }}>&#128222;</div>
        </div>
      </div>
    </div>,
    // 1 — Missed call, capture in progress
    <div key="1" style={{ background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <AppHeader title="CalmCall" />
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{ background: "#FBEDEA", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 700, color: "#B8483A", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Missed call</p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: T.charcoal, margin: 0, fontWeight: 500 }}>07700 900 214</p>
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.muted, marginBottom: 8, fontWeight: 600 }}>CAPTURING ENQUIRY</p>
        <div style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 14, padding: "16px 18px" }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontStyle: "italic", color: T.charcoal, lineHeight: 1.5, margin: 0 }}>
            "Hi it's John, my brakes are grinding in my BMW 1 Series and it needs looked at as soon as possible. Please call back at 13:15."
          </p>
        </div>
      </div>
    </div>,
    // 2 — Diary booking
    <div key="2" style={{ background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <AppHeader title="Diary" />
      <div style={{ flex: 1, padding: "20px" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.muted, marginBottom: 10, fontWeight: 600 }}>TODAY</p>
        <div style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted }}>11:00</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.charcoal, fontWeight: 500 }}>Service &ndash; R. Patel</span>
        </div>
        <div style={{ background: T.teal, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.75)", display: "block" }}>13:15</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: T.white, fontWeight: 600 }}>Callback &ndash; John, brakes</span>
          </div>
          <span style={{ background: T.amber, color: T.charcoal, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100 }}>NEW</span>
        </div>
        <div style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted }}>15:30</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.charcoal, fontWeight: 500 }}>MOT &ndash; T. Green</span>
        </div>
      </div>
    </div>,
    // 3 — SMS confirmation
    <div key="3" style={{ background: T.porcelain, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <AppHeader title="Messages" />
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: T.teal, borderRadius: "16px 16px 4px 16px", padding: "12px 16px", marginBottom: 10 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.white, margin: 0, lineHeight: 1.5 }}>
            Thanks for calling! We've booked your callback for 13:15 today. Talk soon &ndash; the team.
          </p>
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.muted, alignSelf: "flex-end", marginBottom: 4 }}>Delivered</p>
      </div>
    </div>,
  ];

  const labels = ["Incoming call", "Capturing the job", "Booked in the diary", "Customer confirmed"];

  return (
    <div style={{ position: "relative", width: 280, height: 560, margin: "0 auto" }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 44, background: T.charcoal,
        border: "8px solid " + T.charcoal, boxShadow: "0 40px 80px rgba(28,79,71,0.25), 0 10px 30px rgba(0,0,0,0.15)",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: T.charcoal, borderRadius: "0 0 16px 16px", zIndex: 10 }} />
        {screens[step]}
      </div>
      <p style={{ textAlign: "center", fontFamily: FONT_BODY, fontSize: 12.5, color: T.muted, marginTop: 16, fontWeight: 500 }}>{labels[step]}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 4, background: i === step ? T.amber : T.line, transition: "all .3s" }} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
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

function Home({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(180deg, ${T.porcelain} 0%, ${T.porcelainDeep} 100%)`, padding: "72px 28px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ marginBottom: 24 }}><MissedCallWidget /></div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.06, fontWeight: 600, color: T.charcoal, letterSpacing: -1, marginBottom: 24 }}>
              Never let a missed call<br />become a missed job.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, lineHeight: 1.6, color: T.muted, maxWidth: 480, marginBottom: 36 }}>
              Every missed call is a lead sitting in someone else's inbox by lunchtime. CalmCall captures the job, books the callback, and puts your day back in order — automatically.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => setPage("contact")} style={{ background: T.teal, color: T.white, border: "none", padding: "16px 32px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: "pointer" }}>
                Book a Demo
              </button>
              <button onClick={() => setPage("pricing")} style={{ background: "none", color: T.charcoal, border: `1.5px solid ${T.line}`, padding: "16px 32px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 600, cursor: "pointer" }}>
                See Pricing
              </button>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: T.teal, padding: "36px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            ["27%", "of calls to SMEs go unanswered"],
            ["62%", "of callers never leave a voicemail"],
            ["100×", "more likely to convert if contacted within 5 minutes"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 600, color: T.white, marginBottom: 6 }}>{num}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.75)", maxWidth: 220, margin: "0 auto" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "96px 28px 60px", background: T.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 18 }}>The Problem</p>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: T.charcoal, lineHeight: 1.2, marginBottom: 24 }}>
            You can't answer the phone under a sink.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.7, color: T.muted }}>
            You're driving, mid-job, up a ladder, or already on another call. Every ring you miss is a customer who moves straight to the next name on the list — and voicemail doesn't stop them. CalmCall does.
          </p>
        </div>
      </section>

      {/* REAL SCENARIOS */}
      <section style={{ padding: "20px 28px 100px", background: T.white }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }} className="scenario-grid">
          {[
            { img: "/scenario-plumber.jpg", title: "Hands full under the sink", desc: "Plumber elbow-deep in a leak. Phone rings twice, potential job lost." },
            { img: "/scenario-mechanic.jpg", title: "Flat on his back under a car", desc: "Mechanic mid-repair, can't reach the phone. Caller hangs up, calls the next shop." },
          ].map(s => (
            <div key={s.title} style={{ background: T.porcelainDeep, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.line}` }}>
              <div style={{ position: "relative" }}>
                <img src={s.img} alt={s.title} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: 16, right: 16, background: "#B8483A", color: T.white, fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 700, padding: "7px 16px", borderRadius: 100 }}>
                  Missed Call
                </span>
              </div>
              <div style={{ padding: "24px 26px" }}>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: T.charcoal, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.6, color: T.muted }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "0 28px 100px", background: T.white }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 12, textAlign: "center" }}>How It Works</p>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 600, color: T.charcoal, textAlign: "center", marginBottom: 64 }}>
            Your own voice. Instant response.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }} className="steps-grid">
            {[
              ["Call is missed", "CalmCall plays your own recorded greeting — not a robot, not generic hold music."],
              ["Caller responds", "They leave their name, what they need, and a preferred callback time."],
              ["You're notified", "An instant SMS tells you exactly who called and why — nothing lost."],
              ["You call back informed", "A 15-minute reminder keeps you on track, so nothing slips through."],
            ].map(([title, desc], i) => (
              <div key={title}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.porcelainDeep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: T.teal, marginBottom: 18 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: T.charcoal, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.6, color: T.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ padding: "96px 28px", background: T.porcelainDeep }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 12 }}>Built For</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 600, color: T.charcoal }}>
              Any business where a missed call costs real money.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="trades-grid">
            {["Mechanics", "Plumbers", "Electricians", "Locksmiths", "Jewellers", "Beauticians", "Roofers", "Estate Agents"].map(t => (
              <div key={t} style={{ background: T.white, borderRadius: 14, padding: "24px 20px", border: `1px solid ${T.line}`, textAlign: "center" }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600, color: T.charcoal }}>{t}</p>
              </div>
            ))}
          </div>
          <BusinessTypeFinder setPage={setPage} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 28px", background: T.teal, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: T.white, marginBottom: 20 }}>
            See it answer your first missed call.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36 }}>
            Book a 15-minute demo. No pressure, no jargon — just a straight look at how CalmCall would work for your business.
          </p>
          <button onClick={() => setPage("contact")} style={{ background: T.white, color: T.teal, border: "none", padding: "16px 36px", borderRadius: 100, fontFamily: FONT_BODY, fontSize: 15.5, fontWeight: 700, cursor: "pointer" }}>
            Book a Demo
          </button>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PRICING PAGE
   ============================================================ */
function Pricing({ setPage }) {
  const [mobileTier, setMobileTier] = useState("elite");
  const tierMeta = [
    {
      key: "basic", name: "Basic", tag: null, bestFor: "Single business owners", from: "From £89/mo",
      desc: "SMS-only capture. The simplest way to stop losing calls.",
      highlights: [
        "Never let a missed call go unanswered",
        "Customer gets an instant reply, automatically",
        "Live in minutes — no training needed",
      ],
      cta: "Start with Basic", highlight: false,
    },
    {
      key: "elite", name: "Elite", tag: "Most popular", bestFor: "Solo traders", from: null,
      desc: "The full branded app — your own personal call CRM.",
      highlights: [
        "Your own branded call app",
        "Colour-coded urgency, so you call the right people first",
        "A dedicated manager who knows your business",
      ],
      cta: "Start with Elite", highlight: true,
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
        { label: "Instant SMS when a call is missed", basic: "full", elite: "full", enterprise: "full" },
        { label: "Customer confirmation SMS", basic: "full", elite: "full", enterprise: "full" },
        { label: "15-minute callback reminder", basic: "full", elite: "full", enterprise: "full" },
      ],
    },
    {
      label: "Personal call app",
      rows: [
        { label: "Premium branded app", basic: null, elite: "full", enterprise: "full" },
        { label: "Calendar & instant callback", basic: null, elite: "full", enterprise: "full" },
        { label: "Red / amber / green urgency triage", basic: null, elite: "full", enterprise: "full" },
        { label: "Dedicated accounts manager", basic: null, elite: "full", enterprise: "full" },
        { label: "Fully tweakable to your business", basic: null, elite: "full", enterprise: "full" },
      ],
    },
    {
      label: "Team & director visibility",
      rows: [
        { label: "App on every staff member's phone", basic: null, elite: "partial", enterprise: "full" },
        { label: "Director's dashboard — staff engagement & call tracking", basic: null, elite: null, enterprise: "full" },
        { label: "Live location tracker for driving jobs", basic: null, elite: null, enterprise: "full" },
        { label: "Team-wide callback tracking", basic: null, elite: null, enterprise: "full" },
        { label: "Lead capture per staff member", basic: null, elite: null, enterprise: "full" },
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
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: T.muted, background: T.porcelainDeep, padding: "4px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>
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
                        <Mark state={r.elite} highlight={false} />
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
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const renderPage = () => {
    switch (page) {
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
          .hero-grid > div:last-child { order: -1; margin-bottom: 20px; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .trades-grid { grid-template-columns: 1fr 1fr !important; }
          .scenario-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-burger { display: block !important; }
          .pricing-table-desktop { display: none !important; }
          .pricing-table-mobile { display: block !important; }
        }
        @media (min-width: 861px) {
          .nav-mobile-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";

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
    const t = setInterval(() => setStep(s => (s + 1) % 4), 3800);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: "Incoming call", sub: "Riverside Auto Repairs" },
    { label: "Call missed", sub: "Personalised greeting and lead capture plays" },
    { label: "Caller responds", sub: "\u201cHi it's John, my brakes are grinding in my BMW 1 Series and it needs looked at as soon as possible. Please call back at 13:15.\u201d" },
    { label: "You're notified", sub: "SMS sent to John \u2014 callback booked for 13:15 slot or as soon as possible, input into diary" },
  ];

  return (
    <div style={{ position: "relative", width: 280, height: 560, margin: "0 auto" }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 44, background: T.charcoal,
        border: "8px solid " + T.charcoal, boxShadow: "0 40px 80px rgba(28,79,71,0.25), 0 10px 30px rgba(0,0,0,0.15)",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: T.charcoal, borderRadius: "0 0 16px 16px", zIndex: 10 }} />
        <div style={{ background: T.porcelain, width: "100%", height: "100%", paddingTop: 50, display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.teal, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 24, color: T.white, fontWeight: 600 }}>
              JW
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, marginBottom: 4 }}>{steps[step].label}</p>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: T.charcoal, fontWeight: 600, padding: "0 24px" }}>{steps[step].sub}</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 40, gap: 8 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 4, background: i === step ? T.amber : T.line, transition: "all .3s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function Home({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(180deg, ${T.porcelain} 0%, ${T.porcelainDeep} 100%)`, padding: "72px 28px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }} className="hero-grid">
          <div>
            <img src="/logo.jpeg" alt="CalmCall" style={{ width: 140, height: 140, borderRadius: 24, objectFit: "cover", marginBottom: 28, boxShadow: "0 12px 32px rgba(28,79,71,0.18)" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.white, border: `1px solid ${T.line}`, borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.amber }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.muted, fontWeight: 500 }}>Now onboarding UK trades &amp; service businesses</span>
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.06, fontWeight: 600, color: T.charcoal, letterSpacing: -1, marginBottom: 24 }}>
              Never let a missed call<br />become a missed job.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, lineHeight: 1.6, color: T.muted, maxWidth: 480, marginBottom: 36 }}>
              Voicemail waits. CalmCall responds instantly — capturing the enquiry, reassuring the customer, and telling you exactly who called and why, the moment you're free.
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
  const tiers = [
    {
      name: "Basic", price: "£89", was: "£99", per: "/month", tag: null,
      desc: "SMS-only capture. The simplest way to stop losing calls.",
      features: ["Instant SMS when a call is missed", "Customer confirmation SMS", "15-minute callback reminder", "Single business owner"],
      cta: "Start with Basic", highlight: false,
    },
    {
      name: "Elite", price: "£129", was: "£149", per: "/month", tag: "Most popular",
      desc: "The full branded app — your own personal call CRM.",
      features: ["Everything in Basic", "Premium branded app", "Calendar & instant callback", "Red / amber / green urgency triage", "Dedicated accounts manager", "Fully tweakable to your business"],
      cta: "Start with Elite", highlight: true,
    },
    {
      name: "Enterprise", price: "Custom", was: null, per: "", tag: null,
      desc: "Built for teams of 6+ — full visibility across every call.",
      features: ["Basic on every staff phone", "Elite dashboard for the director", "Team-wide callback tracking", "Lead capture per staff member", "Priced per pod"],
      cta: "Talk to us", highlight: false,
    },
  ];

  return (
    <div>
      <section style={{ padding: "80px 28px 40px", textAlign: "center", background: T.porcelain }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.amberDeep, marginBottom: 16 }}>Pricing</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, color: T.charcoal, marginBottom: 18 }}>
          Simple pricing. Real value.
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, color: T.muted, maxWidth: 520, margin: "0 auto" }}>
          Three tiers, each one earning the next. No hidden fees, no long contracts.
        </p>
      </section>

      <section style={{ padding: "40px 28px 100px", background: T.porcelain }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="pricing-grid">
          {tiers.map(t => (
            <div key={t.name} style={{
              background: t.highlight ? T.teal : T.white,
              borderRadius: 24, padding: "40px 32px",
              border: t.highlight ? "none" : `1px solid ${T.line}`,
              boxShadow: t.highlight ? "0 24px 60px rgba(28,79,71,0.28)" : "0 2px 10px rgba(0,0,0,0.02)",
              position: "relative",
            }}>
              {t.tag && (
                <div style={{ position: "absolute", top: -14, left: 32, background: T.amber, color: T.charcoal, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 100 }}>
                  {t.tag}
                </div>
              )}
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: t.highlight ? T.white : T.charcoal, marginBottom: 8 }}>{t.name}</h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.highlight ? "rgba(255,255,255,0.75)" : T.muted, marginBottom: 24, minHeight: 40, lineHeight: 1.5 }}>{t.desc}</p>
              <div style={{ marginBottom: 28 }}>
                {t.was && (
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: t.highlight ? "rgba(255,255,255,0.5)" : T.muted, textDecoration: "line-through", marginRight: 10 }}>{t.was}</span>
                )}
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 600, color: t.highlight ? T.white : T.charcoal }}>{t.price}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.highlight ? "rgba(255,255,255,0.6)" : T.muted }}>{t.per}</span>
              </div>
              <button onClick={() => setPage("contact")} style={{
                width: "100%", padding: "14px 0", borderRadius: 100, border: "none", cursor: "pointer",
                fontFamily: FONT_BODY, fontSize: 14.5, fontWeight: 600, marginBottom: 32,
                background: t.highlight ? T.white : T.porcelainDeep,
                color: t.highlight ? T.teal : T.charcoal,
              }}>
                {t.cta}
              </button>
              <div>
                {t.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, marginBottom: 13, alignItems: "flex-start" }}>
                    <span style={{ color: t.highlight ? T.amber : T.teal, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.highlight ? "rgba(255,255,255,0.88)" : T.ink, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
      const res = await fetch("https://formspree.io/f/mvgqjqyk", {
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

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
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
              <Field label="Full name">
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </Field>
              <Field label="Business name">
                <input style={inputStyle} value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="Your business" />
              </Field>
              <Field label="Email">
                <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@business.co.uk" />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07..." />
              </Field>
              <Field label="What trade / business are you?">
                <input style={inputStyle} value={form.trade} onChange={e => setForm(f => ({ ...f, trade: e.target.value }))} placeholder="e.g. Plumber, Mechanic, Salon..." />
              </Field>
              <Field label="Anything you'd like us to know?">
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Optional" />
              </Field>
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

  const pages = {
    home: <Home setPage={setPage} />,
    pricing: <Pricing setPage={setPage} />,
    about: <About />,
    blog: <Blog />,
    contact: <Contact />,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: T.porcelain, minHeight: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Footer setPage={setPage} />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font-family: inherit; }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { order: -1; margin-bottom: 20px; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .trades-grid { grid-template-columns: 1fr 1fr !important; }
          .scenario-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-burger { display: block !important; }
        }
        @media (min-width: 861px) {
          .nav-mobile-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

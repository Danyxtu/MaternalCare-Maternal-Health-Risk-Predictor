import { useState, useEffect, useRef } from "react";

import screen1 from "./assets/screen1.png";
import screen2 from "./assets/screen2.png";
import screen3 from "./assets/screen3.png";
import screen4 from "./assets/screen4.png";

const SLIDES = [
  { img: screen1, label: "Dashboard",       desc: "Overview of maternal health monitoring" },
  { img: screen2, label: "Patient Records", desc: "View and manage all patient assessments" },
  { img: screen3, label: "New Assessment",  desc: "Physiological input module" },
  { img: screen4, label: "Risk Analysis",   desc: "Detailed risk factor breakdown" },
];

const WORDS = ["mothers.", "families.", "futures.", "lives."];

function useTyping() {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[wi];
    let timeout;
    if (!deleting) {
      if (text.length < word.length) timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 95);
      else timeout = setTimeout(() => setDeleting(true), 1600);
    } else {
      if (text.length > 0) timeout = setTimeout(() => setText(text.slice(0, -1)), 55);
      else { setDeleting(false); setWi((wi + 1) % WORDS.length); }
    }
    return () => clearTimeout(timeout);
  }, [text, wi, deleting]);
  return text;
}

function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 3000);
  };
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);
  const goTo = (i) => { setCurrent(i); startTimer(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Phone frame */}
      <div style={{ width: 240, height: 460, borderRadius: 36, background: "#0f172a", padding: 8, boxShadow: "0 40px 80px -20px rgba(15,23,42,0.3)", position: "relative" }}>
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 68, height: 18, background: "#0f172a", borderRadius: "0 0 12px 12px", zIndex: 10 }} />
        <div style={{ borderRadius: 28, overflow: "hidden", height: "100%", position: "relative", background: "#f8fafc" }}>
          {SLIDES.map((slide, i) => (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: i === current ? 1 : 0, transform: i === current ? "scale(1)" : "scale(0.96)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
              <img src={slide.img} alt={slide.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 16, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#f43f5e"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
        >‹</button>
        <div style={{ display: "flex", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99, background: i === current ? "#f43f5e" : "#e2e8f0", border: "none", cursor: "pointer", padding: 0, transition: "width 0.35s, background 0.35s" }} />
          ))}
        </div>
        <button onClick={() => goTo((current + 1) % SLIDES.length)}
          style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 16, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#f43f5e"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
        >›</button>
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
        {current + 1} / {SLIDES.length} — <span style={{ color: "#475569", fontWeight: 600 }}>{SLIDES[current].label}</span>
      </p>
    </div>
  );
}

export default function Home() {
  const typed = useTyping();
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", paddingTop: 56, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#fb7185", filter: "blur(100px)", opacity: 0.09, top: -100, left: -150, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#fda4af", filter: "blur(90px)", opacity: 0.07, bottom: 0, right: -80, pointerEvents: "none" }} />

      <div className="hero-grid" style={{ width: "100%", padding: "60px 48px 60px 120px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", boxSizing: "border-box" }}>
        {/* Left */}
        <div className="hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 68px)", lineHeight: 1.06, color: "#0f172a", margin: "0 0 20px", letterSpacing: -1 }}>
            Predicting risk.<br />
            <em style={{ color: "#f43f5e" }}>Protecting</em><br />
            <span>
              {typed}
              <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "#f43f5e", marginLeft: 3, verticalAlign: "middle", animation: "blink 0.6s step-end infinite" }} />
            </span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
            MaternalCare monitors vital signs, evaluates physiological data, and flags high-risk patients in real time — so care teams can act before complications arise.
          </p>
          <a href="#contact"
            style={{ background: "#f43f5e", color: "white", padding: "14px 28px", borderRadius: 99, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(244,63,94,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(244,63,94,0.38)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,63,94,0.3)"; }}
          >Get the App Here</a>
        </div>

        {/* Right */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Carousel />
        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @media (max-width: 1024px) {
          .hero-grid { padding: 60px 32px !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 48px 24px !important; }
          .hero-text { align-items: center !important; text-align: center; }
        }
        @media (max-width: 480px) {
          .hero-grid { padding: 40px 16px !important; }
        }
      `}</style>
    </section>
  );
}
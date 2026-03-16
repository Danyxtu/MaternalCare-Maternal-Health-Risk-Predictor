const STATS = [
  { value: "98%",  label: "Assessment accuracy" },
  { value: "12k+", label: "Patients assessed" },
  { value: "40+",  label: "Partner clinics" },
];

export default function About() {
  return (
    <section id="about" style={{ padding: "96px 0", background: "white" }}>
      <div style={{ width: "100%", padding: "0 48px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }} className="about-pad">

        <div style={{ display: "inline-flex", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 99, padding: "10px 24px", fontSize: 18, fontWeight: 800, color: "#f43f5e", marginBottom: 20 }}>About</div>

        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 4.5vw, 58px)", color: "#0f172a", lineHeight: 1.15, margin: "0 0 22px", fontWeight: 800 }}>
          Built for clinicians.<br /><em style={{ color: "#f43f5e" }}>Designed</em> for mothers.
        </h2>

        <p style={{ color: "#475569", fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.8, marginBottom: 14, maxWidth: 640, fontWeight: 500 }}>
          MaternalCare is a clinical decision support tool developed to reduce maternal mortality by giving healthcare providers early, actionable intelligence about patient risk.
        </p>
        <p style={{ color: "#475569", fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.8, marginBottom: 52, maxWidth: 640, fontWeight: 500 }}>
          Our prediction engine was trained on thousands of de-identified records and validated across multiple hospital settings.
        </p>

        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 48, paddingTop: 44, borderTop: "2px solid #f1f5f9", width: "100%", maxWidth: 540 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "#0f172a", fontFamily: "Georgia, serif", margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 15, color: "#475569", marginTop: 8, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) { .about-pad { padding: 0 32px !important; } }
        @media (max-width: 768px)  { .about-pad { padding: 0 24px !important; } }
        @media (max-width: 520px)  { .about-pad { padding: 0 16px !important; } .stats-grid { gap: 24px !important; } }
      `}</style>
    </section>
  );
}
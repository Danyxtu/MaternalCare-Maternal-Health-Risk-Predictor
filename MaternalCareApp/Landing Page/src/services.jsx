const SERVICES = [
  { icon: "📊", bg: "#fff1f2", title: "Risk Dashboard",        desc: "Real-time overview of patient risk distribution with weekly vital trends and alert indicators." },
  { icon: "👥", bg: "#fdf2f8", title: "Patient Records",       desc: "Search and manage complete patient histories — vitals, assessments, and risk analyses all in one place." },
  { icon: "📋", bg: "#fff7ed", title: "New Assessment",        desc: "Guided input module — enter blood pressure, blood sugar, temperature, heart rate, and more." },
  { icon: "🔔", bg: "#fef2f2", title: "Smart Alerts",          desc: "Automated alerts surface patients who need immediate attention, reducing missed critical cases." },
  { icon: "🛡️", bg: "#f0fdf4", title: "Risk Factor Analysis", desc: "Multi-axis charts break down contributing factors — age, BP, blood sugar, heart rate, and temperature." },
  { icon: "⚡", bg: null,      title: "AI Prediction Engine",  desc: "ML model classifies patients as low, medium, or high risk based on multivariate physiological inputs.", featured: true },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: "96px 0", background: "#fafafa" }}>
      <div style={{ width: "100%", padding: "0 48px", boxSizing: "border-box" }} className="section-pad">

        {/* Header — centered */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 99, padding: "10px 24px", fontSize: 18, fontWeight: 800, color: "#f43f5e", marginBottom: 18 }}>Services</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 4.5vw, 58px)", color: "#0f172a", margin: "0 0 16px", lineHeight: 1.1, fontWeight: 800 }}>Everything care teams need</h2>
          <p style={{ color: "#475569", fontSize: "clamp(16px, 1.6vw, 19px)", maxWidth: 520, lineHeight: 1.7, margin: "0 auto", fontWeight: 500 }}>
            From intake to discharge, MaternalCare gives clinicians the tools to track, assess, and act.
          </p>
        </div>

        {/* Grid */}
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {SERVICES.map((s) => (
            <div key={s.title}
              style={{ background: s.featured ? "#f43f5e" : "white", border: s.featured ? "none" : "1px solid #f1f5f9", borderRadius: 22, padding: "32px", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { if (!s.featured) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 36px -8px rgba(244,63,94,0.12)"; } }}
              onMouseLeave={e => { if (!s.featured) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; } }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.featured ? "rgba(255,255,255,0.2)" : s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 24 }}>{s.icon}</div>
              <h3 style={{ fontSize: "clamp(17px, 1.6vw, 20px)", fontWeight: 800, color: s.featured ? "white" : "#0f172a", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: s.featured ? "rgba(255,255,255,0.85)" : "#475569", lineHeight: 1.75, margin: 0, fontWeight: 500 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .section-pad { padding: 0 32px !important; } }
        @media (max-width: 900px)  { .services-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 768px)  { .section-pad { padding: 0 24px !important; } }
        @media (max-width: 520px)  { .services-grid { grid-template-columns: 1fr !important; } .section-pad { padding: 0 16px !important; } }
      `}</style>
    </section>
  );
}
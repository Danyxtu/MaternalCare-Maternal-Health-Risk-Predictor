import { useState } from "react";

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [sent, setSent]       = useState(false);

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box", background: "white",
    border: `2px solid ${focused === field ? "#f43f5e" : "#cbd5e1"}`,
    borderRadius: 12, padding: "14px 18px",
    fontSize: "clamp(15px, 1.4vw, 17px)",
    color: "#0f172a", fontFamily: "inherit", outline: "none",
    boxShadow: focused === field ? "0 0 0 4px rgba(244,63,94,0.08)" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontWeight: 500,
  });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <section id="contact" style={{ padding: "96px 0", background: "#fafafa" }}>
      <div style={{ width: "100%", padding: "0 48px", boxSizing: "border-box" }} className="contact-pad">

        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 56px" }}>
          <div style={{ display: "inline-flex", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 99, padding: "10px 24px", fontSize: 18, fontWeight: 800, color: "#f43f5e", marginBottom: 20 }}>Contact</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 4.5vw, 58px)", color: "#0f172a", margin: "0 0 16px", fontWeight: 800 }}>Get in touch</h2>
          <p style={{ color: "#475569", fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            Have questions about MaternalCare? Our medical support team is ready to help.
          </p>
        </div>

        {/* Form card */}
        <div className="contact-card" style={{ maxWidth: 600, margin: "0 auto", background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: "clamp(28px, 3vw, 48px)", boxShadow: "0 12px 40px -8px rgba(15,23,42,0.10)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(244,63,94,0.3)" }}>
                <span style={{ color: "white", fontSize: 30, fontWeight: 700 }}>✓</span>
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0f172a", margin: "0 0 12px", fontWeight: 800 }}>Message sent!</p>
              <p style={{ fontSize: 17, color: "#475569", margin: 0, fontWeight: 500 }}>Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Full name *</label>
                <input type="text" placeholder="Dr. Jane Smith" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                  style={inputStyle("name")} />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Email *</label>
                <input type="email" placeholder="you@clinic.org" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  style={inputStyle("email")} />
              </div>

              {/* Message — role field removed */}
              <div>
                <label style={{ display: "block", fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Message</label>
                <textarea rows={5} placeholder="How can we help?" value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("message"), resize: "none", lineHeight: 1.7 }} />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit}
                style={{ width: "100%", background: "#f43f5e", color: "white", border: "none", cursor: "pointer", padding: "18px 0", borderRadius: 12, fontSize: 18, fontWeight: 800, fontFamily: "inherit", boxShadow: "0 6px 20px rgba(244,63,94,0.3)", opacity: (!form.name || !form.email) ? 0.5 : 1, transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(244,63,94,0.38)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,63,94,0.3)"; }}
              >Send Message</button>

              <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", margin: 0, fontWeight: 500 }}>
                Or email us at <a href="mailto:support@maternalcare.health" style={{ color: "#f43f5e", fontWeight: 700, textDecoration: "none" }}>support@maternalcare.health</a>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .contact-pad { padding: 0 32px !important; } }
        @media (max-width: 768px)  { .contact-pad { padding: 0 24px !important; } .contact-card { border-radius: 16px !important; } }
        @media (max-width: 520px)  { .contact-pad { padding: 0 16px !important; } }
      `}</style>
    </section>
  );
}
export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f1f5f9", padding: "24px 48px", background: "white", width: "100%" }} className="footer-pad">
      <div className="footer-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 12 }}>♥</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>MaternalCare</span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>© 2026 MaternalCare. All rights reserved.</p>

        {/* Links */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <a key={l} href="#"
              style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#f43f5e"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}
            >{l}</a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-pad   { padding: 24px !important; }
          .footer-inner { justify-content: center !important; text-align: center; }
        }
        @media (max-width: 520px) {
          .footer-pad { padding: 20px 16px !important; }
        }
      `}</style>
    </footer>
  );
}
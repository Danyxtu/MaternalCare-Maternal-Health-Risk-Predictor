import { useState, useEffect } from "react";

const LINKS = [
  { label: "Home",     href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
      borderBottom: scrolled ? "1px solid #f1f5f9" : "1px solid transparent",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div style={{ width: "100%", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>

        {/* Logo */}
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(244,63,94,0.3)" }}>
            <span style={{ color: "white", fontSize: 16 }}>♥</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>MaternalCare</span>
        </a>

        {/* Desktop center links */}
        <div className="nav-links" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 4 }}>
          {LINKS.map(({ label, href }) => (
            <a key={href} href={href}
              style={{ padding: "8px 20px", borderRadius: 99, fontSize: 20, fontWeight: 800, color: "#0f172a", textDecoration: "none", transition: "color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.target.style.color = "#f43f5e"; e.target.style.background = "#fff1f2"; }}
              onMouseLeave={e => { e.target.style.color = "#0f172a"; e.target.style.background = "transparent"; }}
            >{label}</a>
          ))}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "none" }}>
          <svg width="26" height="26" fill="none" stroke="#0f172a" strokeWidth="2.5" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "8px 24px 20px" }}>
          {LINKS.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "14px 0", fontSize: 17, fontWeight: 700, color: "#0f172a", textDecoration: "none", borderBottom: "1px solid #f8fafc" }}>
              {label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
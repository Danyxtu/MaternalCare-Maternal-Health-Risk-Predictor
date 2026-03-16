import Navbar from "./Navbar";
import Home from "./Home";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";
import Footer from "./footer";

export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0f172a", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; min-height: 100vh; background: #fafafa; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
      `}</style>

      <Navbar />
      <Home />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
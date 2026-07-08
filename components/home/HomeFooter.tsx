import Lockup from "./Lockup";

// Footer — bookends the header lockup, socials as logo glyphs,
// quick links mirror the section running order.
export default function HomeFooter() {
  return (
    <footer className="hm-footer">
      <div className="hm-footer-left">
        <Lockup footer />
        <div className="hm-socials">
          <a href="#" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H5.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.2" />
              <circle cx="12" cy="12" r="4.3" />
              <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.49 2.49 0 1 1-4.98 0 2.49 2.49 0 0 1 4.98 0zM.2 8.31h4.57V22.5H.2V8.31zm7.58 0h4.38v1.94h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.48 3.05 5.48 7.02v7.61h-4.56v-6.75c0-1.61-.03-3.68-2.24-3.68-2.25 0-2.59 1.75-2.59 3.56v6.87H7.78V8.31z" />
            </svg>
          </a>
        </div>
        <div className="hm-footer-meta">Orange County, CA — © 2026 Mixone Cinema</div>
      </div>
      <nav className="hm-footer-links" aria-label="Footer">
        <span className="hm-fl-head">Quick links</span>
        <a href="#who">Who we are</a>
        <a href="#services">What we do</a>
        <a href="#projects">Projects</a>
        <a href="#book">Contact</a>
      </nav>
    </footer>
  );
}

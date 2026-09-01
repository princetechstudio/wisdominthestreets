import { Component, useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";
import { CONTACT_EMAIL, FEATURED_EPISODE, PLATFORMS, SOCIALS, WHATSAPP_DISPLAY, whatsappLink } from "../data/content";
import {
  IconApple,
  IconClose,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconMenu,
  IconMic,
  IconMoon,
  IconPin,
  IconRss,
  IconSpotify,
  IconSun,
  IconTikTok,
  IconWhatsApp,
  IconXSocial,
  IconYouTube,
  LogoMark,
} from "./icons";
import { NewsletterForm } from "./cards";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/episodes", label: "Episodes" },
  { to: "/about", label: "About" },
  { to: "/quotes", label: "Quotes" },
  { to: "/contact", label: "Contact" },
];

export const socialIcon = (label: string, size = 16) => {
  switch (label) {
    case "Instagram": return <IconInstagram size={size} />;
    case "X (Twitter)": return <IconXSocial size={size} />;
    case "YouTube": return <IconYouTube size={size} />;
    case "LinkedIn": return <IconLinkedIn size={size} />;
    case "TikTok": return <IconTikTok size={size} />;
    default: return <IconMic size={size} />;
  }
};

/* ============================================================ Header */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const playEpisode = useStore((s) => s.playEpisode);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
        scrolled ? "border-b border-line bg-base/90 shadow-lg shadow-black/10 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Wisdom In The Streets — home">
          <span className="text-teal transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <LogoMark size={30} />
          </span>
          <span className="font-display leading-[0.9] tracking-[0.08em]">
            <span className="block text-[17px] text-ink">WISDOM IN</span>
            <span className="block text-[17px] text-teal">THE STREETS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `font-head relative text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive ? "text-teal" : "text-mute hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-ember transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute transition-all hover:border-teal/50 hover:text-teal"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -80, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 80, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? <IconMoon size={17} /> : <IconSun size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            onClick={() => playEpisode(FEATURED_EPISODE)}
            className="font-head hidden items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:shadow-ember sm:inline-flex"
          >
            <IconMic size={14} /> Listen
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:border-teal/50 lg:hidden"
          >
            {open ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-line bg-base/95 backdrop-blur-md lg:hidden"
            aria-label="Mobile"
          >
            <div className="space-y-1 px-5 py-5">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `font-display block border-l-2 py-2.5 pl-4 text-3xl tracking-wider transition ${
                        isActive ? "border-ember text-teal" : "border-line text-ink hover:border-teal"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="flex items-center gap-4 pt-4">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="text-mute transition hover:text-teal">
                    {socialIcon(s.label, 18)}
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================ Footer */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hello WITS! 👋")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_35px_rgba(37,211,102,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-base sm:bottom-6 sm:right-6"
    >
      <IconWhatsApp size={28} />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-panel/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-teal"><LogoMark size={34} /></span>
              <span className="font-display leading-[0.9] tracking-[0.08em]">
                <span className="block text-xl text-ink">WISDOM IN</span>
                <span className="block text-xl text-teal">THE STREETS</span>
              </span>
            </Link>
            <p className="font-head mt-4 text-sm font-semibold uppercase tracking-widest text-ember">
              Real Wisdom. Real Streets. Real Talk.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
              A weekly motivational podcast hosted by Marvin Marbell — recorded at street level in Accra, carried to 42 countries.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-mute transition-all hover:-translate-y-1 hover:border-teal/50 hover:text-teal"
                >
                  {socialIcon(s.label, 15)}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="font-head text-xs font-bold uppercase tracking-[0.22em] text-teal">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-mute transition hover:text-teal">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/episodes" className="text-mute transition hover:text-teal">Favorites & history</Link></li>
            </ul>
          </nav>

          <nav aria-label="Listen on platforms">
            <p className="font-head text-xs font-bold uppercase tracking-[0.22em] text-teal">Listen</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PLATFORMS.map((p) => (
                <li key={p.label}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-mute transition hover:text-teal">
                    {p.label === "Spotify" ? <IconSpotify size={14} /> : p.label === "YouTube" ? <IconYouTube size={14} /> : p.label === "RSS Feed" ? <IconRss size={14} /> : <IconApple size={14} />}
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-head text-xs font-bold uppercase tracking-[0.22em] text-teal">The Friday Digest</p>
            <p className="mt-4 text-sm text-mute">One email a week: new episode, one quote, zero noise.</p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
            <div className="mt-5 space-y-2 text-sm text-mute">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2.5 transition hover:text-teal">
                <IconMail size={15} /> {CONTACT_EMAIL}
              </a>
              <a href={whatsappLink("Hello WITS! 👋")} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 transition hover:text-teal">
                <IconWhatsApp size={15} /> {WHATSAPP_DISPLAY}
              </a>
              <p className="flex items-center gap-2.5"><IconPin size={15} /> Jamestown, Accra, Ghana</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} Wisdom In The Streets · Hosted by Marvin Marbell</p>
          <p className="flex items-center gap-2">
            Built on the corner <span className="inline-block h-1.5 w-1.5 rotate-45 bg-ember" aria-hidden="true" /> Accra → everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================ Scroll restoration */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

/* ============================================================ Error boundary */
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-base px-6 text-center">
          <div>
            <p className="font-display text-7xl text-teal">SIGNAL LOST</p>
            <p className="mt-3 text-mute">The street went quiet for a second. Let's get you back.</p>
            <button
              onClick={() => window.location.reload()}
              className="font-head mt-6 rounded-full bg-teal px-7 py-3 text-sm font-bold uppercase tracking-widest text-[#0a192f] transition hover:-translate-y-0.5"
            >
              Reload the page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

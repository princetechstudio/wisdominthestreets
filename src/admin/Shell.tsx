import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCms } from "./cms";
import { IcDash, IcGear, IcInbox, IcMenu, IcMic, IcQuote, IcX, ToastHost } from "./ui";
import { selectDrafts, selectUnread } from "./cms";

const NAV = [
  { to: "/", label: "Dashboard", icon: <IcDash size={17} />, end: true },
  { to: "/episodes", label: "Episodes", icon: <IcMic size={17} />, end: false },
  { to: "/quotes", label: "Quotes", icon: <IcQuote size={17} />, end: false },
  { to: "/messages", label: "Inbox", icon: <IcInbox size={17} />, end: false },
  { to: "/settings", label: "Settings", icon: <IcGear size={17} />, end: false },
];

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/episodes": "Episodes",
  "/quotes": "Quote Library",
  "/messages": "Inbox",
  "/settings": "Settings",
};

function EqLogo() {
  return (
    <span className="flex h-9 items-end gap-[3px]" aria-hidden="true">
      {[10, 20, 14, 24, 12].map((h, i) => (
        <span key={i} className={`eq-bar w-[4px] rounded-sm ${i % 2 ? "bg-ember" : "bg-teal"}`} style={{ height: h, animationDelay: `${i * 0.14}s` }} />
      ))}
    </span>
  );
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export default function Shell() {
  const location = useLocation();
  const [nav, setNav] = useState(false);
  const now = useClock();
  const drafts = useCms(selectDrafts).length;
  const unread = useCms(selectUnread).length;
  const settings = useCms((s) => s.settings);

  useEffect(() => setNav(false), [location.pathname]);

  const badges: Record<string, number> = { "/episodes": drafts, "/messages": unread };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <EqLogo />
        <div>
          <p className="font-display text-xl leading-none tracking-[0.08em] text-ink">WISDOM IN THE STREETS</p>
          <p className="font-head mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-teal">Producer console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Console sections">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-head text-[13px] font-semibold transition-all ${
                isActive ? "bg-teal/[0.08] text-teal" : "text-mute hover:bg-raise/60 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-teal transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} aria-hidden="true" />
                {n.icon}
                <span className="flex-1">{n.label}</span>
                {(badges[n.to] ?? 0) > 0 && (
                  <span className={`tnum rounded-full px-2 py-0.5 text-[10px] font-bold ${n.to === "/messages" ? "bg-ember/15 text-ember" : "bg-amber/15 text-amber"}`}>
                    {badges[n.to]}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 px-5 py-5">
        <div className="relative overflow-hidden rounded-lg border border-line bg-sunken px-3.5 py-3">
          <span className="scanline absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-teal/10 to-transparent" aria-hidden="true" />
          <p className="font-head text-[9px] font-bold uppercase tracking-[0.24em] text-faint">On air</p>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-ink">
            <span className="live-dot relative inline-block h-2 w-2 rounded-full bg-ember" />
            EP 010 · syndicated
          </p>
        </div>
        <p className="tnum text-[10px] uppercase tracking-widest text-faint">v1.0 · local demo data</p>
      </div>
    </div>
  );

  return (
    <div className="console-bg min-h-screen bg-base text-ink">
      <div className="grid-fade" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-panel/80 backdrop-blur-md lg:block">
        {sidebar}
      </aside>

      {/* sidebar (mobile overlay) */}
      <AnimatePresence>
        {nav && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-[#050d1d]/80 backdrop-blur-sm" onClick={() => setNav(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-64 border-r border-line bg-panel"
              aria-label="Console navigation"
            >
              <button onClick={() => setNav(false)} aria-label="Close menu" className="absolute right-3 top-5 text-mute hover:text-ink"><IcX size={18} /></button>
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-base/85 backdrop-blur-md">
          <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
            <button onClick={() => setNav(true)} aria-label="Open menu" className="text-mute transition hover:text-ink lg:hidden"><IcMenu size={20} /></button>
            <div className="min-w-0 flex-1">
              <p className="font-head truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-faint">WITS console / {TITLES[location.pathname] ?? "Dashboard"}</p>
              <h1 className="font-display truncate text-2xl leading-none tracking-wide text-ink sm:text-[26px]">{TITLES[location.pathname] ?? "Dashboard"}</h1>
            </div>
            <span className="tnum hidden items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-xs font-semibold text-mute sm:flex" aria-label="Current time">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
              {now.toLocaleTimeString("en-GB")}
            </span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-panel py-1.5 pl-1.5 pr-3.5">
              <span className="font-display grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-[#112240] to-[#3d1608] text-sm text-ember">MM</span>
              <span className="hidden text-left sm:block">
                <span className="block font-head text-xs font-bold leading-tight text-ink">{settings.host}</span>
                <span className="block text-[10px] uppercase tracking-widest text-faint">Producer</span>
              </span>
            </div>
          </div>
        </header>

        <main className="relative px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastHost />
    </div>
  );
}

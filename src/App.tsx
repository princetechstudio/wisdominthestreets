import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { bindAudioEvents, useStore } from "./store";
import { ErrorBoundary, Footer, Header, ScrollToTop } from "./components/chrome";
import { PlayerBar } from "./components/PlayerBar";
import { ToastHost } from "./components/ui";
import Home from "./pages/Home";
import Episodes from "./pages/Episodes";
import EpisodeDetail from "./pages/EpisodeDetail";
import About from "./pages/About";
import Quotes from "./pages/Quotes";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episode/:id" element={<EpisodeDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

function Shell() {
  const theme = useStore((s) => s.theme);
  const hasPlayer = useStore((s) => !!s.current);

  /* keep <html> class + data-theme in sync with the store */
  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("dark", "light");
    el.classList.add(theme);
    el.setAttribute("data-theme", theme);
  }, [theme]);

  /* attach audio element listeners once */
  useEffect(() => {
    bindAudioEvents();
  }, []);

  return (
    <div className={`flex min-h-screen flex-col bg-base text-ink transition-[padding] duration-300 ${hasPlayer ? "pb-28" : "pb-0"}`}>
      <div className="noise-overlay" aria-hidden="true" />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <AnimatedRoutes />
      </div>
      <Footer />
      <PlayerBar />
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <Shell />
        </HashRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}

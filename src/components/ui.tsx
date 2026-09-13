import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useStore } from "../store";
import { IconCheck, IconClose } from "./icons";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Per-page document title + meta description ---------- */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} · Wisdom In The Streets`;
    if (description) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", description);
    }
  }, [title, description]);
}

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Section heading with kicker ---------- */
export function SectionHead({
  kicker,
  title,
  right,
  className = "",
}: {
  kicker: string;
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
          <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" />
          {kicker}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-[0.95] tracking-wide text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {right}
    </Reveal>
  );
}

/* ---------- Count-up hook ---------- */
export function useCountUp(target: number, start: boolean, dur = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, dur]);
  return v;
}

export function CountUpStat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const v = useCountUp(value, inView);
  return (
    <span ref={ref}>
      {v.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------- Typewriter hook ---------- */
export function useTypewriter(words: string[], typeMs = 70, holdMs = 1800) {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    if (reducedMotion()) {
      setTxt(words[0]);
      return;
    }
    let w = 0;
    let i = 0;
    let deleting = false;
    let t = 0;
    const step = () => {
      const word = words[w];
      if (!deleting) {
        i++;
        setTxt(word.slice(0, i));
        if (i === word.length) {
          t = window.setTimeout(() => {
            deleting = true;
            step();
          }, holdMs);
          return;
        }
        t = window.setTimeout(step, typeMs);
      } else {
        i--;
        setTxt(word.slice(0, i));
        if (i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
          t = window.setTimeout(step, 350);
          return;
        }
        t = window.setTimeout(step, 28);
      }
    };
    t = window.setTimeout(step, 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join("|")]);
  return txt;
}

/* ---------- Marquee ticker ---------- */
export function Marquee({ items }: { items: string[] }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display px-6 text-xl tracking-[0.18em] text-mute sm:text-2xl">{it}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" fill="var(--wits-ember)" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-panel/60 py-3 backdrop-blur">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ---------- Ambient particles canvas ---------- */
export function Particles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const pts = Array.from({ length: 64 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.6,
      s: Math.random() * 0.05 + 0.012,
      o: Math.random() * 0.5 + 0.15,
      col: Math.random() < 0.18 ? "255,107,53" : "100,255,218",
    }));
    const resize = () => {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * DPR;
      c.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.y -= p.s / 60;
        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* ---------- Equalizer bars ---------- */
export function EqBars({ className = "", bars = 5 }: { className?: string; bars?: number }) {
  return (
    <span className={`inline-flex h-4 items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-sm bg-teal"
          style={{ height: "100%", animationDelay: `${i * 0.13}s`, animationDuration: `${0.8 + (i % 3) * 0.2}s` }}
        />
      ))}
    </span>
  );
}

/* ---------- Toast host ---------- */
export function ToastHost() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[90] flex w-[min(92vw,360px)] flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur ${
              t.kind === "error"
                ? "border-ember/40 bg-raise/95 text-ink"
                : t.kind === "success"
                  ? "border-teal/40 bg-raise/95 text-ink"
                  : "border-line bg-raise/95 text-ink"
            }`}
          >
            <span className={t.kind === "error" ? "text-ember" : "text-teal"}>
              {t.kind === "error" ? <IconClose size={16} /> : <IconCheck size={16} />}
            </span>
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-mute transition hover:text-ink">
              <IconClose size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

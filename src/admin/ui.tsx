import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCms } from "./cms";
import { fmtPlays } from "./data";

/* ============================================================
   Inline icon set (stroke = currentColor)
   ============================================================ */
const ic = (path: ReactNode, viewBox = "0 0 24 24") =>
  function Icon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
      <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {path}
      </svg>
    );
  };

export const IcDash = ic(<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>);
export const IcMic = ic(<><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3.5" /></>);
export const IcQuote = ic(<><path d="M10 7c-3 1-4.5 3.2-4.5 6.5V17h5v-5H8c0-2 .8-3.3 2.6-4L10 7Z" fill="currentColor" stroke="none" /><path d="M19 7c-3 1-4.5 3.2-4.5 6.5V17h5v-5H17c0-2 .8-3.3 2.6-4L19 7Z" fill="currentColor" stroke="none" /></>);
export const IcInbox = ic(<><path d="M3 13.5 6 5h12l3 8.5" /><path d="M3 13.5V19h18v-5.5h-5.2a3 3 0 0 1-2.6 1.5h-2.4a3 3 0 0 1-2.6-1.5H3Z" /></>);
export const IcGear = ic(<><circle cx="12" cy="12" r="3.2" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6a7.7 7.7 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.7 7.7 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5Z" /></>);
export const IcPlus = ic(<><path d="M12 5v14" /><path d="M5 12h14" /></>);
export const IcSearch = ic(<><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-3.8-3.8" /></>);
export const IcEdit = ic(<><path d="M4 20h4.5L20 8.5 15.5 4 4 15.5V20Z" /><path d="m13 6.5 4.5 4.5" /></>);
export const IcTrash = ic(<><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6.5 7 7.5 20h9L17.5 7" /><path d="M10 11v5M14 11v5" /></>);
export const IcStar = ic(<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />, "0 0 24 24");
export const IcCheck = ic(<path d="m4.5 12.5 5 5L19.5 7" />);
export const IcX = ic(<><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>);
export const IcMenu = ic(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>);
export const IcExt = ic(<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V6.5A1.5 1.5 0 0 1 5.5 5H10" /></>);
export const IcCopy = ic(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" /></>);
export const IcCal = ic(<><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17" /><path d="M8 3v4M16 3v4" /></>);
export const IcClock = ic(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const IcUsers = ic(<><circle cx="9" cy="8.5" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3.5 3.5 0 0 1 0 6.6" /><path d="M17.5 14.5A6 6 0 0 1 21 20" /></>);
export const IcUp = ic(<><path d="M12 19V5" /><path d="m5.5 11.5 6.5-6.5 6.5 6.5" /></>);
export const IcWave = ic(<><path d="M3 10v4" /><path d="M7 7v10" /><path d="M11 4v16" /><path d="M15 8v8" /><path d="M19 10v4" /></>);
export const IcWhatsApp = ic(<><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" /><path d="M9 8.5c-.5 2.5 3.5 7 6.5 6.5l.5-1.8-2.2-1-.9.9c-1-.4-2-1.4-2.4-2.4l.9-.9-1-2.2L9 8.5Z" /></>);
export const IcAlert = ic(<><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9.5V14" /><path d="M12 17h.01" /></>);
export const IcEye = ic(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>);
export const IcDownload = ic(<><path d="M12 4v10" /><path d="m7.5 10.5 4.5 4.5 4.5-4.5" /><path d="M4.5 19.5h15" /></>);

/* ============================================================
   Small primitives
   ============================================================ */
export function useEsc(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, active]);
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5.5 w-10 shrink-0 rounded-full border transition-colors duration-200 ${checked ? "border-teal/60 bg-teal/25" : "border-line bg-sunken"}`}
      style={{ height: 22 }}
    >
      <span
        className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-200 ${checked ? "left-[22px] bg-teal" : "left-[3px] bg-faint"}`}
      />
    </button>
  );
}

export function Sparkline({ points, color, w = 96, h = 30 }: { points: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const rng = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - 3 - ((p - min) / rng) * (h - 6)).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={w} cy={h - 3 - ((points[points.length - 1] - min) / rng) * (h - 6)} r="2.6" fill={color} />
    </svg>
  );
}

export function CountUp({ value, compact = false, suffix = "" }: { value: number; compact?: boolean; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1300, 1);
      setV(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tnum">
      {compact ? fmtPlays(v) : v.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEsc(onClose, open);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[#050d1d]/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-xl border border-line bg-panel shadow-lift`}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-head text-sm font-bold uppercase tracking-[0.16em] text-ink">{title}</h2>
              <button onClick={onClose} aria-label="Close dialog" className="text-mute transition hover:text-ink"><IcX size={16} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ open, onClose, title, sub, children }: { open: boolean; onClose: () => void; title: string; sub?: string; children: ReactNode }) {
  useEsc(onClose, open);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-[#050d1d]/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.aside
            role="dialog" aria-modal="true" aria-label={title}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-line bg-panel shadow-lift"
          >
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="font-display text-3xl tracking-wide text-ink">{title}</h2>
                {sub && <p className="font-head mt-1 text-[11px] font-semibold uppercase tracking-widest text-mute">{sub}</p>}
              </div>
              <button onClick={onClose} aria-label="Close panel" className="mt-1 text-mute transition hover:text-ink"><IcX size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Form field wrapper + inputs
   ============================================================ */
export function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-head mb-1.5 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-widest text-mute">
        {label}
        {hint && <em className="font-body text-[10px] not-italic text-faint normal-case tracking-normal">{hint}</em>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1.5 block text-xs font-medium text-ember">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-line bg-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition focus:border-teal/60 focus:outline-none focus:ring-2 focus:ring-teal/15";

export function TwoStepDelete({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  const [arm, setArm] = useState(false);
  useEffect(() => {
    if (!arm) return;
    const t = window.setTimeout(() => setArm(false), 2800);
    return () => window.clearTimeout(t);
  }, [arm]);
  if (arm) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onConfirm(); setArm(false); }}
        className="rounded-md bg-ember px-2.5 py-1 font-head text-[10px] font-bold uppercase tracking-widest text-[#0a192f] transition hover:brightness-110"
      >
        Confirm?
      </button>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setArm(true); }}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-md border border-line text-mute transition hover:border-ember/60 hover:text-ember"
    >
      <IcTrash size={14} />
    </button>
  );
}

/* ============================================================
   Toast host
   ============================================================ */
export function ToastHost() {
  const toasts = useCms((s) => s.toasts);
  const dismiss = useCms((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,360px)] flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 46, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 46, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="pointer-events-auto flex items-center gap-3 rounded-lg border border-line bg-raise/95 px-4 py-3 text-sm shadow-lift backdrop-blur"
          >
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.kind === "error" ? "bg-ember/20 text-ember" : t.kind === "success" ? "bg-teal/15 text-teal" : "bg-amber/15 text-amber"}`}>
              {t.kind === "error" ? <IcX size={12} /> : <IcCheck size={12} />}
            </span>
            <span className="flex-1 font-medium text-ink">{t.msg}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-faint transition hover:text-ink"><IcX size={13} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Empty state
   ============================================================ */
export function EmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-sunken text-faint">{icon}</span>
      <p className="font-display mt-4 text-2xl tracking-wide text-ink">{title}</p>
      <p className="mt-1.5 max-w-xs text-sm text-mute">{sub}</p>
    </div>
  );
}

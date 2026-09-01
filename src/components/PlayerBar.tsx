import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";
import { fmtClock, type Episode } from "../data/content";
import { copyText } from "./cards";
import {
  IconHeart,
  IconLink,
  IconMute,
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
  IconSkipBack,
  IconSkipFwd,
  IconVolume,
} from "./icons";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* ---------- progress bar with pointer scrubbing ---------- */
export function ProgressBar({ compact = false }: { compact?: boolean }) {
  const currentTime = useStore((s) => s.currentTime);
  const duration = useStore((s) => s.duration);
  const current = useStore((s) => s.current);
  const seek = useStore((s) => s.seek);
  const barRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);
  const dur = duration || current?.duration || 0;
  const pct = dur > 0 ? Math.min((currentTime / dur) * 100, 100) : 0;

  const scrubTo = (clientX: number) => {
    const el = barRef.current;
    if (!el || dur <= 0) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    seek(ratio * dur);
  };

  return (
    <div className="flex w-full items-center gap-2.5">
      <span className="w-10 text-right font-body text-[11px] tabular-nums text-mute">{fmtClock(currentTime)}</span>
      <div
        ref={barRef}
        role="slider"
        aria-label="Seek audio"
        aria-valuemin={0}
        aria-valuemax={Math.round(dur)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(currentTime + 5);
          if (e.key === "ArrowLeft") seek(currentTime - 5);
        }}
        onPointerDown={(e) => {
          scrubbing.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          scrubTo(e.clientX);
        }}
        onPointerMove={(e) => scrubbing.current && scrubTo(e.clientX)}
        onPointerUp={() => (scrubbing.current = false)}
        onPointerCancel={() => (scrubbing.current = false)}
        className={`group relative flex-1 cursor-pointer ${compact ? "py-2" : "py-2.5"}`}
      >
        <div className={`relative w-full overflow-hidden rounded-full bg-raise ${compact ? "h-[4px]" : "h-[5px]"}`}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-teal transition-[width] duration-150 ease-linear" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-teal opacity-0 shadow-glow transition-opacity group-hover:opacity-100"
            style={{ left: `calc(${pct}% - 6px)` }}
          />
        </div>
      </div>
      <span className="w-10 font-body text-[11px] tabular-nums text-mute">{fmtClock(dur)}</span>
    </div>
  );
}

/* ---------- speed + volume cluster ---------- */
export function AuxControls() {
  const speed = useStore((s) => s.speed);
  const setSpeed = useStore((s) => s.setSpeed);
  const volume = useStore((s) => s.volume);
  const muted = useStore((s) => s.muted);
  const setVolume = useStore((s) => s.setVolume);
  const toggleMute = useStore((s) => s.toggleMute);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
        aria-label={`Playback speed ${speed}x — click to change`}
        className="font-head rounded-md border border-line px-2 py-1 text-[11px] font-bold tabular-nums text-mute transition hover:border-teal/50 hover:text-teal"
      >
        {speed}×
      </button>
      <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="text-mute transition hover:text-teal">
        {muted || volume === 0 ? <IconMute size={17} /> : <IconVolume size={17} />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        aria-label="Volume"
        className="wits-range w-20"
        style={{ "--fill": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}

/* ---------- MiniPlayer: inline custom controls for featured episode ---------- */
export function MiniPlayer({ ep }: { ep: Episode }) {
  const current = useStore((s) => s.current);
  const isPlaying = useStore((s) => s.isPlaying);
  const togglePlay = useStore((s) => s.togglePlay);
  const playEpisode = useStore((s) => s.playEpisode);
  const skip = useStore((s) => s.skip);
  const active = current?.id === ep.id;
  const playing = active && isPlaying;

  return (
    <div className="rounded-xl border border-line bg-base/70 p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={() => skip(-15)}
          aria-label="Back 15 seconds"
          disabled={!active}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute transition hover:border-teal/50 hover:text-teal disabled:opacity-40"
        >
          <IconSkipBack size={18} />
        </button>
        <button
          onClick={() => (active ? togglePlay() : playEpisode(ep))}
          aria-label={playing ? "Pause episode" : "Play episode"}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-[#0a192f] shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          {playing ? <IconPause size={22} /> : <IconPlay size={22} />}
        </button>
        <button
          onClick={() => skip(15)}
          aria-label="Forward 15 seconds"
          disabled={!active}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute transition hover:border-teal/50 hover:text-teal disabled:opacity-40"
        >
          <IconSkipFwd size={18} />
        </button>
        <div className="min-w-0 flex-1 pl-1">
          <ProgressBar compact />
        </div>
        <div className="hidden sm:block">
          <AuxControls />
        </div>
      </div>
      {!active && (
        <p className="mt-2 text-center text-[11px] uppercase tracking-widest text-mute sm:hidden">Tap play to start the episode</p>
      )}
    </div>
  );
}

/* ============================================================ Sticky PlayerBar */
export function PlayerBar() {
  const current = useStore((s) => s.current);
  const isPlaying = useStore((s) => s.isPlaying);
  const togglePlay = useStore((s) => s.togglePlay);
  const skip = useStore((s) => s.skip);
  const next = useStore((s) => s.next);
  const prev = useStore((s) => s.prev);
  const queue = useStore((s) => s.queue);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const currentTime = useStore((s) => s.currentTime);
  const toast = useStore((s) => s.toast);

  const [showShare, setShowShare] = useState(false);

  /* global keyboard shortcuts: Space toggles, arrows seek */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || tag === "A" || t?.isContentEditable) return;
      if (t?.getAttribute?.("role") === "slider") return; // slider handles its own arrow keys
      if (!useStore.getState().current) return;
      if (e.code === "Space") {
        e.preventDefault();
        useStore.getState().togglePlay();
      } else if (e.code === "ArrowRight") {
        useStore.getState().skip(15);
      } else if (e.code === "ArrowLeft") {
        useStore.getState().skip(-15);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const qPos = current && queue.length ? queue.indexOf(current.id) + 1 : 0;
  const fav = current ? favorites.includes(current.id) : false;

  const shareTimestamp = async () => {
    if (!current) return;
    const url = `${window.location.origin}${window.location.pathname}#/episode/${current.id}?t=${Math.floor(currentTime)}`;
    (await copyText(`🎧 ${current.title} @ ${fmtClock(currentTime)} — Wisdom In The Streets\n${url}`))
      ? toast("Share link with timestamp copied", "success")
      : toast("Couldn't copy link", "error");
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ y: 110 }}
          animate={{ y: 0 }}
          exit={{ y: 110 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[75] border-t border-line bg-panel/95 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
          role="region"
          aria-label="Audio player"
        >
          <div className="mx-auto max-w-7xl px-3 pb-2.5 pt-1.5 sm:px-6 lg:px-8">
            {/* top progress strip */}
            <ProgressBar compact />
            <div className="mt-1 flex items-center gap-3">
              {/* track info */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md border border-line"
                  style={{ background: `linear-gradient(142deg, ${current.palette.a}, ${current.palette.b})` }}
                >
                  <span className="font-display text-sm tracking-widest" style={{ color: current.palette.accent }}>
                    {current.num}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-head text-[13px] font-semibold text-ink">Episode {current.num} — {current.title}</p>
                  <p className="truncate text-[11px] text-mute">
                    {current.guest ? `with ${current.guest.name} · ` : ""}Queue {qPos > 0 ? qPos : "—"}/{queue.length}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(current.id)}
                  aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                  className={`ml-1 hidden sm:grid h-8 w-8 place-items-center rounded-full border transition hover:scale-110 ${
                    fav ? "border-ember/50 text-ember" : "border-line text-mute hover:text-ember"
                  }`}
                >
                  <IconHeart size={14} filled={fav} />
                </button>
              </div>

              {/* transport */}
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button onClick={() => prev()} aria-label="Previous episode" className="hidden text-mute transition hover:text-ink sm:block">
                  <IconPrev size={18} />
                </button>
                <button
                  onClick={() => skip(-15)}
                  aria-label="Back 15 seconds"
                  className="grid h-9 w-9 place-items-center text-mute transition hover:scale-110 hover:text-teal"
                >
                  <IconSkipBack size={19} />
                </button>
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="grid h-12 w-12 place-items-center rounded-full bg-teal text-[#0a192f] shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <IconPause size={20} /> : <IconPlay size={20} />}
                </button>
                <button
                  onClick={() => skip(15)}
                  aria-label="Forward 15 seconds"
                  className="grid h-9 w-9 place-items-center text-mute transition hover:scale-110 hover:text-teal"
                >
                  <IconSkipFwd size={19} />
                </button>
                <button onClick={() => next()} aria-label="Next episode" className="hidden text-mute transition hover:text-ink sm:block">
                  <IconNext size={18} />
                </button>
              </div>

              {/* aux */}
              <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                <button
                  onClick={() => setShowShare((v) => !v)}
                  aria-label="Share episode at current timestamp"
                  className={`grid h-8 w-8 place-items-center rounded-full border transition hover:scale-110 ${
                    showShare ? "border-teal/60 text-teal" : "border-line text-mute hover:text-teal"
                  }`}
                >
                  <IconLink size={14} />
                </button>
                <AuxControls />
              </div>
            </div>
            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <button
                    onClick={shareTimestamp}
                    className="font-head mt-2 w-full rounded-lg border border-teal/40 bg-teal/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal transition hover:bg-teal/20"
                  >
                    Copy share link @ {fmtClock(currentTime)}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

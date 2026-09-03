import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store";
import {
  fmtDate,
  fmtDuration,
  fmtPlays,
  type Episode,
  type Quote,
} from "../data/content";
import {
  IconApple,
  IconBookmark,
  IconCalendar,
  IconCheck,
  IconDownload,
  IconFacebook,
  IconHeadphones,
  IconHeart,
  IconLink,
  IconPause,
  IconPlay,
  IconQuote,
  IconRss,
  IconSpotify,
  IconWhatsApp,
  IconXSocial,
  IconYouTube,
} from "./icons";
import { EqBars } from "./ui";

/* ============================================================
   CoverArt — procedurally drawn episode artwork (no two alike)
   ============================================================ */
export function CoverArt({ ep, className = "" }: { ep: Episode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(142deg, ${ep.palette.a} 0%, ${ep.palette.b} 100%)` }}
    >
      {/* street grid pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden="true">
        <defs>
          <pattern id={`grid-${ep.id}`} width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0v26" fill="none" stroke={ep.palette.accent} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${ep.id})`} />
        <circle cx="82%" cy="18%" r="70" fill="none" stroke={ep.palette.accent} strokeWidth="1" opacity="0.5" />
        <circle cx="82%" cy="18%" r="100" fill="none" stroke={ep.palette.accent} strokeWidth="0.6" opacity="0.3" />
      </svg>
      {/* huge outline episode number */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute -right-2 -top-6 select-none text-[104px] leading-none sm:text-[124px]"
        style={{ color: "transparent", WebkitTextStroke: `2px ${ep.palette.accent}66` }}
      >
        {ep.num}
      </span>
      {/* accent corner bar */}
      <span className="absolute left-0 top-0 h-1 w-16" style={{ background: ep.palette.accent }} aria-hidden="true" />
      {/* bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="font-head text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: ep.palette.accent }}>
          Episode {ep.num} · {ep.category}
        </p>
        <p className="font-head mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-[#e6f1ff] sm:text-base">
          {ep.title}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   EpisodeCard
   ============================================================ */
export function EpisodeCard({ ep, delay = 0 }: { ep: Episode; delay?: number }) {
  const navigate = useNavigate();
  const playEpisode = useStore((s) => s.playEpisode);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorites = useStore((s) => s.favorites);
  const current = useStore((s) => s.current);
  const isPlaying = useStore((s) => s.isPlaying);
  const togglePlay = useStore((s) => s.togglePlay);
  const fav = favorites.includes(ep.id);
  const isCurrent = current?.id === ep.id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-glow"
    >
      <div className="relative">
        <button
          onClick={() => navigate(`/episode/${ep.id}`)}
          className="block w-full cursor-pointer text-left"
          aria-label={`Open episode ${ep.num}: ${ep.title}`}
        >
          <CoverArt ep={ep} className="aspect-[16/10]" />
        </button>
        {/* play overlay */}
        <button
          onClick={() => (isCurrent ? togglePlay() : playEpisode(ep))}
          aria-label={isCurrent && isPlaying ? `Pause ${ep.title}` : `Play ${ep.title}`}
          className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ember text-[#0a192f] opacity-100 shadow-ember transition-all duration-300 hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
        >
          {isCurrent && isPlaying ? <IconPause size={18} /> : <IconPlay size={18} />}
        </button>
        {isCurrent && isPlaying && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-teal/30 bg-[#0a192f]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-teal backdrop-blur">
            <EqBars bars={4} className="h-3" /> On air
          </span>
        )}
        {/* favorite */}
        <button
          onClick={() => toggleFavorite(ep.id)}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={fav}
          className={`absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all hover:scale-110 ${
            fav ? "border-ember/50 bg-ember/15 text-ember" : "border-line bg-[#0a192f]/70 text-mute hover:text-ember"
          }`}
        >
          <IconHeart size={16} filled={fav} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg tracking-[0.14em] text-teal">EPISODE {ep.num}</p>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-head font-semibold uppercase tracking-widest"
            style={{ color: ep.palette.accent, borderColor: `${ep.palette.accent}55` }}
          >
            {ep.category}
          </span>
        </div>
        <button onClick={() => navigate(`/episode/${ep.id}`)} className="mt-2 text-left">
          <h3 className="font-head text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-teal">
            {ep.title}
          </h3>
        </button>
        {ep.guest && <p className="mt-1 text-sm text-mute">with {ep.guest.name}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-mute">
          <span className="inline-flex items-center gap-1.5"><IconCalendar size={13} /> {fmtDate(ep.date)}</span>
          <span className="inline-flex items-center gap-1.5"><IconHeadphones size={13} /> {fmtPlays(ep.plays)} plays</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {ep.tags.map((t) => (
            <span key={t} className="rounded bg-raise px-2 py-0.5 text-[11px] text-mute">#{t}</span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
          <div className="flex items-center gap-3 text-mute">
            <a href="https://open.spotify.com/show/wisdom-in-the-streets" target="_blank" rel="noreferrer" aria-label="Listen on Spotify" className="transition hover:text-teal"><IconSpotify size={17} /></a>
            <a href="https://podcasts.apple.com/show/wisdom-in-the-streets" target="_blank" rel="noreferrer" aria-label="Listen on Apple Podcasts" className="transition hover:text-teal"><IconApple size={17} /></a>
            <a href="https://youtube.com/@WITSPodcast" target="_blank" rel="noreferrer" aria-label="Watch on YouTube" className="transition hover:text-teal"><IconYouTube size={17} /></a>
            <span className="text-[11px]">{fmtDuration(ep.duration)}</span>
          </div>
          <Link to={`/episode/${ep.id}`} className="font-head text-xs font-semibold uppercase tracking-widest text-teal transition hover:text-ember">
            Show notes →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   Sharing helpers
   ============================================================ */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
};

export const shareUrls = (text: string, url: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
});

export function ShareRow({ text, url, compact = false }: { text: string; url: string; compact?: boolean }) {
  const toast = useStore((s) => s.toast);
  const u = shareUrls(text, url);
  const btn = `grid place-items-center rounded-full border border-line text-mute transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal ${compact ? "h-8 w-8" : "h-9 w-9"}`;
  return (
    <div className="flex items-center gap-2">
      <a className={btn} href={u.whatsapp} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp"><IconWhatsApp size={compact ? 14 : 16} /></a>
      <a className={btn} href={u.x} target="_blank" rel="noreferrer" aria-label="Share on X"><IconXSocial size={compact ? 13 : 14} /></a>
      <a className={btn} href={u.facebook} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><IconFacebook size={compact ? 14 : 16} /></a>
      <button
        className={btn}
        aria-label="Copy link"
        onClick={async () => {
          (await copyText(url)) ? toast("Link copied to clipboard", "success") : toast("Couldn't copy link", "error");
        }}
      >
        <IconLink size={compact ? 14 : 15} />
      </button>
    </div>
  );
}

/* ============================================================
   Quote image generator (canvas → PNG download)
   ============================================================ */
export function downloadQuoteImage(q: Quote) {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return;

  const draw = () => {
    // background
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0a192f");
    g.addColorStop(1, "#112240");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // accent bars
    ctx.fillStyle = "#ff6b35";
    ctx.fillRect(90, 120, 90, 10);
    ctx.fillStyle = "#64ffda";
    ctx.fillRect(90, H - 190, 220, 4);
    // quote mark
    ctx.fillStyle = "#ff6b35";
    ctx.font = "700 340px Georgia, serif";
    ctx.fillText("“", 60, 360);
    // wrapped quote text
    ctx.fillStyle = "#e6f1ff";
    ctx.font = "600 64px Inter, sans-serif";
    const maxW = W - 190;
    const words = q.text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    let y = 520;
    for (const l of lines) {
      ctx.fillText(l, 92, y);
      y += 92;
    }
    // attribution
    ctx.fillStyle = "#64ffda";
    ctx.font = "600 44px Poppins, sans-serif";
    ctx.fillText(`— ${q.author}`, 92, y + 40);
    // footer
    ctx.fillStyle = "#8892b0";
    ctx.font = "500 34px Poppins, sans-serif";
    ctx.fillText(`WISDOM IN THE STREETS  ·  ${q.episode}`, 92, H - 120);
    ctx.fillStyle = "#64ffda";
    ctx.font = "700 30px 'Bebas Neue', sans-serif";
    ctx.fillText("REAL WISDOM · REAL STREETS · REAL TALK", 92, H - 70);

    c.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `wits-quote-${q.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png");
  };

  if (document.fonts?.ready) document.fonts.ready.then(draw).catch(draw);
  else draw();
}

/* ============================================================
   QuoteCard — library tile
   ============================================================ */
export function QuoteCard({ q, delay = 0 }: { q: Quote; delay?: number }) {
  const toast = useStore((s) => s.toast);
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/quotes`;

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex break-inside-avoid flex-col rounded-xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ember/40 hover:shadow-ember"
    >
      <IconQuote size={30} className="text-ember" />
      <p className="mt-4 flex-1 text-[17px] font-medium leading-relaxed text-ink">{q.text}</p>
      <footer className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="font-head text-sm font-semibold text-teal">{q.author}</p>
          <p className="mt-0.5 text-xs text-mute">
            {q.episode} · <span className="uppercase tracking-wider">{q.topic}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 opacity-70 transition group-hover:opacity-100">
          <button
            aria-label="Copy quote"
            onClick={async () => {
              const ok = await copyText(`“${q.text}” — ${q.author}, Wisdom In The Streets ${q.episode}`);
              if (ok) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
                toast("Quote copied to clipboard", "success");
              } else toast("Couldn't copy quote", "error");
            }}
            className={`grid h-8 w-8 place-items-center rounded-full border transition-all hover:scale-110 ${copied ? "border-teal/60 text-teal" : "border-line text-mute hover:text-teal"}`}
          >
            {copied ? <IconCheck size={14} /> : <IconLink size={14} />}
          </button>
          <button
            aria-label="Download quote as image"
            onClick={() => {
              downloadQuoteImage(q);
              toast("Quote image downloading…", "success");
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-mute transition-all hover:scale-110 hover:text-ember"
          >
            <IconDownload size={14} />
          </button>
          <a
            aria-label="Share quote on WhatsApp"
            href={shareUrls(`“${q.text}” — ${q.author}`, url).whatsapp}
            target="_blank"
            rel="noreferrer"
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-mute transition-all hover:scale-110 hover:text-teal"
          >
            <IconWhatsApp size={14} />
          </a>
        </div>
      </footer>
    </motion.blockquote>
  );
}

/* ============================================================
   Newsletter form (footer + CTA band)
   ============================================================ */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const toast = useStore((s) => s.toast);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agree) {
      setError("Please tick the privacy box so we know you're happy.");
      return;
    }
    setStatus("loading");
    // Production: POST to Mailchimp/ConvertKit endpoint (see .env.example)
    window.setTimeout(() => {
      setStatus("done");
      try {
        localStorage.setItem("wits-newsletter", email);
      } catch { /* ignore */ }
      toast("You're on the list — wisdom lands Friday ✦", "success");
    }, 900);
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-teal/40 bg-teal/10 px-4 py-3.5 text-sm text-teal">
        <IconCheck size={18} />
        <p className="font-medium">Subscribed. The next episode lands in your inbox Friday.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className={`flex ${compact ? "flex-col gap-2.5" : "flex-col gap-3 sm:flex-row"}`}>
        <label className="sr-only" htmlFor={compact ? "nl-compact" : "nl-main"}>Email address</label>
        <input
          id={compact ? "nl-compact" : "nl-main"}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-mute/70 transition focus:border-teal/60 focus:outline-none ${compact ? "" : "sm:flex-1"}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="font-head rounded-lg bg-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <label className="mt-2.5 flex cursor-pointer items-start gap-2 text-xs text-mute">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#64ffda]" />
        <span>I agree to receive the weekly episode digest and understand I can unsubscribe anytime. No spam — street rules.</span>
      </label>
      {error && <p className="mt-2 text-xs font-medium text-ember" role="alert">{error}</p>}
    </form>
  );
}

/* ============================================================
   Platform badges row
   ============================================================ */
export function PlatformRow() {
  const items = [
    { label: "Spotify", icon: <IconSpotify size={20} />, url: "https://open.spotify.com/show/wisdom-in-the-streets", note: "Follow" },
    { label: "Apple Podcasts", icon: <IconApple size={20} />, url: "https://podcasts.apple.com/show/wisdom-in-the-streets", note: "Rate us" },
    { label: "YouTube", icon: <IconYouTube size={20} />, url: "https://youtube.com/@WITSPodcast", note: "Watch" },
    { label: "RSS", icon: <IconRss size={20} />, url: "https://witspodcast.com/feed.xml", note: "Any app" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3.5 transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-glow"
        >
          <span className="text-teal transition-transform group-hover:scale-110">{it.icon}</span>
          <span>
            <span className="font-head block text-sm font-semibold text-ink">{it.label}</span>
            <span className="block text-[11px] uppercase tracking-widest text-mute">{it.note}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export { IconBookmark };

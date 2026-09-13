import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useStore } from "../store";
import {
  EPISODES,
  FEATURED_EPISODE,
  IMAGES,
  QUOTES,
  STATS,
  TESTIMONIALS,
  episodeById,
  fmtClock,
  fmtDate,
  fmtDuration,
  fmtPlays,
} from "../data/content";
import {
  CountUpStat,
  EqBars,
  Marquee,
  Particles,
  Reveal,
  SectionHead,
  usePageMeta,
  useTypewriter,
} from "../components/ui";
import { CoverArt, EpisodeCard, NewsletterForm, PlatformRow, ShareRow } from "../components/cards";
import { MiniPlayer } from "../components/PlayerBar";
import {
  IconArrowRight,
  IconCalendar,
  IconGlobe,
  IconHeadphones,
  IconHeart,
  IconMic,
  IconPin,
  IconPlay,
  IconQuote,
  IconUsers,
} from "../components/icons";

const HERO_QUOTES = [QUOTES[0], QUOTES[9], QUOTES[12], QUOTES[19]];
const WEEK_QUOTES = [QUOTES[3], QUOTES[0], QUOTES[10], QUOTES[16], QUOTES[19]];
const TICKER = [
  "REAL WISDOM",
  "REAL STREETS",
  "REAL TALK",
  "NEW EPISODES EVERY FRIDAY",
  "FROM ACCRA TO EVERYWHERE",
  "EP 010 — OUT NOW",
];

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z" fill="var(--wits-ember)" />
    </svg>
  );
}

/* ---------- Rotating circular badge ---------- */
function SpinBadge() {
  return (
    <div className="spin-slow pointer-events-none absolute right-5 top-5 z-10 hidden h-28 w-28 drop-shadow-2xl sm:block lg:h-32 lg:w-32" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <defs>
          <path id="witsCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="59" fill="var(--wits-panel)" stroke="var(--wits-line)" />
        <text className="font-head" fontSize="10.5" letterSpacing="2.6" fill="var(--wits-teal)">
          <textPath href="#witsCircle">WISDOM IN THE STREETS · REAL TALK ·</textPath>
        </text>
        <g transform="translate(48,46)">
          <rect x="6" y="0" width="12" height="18" rx="6" fill="var(--wits-ember)" />
          <path d="M2 14a10 10 0 0 0 20 0" stroke="var(--wits-ember)" strokeWidth="2.4" fill="none" />
          <line x1="12" y1="24" x2="12" y2="30" stroke="var(--wits-ember)" strokeWidth="2.4" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  usePageMeta("Home — Real Wisdom. Real Streets. Real Talk.", "Wisdom In The Streets — a motivational podcast hosted by Marvin Marbell from the street corners of Accra.");

  const playEpisode = useStore((s) => s.playEpisode);
  const lastPlayed = useStore((s) => s.lastPlayed);
  const toast = useStore((s) => s.toast);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorites = useStore((s) => s.favorites);

  const typed = useTypewriter(["Real wisdom.", "Real streets.", "Real talk.", "Real growth."]);
  const [qIdx, setQIdx] = useState(0);
  const [weekIdx, setWeekIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setQIdx((i) => (i + 1) % HERO_QUOTES.length), 5200);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    const t = window.setInterval(() => setWeekIdx((i) => (i + 1) % WEEK_QUOTES.length), 8000);
    return () => window.clearInterval(t);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const resumeEp = lastPlayed ? episodeById(lastPlayed.id) : undefined;
  const featured = FEATURED_EPISODE;
  const latest = [...EPISODES].reverse().slice(0, 6);
  const weekQuote = WEEK_QUOTES[weekIdx];
  const favFeat = favorites.includes(featured.id);

  return (
    <>
      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
          <motion.img
            style={{ scale: bgScale }}
            src={IMAGES.street}
            alt=""
            className="kenburns h-full w-full object-cover opacity-45"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-base/80 via-base/40 to-base" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(55% 45% at 72% 28%, rgba(100,255,218,0.10), transparent 70%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(40% 35% at 15% 80%, rgba(255,107,53,0.08), transparent 70%)" }} />
        </motion.div>
        <Particles className="absolute inset-0 h-full w-full" />

        <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-32">
          {/* left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 rounded-full border border-ember/40 bg-ember/10 px-4 py-2"
            >
              <span className="ping-dot relative inline-block h-2 w-2 rounded-full bg-ember" />
              <span className="font-head text-[11px] font-bold uppercase tracking-[0.24em] text-ember">On air · Season 01</span>
              <EqBars bars={4} className="h-3.5" />
            </motion.div>

            <h1 className="font-display mt-7 text-[68px] leading-[0.86] tracking-wide sm:text-[104px] lg:text-[122px]">
              <motion.span initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="block text-ink">
                WISDOM IN
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }} className="text-hollow block">
                THE STREETS
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-head mt-5 min-h-[28px] text-lg font-semibold text-teal sm:text-xl"
              aria-live="off"
            >
              <span className="text-ember">—</span> {typed}
              <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-teal" aria-hidden="true" />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute"
            >
              A weekly motivational podcast hosted by <strong className="font-semibold text-ink">Marvin Marbell</strong> — recorded at
              street level in Accra, where traders, drivers and aunties drop more truth in five minutes than most boardrooms do in five hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => playEpisode(featured)}
                className="font-head group inline-flex items-center gap-2.5 rounded-full bg-teal px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
              >
                <IconPlay size={15} className="transition-transform group-hover:scale-125" />
                Listen now
              </button>
              <Link
                to="/episodes"
                className="font-head inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-ink transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal"
              >
                View episodes <IconArrowRight size={15} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mute"
            >
              <span className="inline-flex items-center gap-2"><IconMic size={14} className="text-teal" /> {EPISODES.length} episodes</span>
              <span className="inline-flex items-center gap-2"><IconHeadphones size={14} className="text-teal" /> 256K+ plays</span>
              <span className="inline-flex items-center gap-2"><IconGlobe size={14} className="text-teal" /> 42 countries</span>
              <span className="inline-flex items-center gap-2"><IconCalendar size={14} className="text-teal" /> New every Friday</span>
            </motion.div>

            {resumeEp && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05 }}
                onClick={() => playEpisode(resumeEp, undefined, lastPlayed?.time ?? 0)}
                className="mt-7 inline-flex items-center gap-3 rounded-xl border border-teal/30 bg-panel/70 px-4 py-3 text-left backdrop-blur transition hover:border-teal/60 hover:shadow-glow"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/15 text-teal"><IconPlay size={14} /></span>
                <span>
                  <span className="block font-head text-[11px] font-bold uppercase tracking-widest text-teal">Continue listening</span>
                  <span className="block text-sm text-ink">EP {resumeEp.num} · {resumeEp.title} @ {fmtClock(lastPlayed?.time ?? 0)}</span>
                </span>
              </motion.button>
            )}
          </div>

          {/* right — floating quote cards + cover art */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-[400px] lg:block" aria-hidden="false">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-4 w-[300px] overflow-hidden rounded-xl border border-line shadow-2xl"
            >
              <img src={IMAGES.coverArt} alt="Wisdom In The Streets cover art — a microphone on a street corner" className="kenburns aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent p-4 pt-10">
                <p className="font-display text-lg tracking-[0.14em] text-teal">SEASON 01 · COMPLETE</p>
              </div>
            </motion.div>

            <div className="absolute -left-4 top-10 w-[330px]" style={{ ["--tilt" as never]: "-4deg" } as React.CSSProperties}>
              <div className="floaty relative rounded-xl border border-line bg-panel/95 p-6 shadow-2xl backdrop-blur" style={{ animationDelay: "0.4s" }}>
                <IconQuote size={26} className="text-ember" />
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={qIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                  >
                    <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink">“{HERO_QUOTES[qIdx].text}”</p>
                    <footer className="font-head mt-3 text-xs font-semibold uppercase tracking-widest text-teal">
                      — {HERO_QUOTES[qIdx].author} · {HERO_QUOTES[qIdx].episode}
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute -left-10 bottom-0 flex items-center gap-3 rounded-xl border border-line bg-base/90 p-4 shadow-xl backdrop-blur"
              style={{ ["--tilt" as never]: "2deg" } as React.CSSProperties}
            >
              <button
                onClick={() => playEpisode(featured)}
                aria-label={`Play episode ${featured.num}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-[#0a192f] transition hover:scale-110"
              >
                <IconPlay size={16} />
              </button>
              <div className="min-w-0">
                <p className="font-head text-[10px] font-bold uppercase tracking-widest text-ember">Now streaming</p>
                <p className="truncate text-sm font-medium text-ink">EP {featured.num} — {featured.title}</p>
              </div>
              <EqBars bars={4} className="h-4 shrink-0" />
            </motion.div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="relative mx-auto mb-6 hidden flex-col items-center gap-2 lg:flex" aria-hidden="true">
          <span className="font-head text-[10px] uppercase tracking-[0.3em] text-mute">Scroll</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-teal to-transparent" />
        </div>

        <div className="relative">
          <Marquee items={TICKER} />
        </div>
      </section>

      {/* ================= FEATURED EPISODE ================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead
          kicker="Fresh off the mic"
          title="THE LATEST DROP"
          right={
            <Link to="/episodes" className="font-head group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal transition hover:text-ember">
              All episodes <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <Reveal className="mt-10">
          <div className="relative grid overflow-hidden rounded-xl border border-line bg-panel lg:grid-cols-[430px_1fr]">
            <div className="relative">
              <CoverArt ep={featured} className="h-full min-h-[300px]" />
              <SpinBadge />
            </div>
            <div className="flex flex-col gap-5 p-6 sm:p-9 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-xl tracking-[0.14em] text-teal">EPISODE {featured.num}</span>
                <span className="rounded-full border border-ember/50 bg-ember/10 px-3 py-1 font-head text-[10px] font-bold uppercase tracking-widest text-ember">
                  Season finale
                </span>
                <span className="rounded-full border px-3 py-1 font-head text-[10px] font-semibold uppercase tracking-widest" style={{ color: featured.palette.accent, borderColor: `${featured.palette.accent}55` }}>
                  {featured.category}
                </span>
              </div>
              <h3 className="font-display text-4xl leading-[0.95] text-ink sm:text-5xl">{featured.title}</h3>
              <p className="max-w-2xl text-[15px] leading-relaxed text-mute">{featured.blurb}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mute">
                <span className="inline-flex items-center gap-1.5"><IconCalendar size={13} /> {fmtDate(featured.date)}</span>
                <span className="inline-flex items-center gap-1.5"><IconHeadphones size={13} /> {fmtPlays(featured.plays)} plays</span>
                <span className="inline-flex items-center gap-1.5"><IconMic size={13} /> {featured.guest?.name}</span>
                <span className="text-teal">{fmtDuration(featured.duration)} min</span>
              </div>
              <MiniPlayer ep={featured} />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <div className="flex items-center gap-3">
                  <ShareRow
                    text={`🎧 "${featured.title}" — Wisdom In The Streets Podcast with Marvin Marbell. Real wisdom. Real streets. Real talk.`}
                    url={`${window.location.origin}${window.location.pathname}#/episode/${featured.id}`}
                  />
                  <button
                    onClick={() => toggleFavorite(featured.id)}
                    aria-label={favFeat ? "Remove from favorites" : "Save episode to favorites"}
                    className={`grid h-9 w-9 place-items-center rounded-full border transition-all hover:scale-110 ${
                      favFeat ? "border-ember/50 text-ember" : "border-line text-mute hover:text-ember"
                    }`}
                  >
                    <IconHeart size={15} filled={favFeat} />
                  </button>
                </div>
                <Link to={`/episode/${featured.id}`} className="font-head text-xs font-bold uppercase tracking-widest text-teal underline-offset-4 transition hover:text-ember hover:underline">
                  Show notes & timestamps →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= QUOTE OF THE WEEK ================= */}
      <section className="relative overflow-hidden border-y border-line bg-panel/40 py-24">
        <span className="font-display text-hollow pointer-events-none absolute -top-10 right-0 select-none text-[220px] leading-none opacity-40 sm:text-[320px]" aria-hidden="true">
          “”
        </span>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
              <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" /> Quote of the week
            </p>
          </Reveal>
          <div className="mt-8 min-h-[190px] sm:min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={weekIdx}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -22, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <IconQuote size={44} className="text-ember" />
                <blockquote className="font-head mt-5 text-2xl font-semibold leading-snug text-ink sm:text-3xl lg:text-[34px]">
                  {weekQuote.text}
                </blockquote>
                <figcaption className="mt-6 text-sm text-mute">
                  — <span className="font-semibold text-teal">{weekQuote.author}</span>, {weekQuote.episode} ·{" "}
                  <Link to="/quotes" className="underline decoration-ember/60 underline-offset-4 transition hover:text-ember">browse all 20 quotes</Link>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Quote selector">
            {WEEK_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setWeekIdx(i)}
                aria-label={`Show quote ${i + 1}`}
                aria-selected={i === weekIdx}
                role="tab"
                className={`h-1.5 rounded-full transition-all duration-300 ${i === weekIdx ? "w-8 bg-ember" : "w-3 bg-raise hover:bg-mute"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {[
            { icon: <IconMic size={22} />, ...STATS[0] },
            { icon: <IconHeadphones size={22} />, ...STATS[1] },
            { icon: <IconGlobe size={22} />, ...STATS[2] },
            { icon: <IconUsers size={22} />, ...STATS[3] },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-panel p-7 transition-colors hover:bg-raise sm:p-9">
              <span className="text-teal">{s.icon}</span>
              <p className="font-display mt-4 text-4xl tracking-wide text-ink sm:text-5xl">
                <CountUpStat value={s.value} suffix={s.suffix} />
              </p>
              <p className="font-head mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= LATEST EPISODES ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHead
          kicker="From the archive"
          title="RECENT EPISODES"
          right={
            <Link to="/episodes" className="font-head group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal transition hover:text-ember">
              Browse all {EPISODES.length} <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((ep, i) => (
            <EpisodeCard key={ep.id} ep={ep} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </section>

      {/* ================= PLATFORMS ================= */}
      <section className="border-y border-line bg-panel/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead kicker="One mic, every app" title="LISTEN WHEREVER YOU ARE" />
          <Reveal className="mt-10 max-w-3xl">
            <PlatformRow />
            <p className="mt-5 text-sm text-mute">
              Follow on any platform and never miss a Friday drop. RSS works with Overcast, Pocket Casts, Castro and friends.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead kicker="From the community" title="WHAT LISTENERS CARRY HOME" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.09}>
              <figure
                className="flex h-full flex-col rounded-xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-glow"
                style={{ rotate: `${[-2, 1.5, -1, 2.5][i % 4]}deg` }}
              >
                <div className="flex gap-1">{[...Array(5)].map((_, j) => <Star key={j} />)}</div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <p className="font-head text-sm font-semibold text-teal">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-mute"><IconPin size={12} /> {t.place}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TEASERS: MERCH + LIVE ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-xl border border-line bg-panel p-8 transition hover:border-teal/40">
              <div className="absolute -right-8 -top-8 text-teal opacity-[0.07] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true">
                <IconMic size={220} />
              </div>
              <p className="font-head text-[11px] font-bold uppercase tracking-[0.24em] text-ember">Coming soon</p>
              <h3 className="font-display mt-3 text-4xl text-ink sm:text-5xl">WITS MERCH</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
                Hoodies, tees and tote bags with the quotes you already live by. Limited street runs — when it's gone, it's gone.
              </p>
              <button
                onClick={() => toast("You're on the merch waitlist ✓", "success")}
                className="font-head mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-teal/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-teal transition-all hover:-translate-y-0.5 hover:bg-teal hover:text-[#0a192f]"
              >
                Join the waitlist <IconArrowRight size={14} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-xl border border-line p-8 transition hover:border-ember/50">
              <img src={IMAGES.street} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/70 to-[#0a192f]/30" aria-hidden="true" />
              <div className="relative">
                <p className="font-head text-[11px] font-bold uppercase tracking-[0.24em] text-teal">Events · This season</p>
                <h3 className="font-display mt-3 text-4xl text-ink sm:text-5xl">LIVE STREET SESSIONS</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
                  Chairs in a circle, a mic in the middle. First open-air recording in Jamestown — the community asks the questions.
                </p>
                <button
                  onClick={() => toast("We'll ping you when tickets open ✓", "success")}
                  className="font-head mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ember px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:shadow-ember"
                >
                  Get notified <IconArrowRight size={14} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= NEWSLETTER CTA ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-line bg-panel px-6 py-14 sm:px-12 lg:px-16">
            <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true" style={{ background: "repeating-linear-gradient(-45deg, var(--wits-teal) 0 1px, transparent 1px 14px)" }} />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="font-head text-[11px] font-bold uppercase tracking-[0.24em] text-ember">The Friday Digest</p>
                <h3 className="font-display mt-3 text-5xl leading-[0.92] text-ink sm:text-6xl">
                  WISDOM,<br />DELIVERED <span className="text-hollow">FRIDAYS</span>
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
                  One email a week: the new episode, one quote worth printing, and what the corner is talking about. 85,000+ readers already in.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../store";
import { EPISODES, episodeById, fmtClock, fmtDate, fmtDuration, fmtPlays } from "../data/content";
import { CoverArt, EpisodeCard, ShareRow } from "../components/cards";
import { MiniPlayer } from "../components/PlayerBar";
import { Reveal, usePageMeta } from "../components/ui";
import {
  IconArrowLeft,
  IconBookmark,
  IconCalendar,
  IconChevronDown,
  IconClose,
  IconDownload,
  IconExternal,
  IconHeadphones,
  IconHeart,
  IconMic,
  IconPlay,
} from "../components/icons";

export default function EpisodeDetail() {
  const { id } = useParams();
  const ep = episodeById(Number(id));
  const [params] = useSearchParams();

  const playEpisode = useStore((s) => s.playEpisode);
  const current = useStore((s) => s.current);
  const currentTime = useStore((s) => s.currentTime);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const bookmarks = useStore((s) => s.bookmarks);
  const addBookmark = useStore((s) => s.addBookmark);
  const removeBookmark = useStore((s) => s.removeBookmark);
  const seek = useStore((s) => s.seek);
  const toast = useStore((s) => s.toast);

  usePageMeta(ep ? `Episode ${ep.num} — ${ep.title}` : "Episode not found", ep?.blurb);

  /* deep-link: /#/episode/4?t=95 starts at 1:35 */
  const tParam = Number(params.get("t")) || 0;
  useEffect(() => {
    if (ep && tParam > 0) playEpisode(ep, undefined, tParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep?.id, tParam]);

  const related = useMemo(() => {
    if (!ep) return [];
    return EPISODES.filter((e) => e.id !== ep.id)
      .sort((a, b) => Number(b.category === ep.category) - Number(a.category === ep.category) || b.plays - a.plays)
      .slice(0, 3);
  }, [ep]);

  if (!ep) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 pt-28 text-center">
        <div>
          <p className="font-display text-7xl text-teal">EPISODE ??</p>
          <p className="mt-3 text-mute">That episode doesn't exist — the corner never said it.</p>
          <Link to="/episodes" className="font-head mt-6 inline-block rounded-full bg-teal px-7 py-3 text-xs font-bold uppercase tracking-widest text-[#0a192f]">
            Back to all episodes
          </Link>
        </div>
      </div>
    );
  }

  const fav = favorites.includes(ep.id);
  const epBookmarks = bookmarks[ep.id] ?? [];
  const isCurrent = current?.id === ep.id;
  const activeNote = isCurrent
    ? ep.showNotes.reduce((acc, n, i) => (currentTime >= n.time - 1 ? i : acc), -1)
    : -1;
  const url = `${window.location.origin}${window.location.pathname}#/episode/${ep.id}`;

  const download = async () => {
    toast("Preparing your download…", "info");
    try {
      const res = await fetch(ep.audioUrl);
      const blob = await res.blob();
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = `WITS-EP${ep.num}-${ep.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp3`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 5000);
      toast("Episode downloaded ✓", "success");
    } catch {
      window.open(ep.audioUrl, "_blank", "noopener");
      toast("Opened audio in a new tab instead", "info");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <Link to="/episodes" className="font-head group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute transition hover:text-teal">
        <IconArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> All episodes
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-14">
        {/* ---------- sticky left rail ---------- */}
        <div className="space-y-6 self-start lg:sticky lg:top-24">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-line shadow-2xl">
              <CoverArt ep={ep} className="aspect-square" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <MiniPlayer ep={ep} />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => toggleFavorite(ep.id)}
                aria-pressed={fav}
                className={`font-head flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
                  fav ? "border-ember/60 bg-ember/10 text-ember" : "border-line text-mute hover:border-ember/50 hover:text-ember"
                }`}
              >
                <IconHeart size={14} filled={fav} /> {fav ? "Saved" : "Favorite"}
              </button>
              <button
                onClick={() => {
                  if (!isCurrent) {
                    toast("Press play first — then bookmark the exact moment", "info");
                    return;
                  }
                  addBookmark(ep.id, currentTime);
                }}
                className="font-head flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal"
              >
                <IconBookmark size={14} /> Bookmark
              </button>
              <button
                onClick={download}
                className="font-head flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal"
              >
                <IconDownload size={14} /> Download
              </button>
              <a
                href={ep.audioUrl}
                target="_blank"
                rel="noreferrer"
                className="font-head flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal"
              >
                <IconExternal size={14} /> Raw audio
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex items-center justify-between rounded-xl border border-line bg-panel px-4 py-3.5">
              <p className="font-head text-[11px] font-bold uppercase tracking-widest text-mute">Share this episode</p>
              <ShareRow compact text={`🎧 "${ep.title}" — Wisdom In The Streets with Marvin Marbell`} url={url} />
            </div>
          </Reveal>

          {epBookmarks.length > 0 && (
            <Reveal>
              <div className="rounded-xl border border-line bg-panel p-4">
                <p className="font-head text-[11px] font-bold uppercase tracking-widest text-teal">Your bookmarks</p>
                <ul className="mt-3 space-y-2">
                  {epBookmarks.map((t) => (
                    <li key={t} className="group flex items-center justify-between gap-2">
                      <button
                        onClick={() => playEpisode(ep, undefined, t)}
                        className="flex items-center gap-2.5 text-sm text-ink transition hover:text-teal"
                      >
                        <span className="font-display w-14 rounded bg-raise px-1.5 py-0.5 text-center text-sm tracking-wider text-teal">{fmtClock(t)}</span>
                        <IconPlay size={11} className="opacity-0 transition group-hover:opacity-100" />
                      </button>
                      <button onClick={() => removeBookmark(ep.id, t)} aria-label={`Remove bookmark at ${fmtClock(t)}`} className="text-mute transition hover:text-ember">
                        <IconClose size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        {/* ---------- main column ---------- */}
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-xl tracking-[0.14em] text-teal">EPISODE {ep.num}</span>
              <span className="rounded-full border px-3 py-1 font-head text-[10px] font-semibold uppercase tracking-widest" style={{ color: ep.palette.accent, borderColor: `${ep.palette.accent}55` }}>
                {ep.category}
              </span>
              {ep.tags.map((t) => (
                <span key={t} className="rounded bg-raise px-2 py-0.5 text-[11px] text-mute">#{t}</span>
              ))}
            </div>
            <h1 className="font-display mt-4 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl lg:text-7xl">{ep.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mute">
              <span className="inline-flex items-center gap-1.5"><IconCalendar size={14} /> {fmtDate(ep.date)}</span>
              <span className="inline-flex items-center gap-1.5"><IconHeadphones size={14} /> {fmtPlays(ep.plays)} plays</span>
              <span className="inline-flex items-center gap-1.5"><IconMic size={14} /> {ep.guest ? ep.guest.name : "Solo with Marvin"}</span>
              <span className="font-semibold text-teal">{fmtDuration(ep.duration)}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-7 border-l-2 border-ember pl-5 text-lg font-medium leading-relaxed text-ink">{ep.blurb}</p>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-mute">{ep.description}</p>
          </Reveal>

          {/* show notes */}
          <Reveal delay={0.12} className="mt-12">
            <h2 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">SHOW NOTES <span className="text-hollow">&amp; TIMESTAMPS</span></h2>
            <p className="mt-2 text-sm text-mute">Tap a chapter to jump straight there — the player takes over.</p>
            <ol className="mt-6 space-y-2.5">
              {ep.showNotes.map((n, i) => {
                const active = i === activeNote;
                return (
                  <li key={`${n.time}-${i}`}>
                    <button
                      onClick={() => playEpisode(ep, undefined, n.time)}
                      className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 ${
                        active ? "border-teal/60 bg-teal/[0.07] shadow-glow" : "border-line bg-panel hover:border-teal/40"
                      }`}
                    >
                      <span className={`font-display w-16 shrink-0 rounded-md px-2 py-1 text-center text-lg tracking-wider transition ${active ? "bg-teal text-[#0a192f]" : "bg-raise text-teal"}`}>
                        {fmtClock(n.time)}
                      </span>
                      <span className="flex-1 font-head text-sm font-semibold text-ink">{n.label}</span>
                      <IconPlay size={14} className={`shrink-0 transition ${active ? "text-teal opacity-100" : "text-mute opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          {/* guest */}
          {ep.guest && (
            <Reveal delay={0.14} className="mt-12">
              <h2 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">ON THE CORNER: <span className="text-hollow">{ep.guest.name.toUpperCase()}</span></h2>
              <div className="mt-6 flex flex-col gap-5 rounded-xl border border-line bg-panel p-6 sm:flex-row sm:items-start sm:p-7">
                <div
                  className="font-display grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 text-3xl"
                  style={{ borderColor: ep.palette.accent, background: `linear-gradient(142deg, ${ep.palette.a}, ${ep.palette.b})`, color: ep.palette.accent }}
                  aria-hidden="true"
                >
                  {ep.guest.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-head text-lg font-bold text-ink">{ep.guest.name}</p>
                  <p className="font-head text-xs font-semibold uppercase tracking-widest text-teal">{ep.guest.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{ep.guest.bio}</p>
                  <a
                    href={ep.guest.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-head mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal transition hover:text-ember"
                  >
                    {ep.guest.handle} <IconExternal size={13} />
                  </a>
                </div>
              </div>
            </Reveal>
          )}

          {/* transcript excerpt */}
          <Reveal delay={0.16} className="mt-12">
            <details className="group rounded-xl border border-line bg-panel">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-head text-sm font-bold uppercase tracking-widest text-ink">Read the transcript (excerpt)</span>
                <IconChevronDown size={16} className="text-mute transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="space-y-4 border-t border-line px-6 py-5 text-sm leading-relaxed text-mute">
                <p>
                  <strong className="font-semibold text-teal">Marvin:</strong> {ep.blurb} That's the whole episode in one breath — but let's
                  sit with it, because the corner never rushes a good lesson.
                </p>
                <p>
                  <strong className="font-semibold text-teal">{ep.guest ? ep.guest.name.split(" ")[0] : "Marvin"}:</strong> People think wisdom is
                  something you fetch — from school, from books, from someone's highlight reel. It's not. It's something you stay for. You stay
                  through the awkward season, the broke season, the quiet season. And one day you realise the lesson was sitting next to you the whole time.
                </p>
                <p className="text-xs uppercase tracking-widest">Full transcripts ship with every episode for season two — better for search, better for skimmers.</p>
              </div>
            </details>
          </Reveal>
        </div>
      </div>

      {/* related */}
      <div className="mt-20">
        <Reveal>
          <h2 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">KEEP <span className="text-hollow">LISTENING</span></h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((e, i) => (
            <EpisodeCard key={e.id} ep={e} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}

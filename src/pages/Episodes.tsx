import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store";
import { EPISODES, type Category } from "../data/content";
import { EpisodeCard } from "../components/cards";
import { Reveal, usePageMeta } from "../components/ui";
import { IconHeart, IconMic, IconSearch } from "../components/icons";

const CATEGORIES: ("All" | Category)[] = ["All", "Motivation", "Business", "Life", "Relationships"];
type Sort = "newest" | "oldest" | "popular";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-line bg-panel">
      <div className="aspect-[16/10] bg-raise" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/5 rounded bg-raise" />
        <div className="h-5 w-4/5 rounded bg-raise" />
        <div className="h-3 w-3/5 rounded bg-raise" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded bg-raise" />
          <div className="h-5 w-16 rounded bg-raise" />
        </div>
      </div>
    </div>
  );
}

export default function Episodes() {
  usePageMeta("Episodes — Browse every conversation", "All episodes of Wisdom In The Streets, hosted by Marvin Marbell. Filter by topic, search guests, and press play.");

  const favorites = useStore((s) => s.favorites);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"All" | Category | "Favorites">("All");
  const [sort, setSort] = useState<Sort>("newest");
  const [loading, setLoading] = useState(true);

  /* simulate an API round-trip so skeletons show (data would come from /api/episodes) */
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    let list = [...EPISODES];
    if (cat === "Favorites") list = list.filter((e) => favorites.includes(e.id));
    else if (cat !== "All") list = list.filter((e) => e.category === cat);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.guest?.name.toLowerCase().includes(q) ?? false)
      );
    }
    if (sort === "newest") list.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") list.sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "popular") list.sort((a, b) => b.plays - a.plays);
    return list;
  }, [query, cat, sort, favorites]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      {/* page head */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
            <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" /> The archive
          </p>
          <h1 className="font-display mt-3 text-6xl leading-[0.9] tracking-wide text-ink sm:text-7xl lg:text-8xl">
            EVERY <span className="text-hollow">EPISODE</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] text-mute">
            {EPISODES.length} conversations from the corner — motivation, money, family and faith. Press play, take notes, pass it on.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="pb-2">
          <p className="font-display text-7xl text-raise sm:text-8xl" aria-hidden="true">
            {EPISODES.length.toString().padStart(2, "0")}
          </p>
        </Reveal>
      </div>

      {/* controls */}
      <Reveal delay={0.1} className="sticky top-16 z-30 mt-10 rounded-xl border border-line bg-base/90 p-4 backdrop-blur-md lg:top-[72px]">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"><IconSearch size={16} /></span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, guest or tag…"
              aria-label="Search episodes"
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-mute/70 transition focus:border-teal/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            {[...CATEGORIES, "Favorites" as const].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-head text-[11px] font-semibold uppercase tracking-widest transition-all ${
                  cat === c
                    ? "border-teal/60 bg-teal/10 text-teal"
                    : "border-line text-mute hover:border-teal/40 hover:text-ink"
                }`}
              >
                {c === "Favorites" && <IconHeart size={11} filled={cat === "Favorites"} />}
                {c}
              </button>
            ))}
          </div>
          <div className="relative">
            <label htmlFor="sort" className="sr-only">Sort episodes</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer appearance-none rounded-lg border border-line bg-panel py-2.5 pl-4 pr-9 font-head text-[12px] font-semibold uppercase tracking-widest text-ink transition focus:border-teal/60 focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most popular</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M5.5 9l6.5 6.5L18.5 9" />
            </svg>
          </div>
        </div>
      </Reveal>

      {/* results meta */}
      <p className="mt-6 text-xs uppercase tracking-widest text-mute" aria-live="polite">
        {loading ? "Loading the archive…" : `${results.length} episode${results.length === 1 ? "" : "s"} found`}
      </p>

      {/* grid */}
      {loading ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((ep, i) => (
            <EpisodeCard key={ep.id} ep={ep} delay={(i % 3) * 0.07} />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid place-items-center rounded-xl border border-dashed border-line bg-panel/50 px-6 py-20 text-center">
          <span className="text-mute"><IconMic size={44} /></span>
          <p className="font-display mt-5 text-3xl text-ink">THE STREET IS QUIET</p>
          <p className="mt-2 max-w-sm text-sm text-mute">
            {cat === "Favorites" && !query
              ? "No favorites yet — tap the heart on any episode to keep it close."
              : "No episodes match that search. Try another word or clear the filters."}
          </p>
          <button
            onClick={() => { setQuery(""); setCat("All"); }}
            className="font-head mt-6 rounded-full border border-teal/50 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-teal transition hover:bg-teal hover:text-[#0a192f]"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

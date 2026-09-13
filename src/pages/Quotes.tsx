import { useMemo, useState } from "react";
import { QUOTES, QUOTE_TOPICS } from "../data/content";
import { QuoteCard } from "../components/cards";
import { Reveal, usePageMeta } from "../components/ui";
import { IconQuote } from "../components/icons";

export default function Quotes() {
  usePageMeta("Quotes Library — 20 lines worth printing", "Twenty of the sharpest lines from Wisdom In The Streets. Copy them, share them, or download them as images.");

  const [topic, setTopic] = useState("All");
  const list = useMemo(() => (topic === "All" ? QUOTES : QUOTES.filter((q) => q.topic === topic)), [topic]);
  const opener = QUOTES[19];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      {/* opener */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-panel px-6 py-14 sm:px-12 lg:px-16">
        <span className="font-display text-hollow pointer-events-none absolute -right-6 -top-14 select-none text-[260px] leading-none opacity-30 sm:text-[360px]" aria-hidden="true">
          “
        </span>
        <Reveal>
          <IconQuote size={40} className="text-ember" />
          <blockquote className="font-head relative mt-5 max-w-3xl text-2xl font-semibold leading-snug text-ink sm:text-3xl lg:text-4xl">
            {opener.text}
          </blockquote>
          <p className="relative mt-5 text-sm text-mute">
            — <span className="font-semibold text-teal">{opener.author}</span>, {opener.episode}
          </p>
        </Reveal>
      </div>

      {/* head + filters */}
      <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
            <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" /> The library
          </p>
          <h1 className="font-display mt-3 text-6xl leading-[0.9] tracking-wide text-ink sm:text-7xl">
            LINES WORTH <span className="text-hollow">PRINTING</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm text-mute">
            Every quote is timestamped to its episode. Copy it, share it, or download it as a shareable image.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="sticky top-16 z-30 mt-8 rounded-xl border border-line bg-base/90 p-4 backdrop-blur-md lg:top-[72px]">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter quotes by topic">
          {QUOTE_TOPICS.map((t) => {
            const count = t === "All" ? QUOTES.length : QUOTES.filter((q) => q.topic === t).length;
            return (
              <button
                key={t}
                onClick={() => setTopic(t)}
                aria-pressed={topic === t}
                className={`rounded-full border px-3.5 py-1.5 font-head text-[11px] font-semibold uppercase tracking-widest transition-all ${
                  topic === t ? "border-ember/60 bg-ember/10 text-ember" : "border-line text-mute hover:border-ember/40 hover:text-ink"
                }`}
              >
                {t} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* masonry */}
      <div key={topic} className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {list.map((q, i) => (
          <div key={q.id} className="mb-6">
            <QuoteCard q={q} delay={(i % 3) * 0.06} />
          </div>
        ))}
      </div>

      <Reveal className="mt-10 rounded-xl border border-dashed border-line bg-panel/50 p-8 text-center">
        <p className="font-display text-3xl tracking-wide text-ink">HEARD A LINE THAT HIT DIFFERENT?</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-mute">
          Send us your favourite timestamp and we'll add it to the library with your name in the liner notes.
        </p>
      </Reveal>
    </div>
  );
}

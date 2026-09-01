import { motion } from "framer-motion";
import { CONTACT_EMAIL, HOST, IMAGES, SOCIALS, TIMELINE, VALUES } from "../data/content";
import { socialIcon } from "../components/chrome";
import { CountUpStat, Reveal, SectionHead, usePageMeta } from "../components/ui";
import { IconBook, IconMail, IconMic, IconSignpost, IconStepUp } from "../components/icons";

const VALUE_ICONS = [<IconMic size={26} />, <IconStepUp size={26} />, <IconBook size={26} />, <IconSignpost size={26} />];

export default function About() {
  usePageMeta("About — The man on the corner", "Meet Marvin Marbell, host of Wisdom In The Streets — the story, the mission and the values behind the microphone.");

  return (
    <div className="pt-28 lg:pt-36">
      {/* ================= HOST INTRO ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* portrait */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-[400px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-ember/40 spin-slow" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-full border-4 border-ember shadow-ember">
                  <img
                    src={IMAGES.host}
                    alt="Marvin Marbell, host of Wisdom In The Streets, in the podcast studio"
                    className="kenburns aspect-[4/5] w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#0a192f]/70 via-transparent to-transparent" aria-hidden="true" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-teal/40 bg-base px-5 py-2 shadow-xl">
                  <p className="font-head text-[11px] font-bold uppercase tracking-[0.22em] text-teal">Marvin Marbell · Host</p>
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* bio */}
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
                <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" /> The man on the corner
              </p>
              <h1 className="font-display mt-3 text-6xl leading-[0.88] tracking-wide text-ink sm:text-7xl lg:text-8xl">
                MARVIN<br /><span className="text-hollow">MARBELL</span>
              </h1>
              <p className="font-head mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-ember">{HOST.tagline}</p>
            </Reveal>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-mute">
              {HOST.bio.map((p, i) => (
                <Reveal key={i} delay={0.08 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.handle}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute transition-all hover:-translate-y-1 hover:border-teal/50 hover:text-teal"
                  >
                    {socialIcon(s.label, 16)}
                  </a>
                ))}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-head inline-flex items-center gap-2 rounded-full border border-ember/50 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-ember transition-all hover:-translate-y-0.5 hover:bg-ember hover:text-[#0a192f]">
                  <IconMail size={14} /> Work with Marvin
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* mission / vision */}
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-teal/30 bg-panel p-8 transition hover:shadow-glow">
              <p className="font-display text-3xl tracking-wide text-teal">MISSION</p>
              <p className="font-head mt-4 text-lg font-semibold leading-relaxed text-ink">{HOST.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-xl border border-ember/30 bg-panel p-8 transition hover:shadow-ember">
              <p className="font-display text-3xl tracking-wide text-ember">VISION</p>
              <p className="font-head mt-4 text-lg font-semibold leading-relaxed text-ink">{HOST.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= IMPACT NUMBERS ================= */}
      <section className="mt-20 border-y border-line bg-panel/40 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { v: 10, s: "", l: "Episodes & counting" },
            { v: 256400, s: "+", l: "Plays across platforms" },
            { v: 42, s: "", l: "Countries listening" },
            { v: 300, s: "+", l: "Voice notes from listeners" },
          ].map((x, i) => (
            <Reveal key={x.l} delay={i * 0.07}>
              <p className="font-display text-5xl text-ink sm:text-6xl"><CountUpStat value={x.v} suffix={x.s} /></p>
              <p className="font-head mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">{x.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= STORY TIMELINE ================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead kicker="Origin story" title="FROM VOICE NOTES TO 42 COUNTRIES" />
        <div className="relative mt-14 ml-3 border-l-2 border-line pl-8 sm:ml-6 sm:pl-12">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.05} className="relative pb-12 last:pb-0">
              <span
                className={`absolute -left-[42px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 sm:-left-[58px] ${
                  t.year === "Next" ? "border-ember bg-ember/20" : "border-teal bg-base"
                }`}
                aria-hidden="true"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${t.year === "Next" ? "bg-ember" : "bg-teal"}`} />
              </span>
              <p className={`font-display text-4xl tracking-wide sm:text-5xl ${t.year === "Next" ? "text-ember" : "text-teal"}`}>{t.year}</p>
              <h3 className="font-head mt-2 text-xl font-bold text-ink">{t.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">{t.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="border-t border-line bg-panel/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead kicker="How we record" title="FOUR RULES OF THE CORNER" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group h-full rounded-xl border border-line bg-panel p-7 transition-all duration-300 hover:-translate-y-2 hover:border-teal/40 hover:shadow-glow">
                  <span className="inline-grid h-14 w-14 place-items-center rounded-xl border border-line bg-base text-teal transition-all duration-300 group-hover:rotate-6 group-hover:border-teal/50 group-hover:text-ember">
                    {VALUE_ICONS[i]}
                  </span>
                  <p className="font-display mt-5 text-2xl leading-tight tracking-wide text-ink">{v.title.toUpperCase()}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{v.text}</p>
                  <span className="font-display mt-5 block text-4xl text-raise transition-colors group-hover:text-teal/30" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ROADMAP ================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead kicker="Beyond the mic" title="WHERE THE STREET IS HEADING" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: "Season 02", d: "Twelve new episodes — including the first listener-only AMA episode and a fatherhood mini-series." },
            { t: "WITS Merch", d: "Quote hoodies, tees and totes in limited street runs. Waitlist opens with the season." },
            { t: "Live Street Sessions", d: "Open-air recordings in Jamestown, Kumasi and Tamale. Chairs in a circle — you bring the questions." },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-dashed border-line bg-panel/60 p-6 transition hover:border-teal/50">
                <p className="font-head text-[11px] font-bold uppercase tracking-widest text-ember">In the works</p>
                <h3 className="font-display mt-2 text-2xl tracking-wide text-ink">{x.t.toUpperCase()}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mute">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

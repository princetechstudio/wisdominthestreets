import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { useCms } from "./cms";
import { PLATFORMS, WEEKLY, fmtPlays, timeAgo } from "./data";
import { CountUp, EmptyState, IcCal, IcEdit, IcGear, IcInbox, IcMic, IcPlus, IcQuote, IcUp, IcUsers, Sparkline } from "./ui";

/* custom chart tooltip */
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-raise px-3.5 py-2.5 text-xs shadow-lift">
      <p className="font-head mb-1.5 font-bold uppercase tracking-widest text-mute">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="tnum flex items-center gap-2 py-0.5 font-medium text-ink">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="text-teal">{fmtPlays(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const episodes = useCms((s) => s.episodes);
  const quotes = useCms((s) => s.quotes);
  const messages = useCms((s) => s.messages);
  const activity = useCms((s) => s.activity);

  const published = episodes.filter((e) => e.status === "published");
  const drafts = episodes.filter((e) => e.status === "draft");
  const unread = messages.filter((m) => !m.read && !m.archived).length;
  const totalPlays = published.reduce((a, e) => a + e.plays, 0);
  const subs = WEEKLY[WEEKLY.length - 1].subs;
  const top = [...published].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const maxPlays = top[0]?.plays ?? 1;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const activityIcon = (kind: string) =>
    kind === "episode" ? <IcMic size={13} /> : kind === "quote" ? <IcQuote size={13} /> : kind === "message" ? <IcInbox size={13} /> : <IcGear size={13} />;
  const activityColor = (kind: string) =>
    kind === "episode" ? "bg-teal/15 text-teal" : kind === "quote" ? "bg-ember/15 text-ember" : kind === "message" ? "bg-amber/15 text-amber" : "bg-raise text-mute";

  const kpis = [
    { label: "Total plays", value: totalPlays, compact: true, delta: "+12.4%", spark: WEEKLY.slice(-8).map((w) => w.plays), color: "#64ffda" },
    { label: "Subscribers", value: subs, compact: true, delta: "+8.1%", spark: WEEKLY.slice(-8).map((w) => w.subs), color: "#ff6b35" },
    { label: "Episodes live", value: published.length, compact: false, delta: `${drafts.length} in drafts`, spark: [6, 6, 7, 7, 8, 8, 9, published.length], color: "#ffd166" },
    { label: "Avg completion", value: 68, compact: false, suffix: "%", delta: "+3.2 pts", spark: [58, 61, 60, 63, 64, 66, 65, 68], color: "#64ffda" },
  ];

  return (
    <div className="space-y-5">
      {/* command strip */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-head text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
            {format(new Date(), "EEEE, MMMM d")} · console overview
          </p>
          <h1 className="font-display mt-1 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl">
            {greeting}, <span className="text-ember">MARVIN</span>
          </h1>
          <p className="mt-2 text-sm text-mute">
            {unread > 0 ? (
              <><span className="font-semibold text-amber">{unread} unread message{unread > 1 ? "s" : ""}</span> and {drafts.length} draft{drafts.length === 1 ? "" : "s"} waiting on you.</>
            ) : (
              <>Inbox clear. {drafts.length} draft{drafts.length === 1 ? "" : "s"} in the pipeline.</>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate("/episodes", { state: { new: true } })}
          className="font-head group inline-flex items-center gap-2.5 rounded-lg bg-ember px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0a192f] shadow-ember transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          <IcPlus size={15} className="transition-transform group-hover:rotate-90" /> New episode
        </button>
      </motion.div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-panel lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`group relative p-5 transition-colors hover:bg-raise/50 ${i > 0 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-head text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">{k.label}</p>
              <IcUp size={12} className="text-teal" />
            </div>
            <p className="font-display mt-2 text-4xl tracking-wide text-ink sm:text-[42px]">
              <CountUp value={k.value} compact={"compact" in k ? k.compact : false} suffix={"suffix" in k ? (k.suffix as string) : ""} />
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className={`rounded-full px-2 py-0.5 font-head text-[10px] font-bold uppercase tracking-widest ${k.delta.startsWith("+") ? "bg-teal/10 text-teal" : "bg-amber/10 text-amber"}`}>{k.delta}</span>
              <Sparkline points={k.spark} color={k.color} />
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* audience chart */}
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-xl border border-line bg-panel p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl tracking-wide text-ink">AUDIENCE SIGNAL</h2>
              <p className="mt-0.5 text-xs text-mute">Weekly plays vs subscribers · last 12 weeks</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-head font-semibold uppercase tracking-widest text-mute">
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-teal" /> Plays</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-ember" /> Subscribers</span>
            </div>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY} margin={{ top: 6, right: 4, left: -6, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64ffda" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#64ffda" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,255,218,0.07)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#8892b0", fontSize: 11, fontFamily: "Poppins" }} tickLine={false} axisLine={false} minTickGap={28} />
                <YAxis tickFormatter={(v: number) => fmtPlays(v)} tick={{ fill: "#8892b0", fontSize: 11, fontFamily: "Poppins" }} tickLine={false} axisLine={false} width={46} />
                <Tooltip content={<ChartTip />} cursor={{ stroke: "rgba(100,255,218,0.35)" }} />
                <Area type="monotone" dataKey="subs" name="Subscribers" stroke="#ff6b35" strokeWidth={2} fill="url(#gSubs)" />
                <Area type="monotone" dataKey="plays" name="Plays" stroke="#64ffda" strokeWidth={2} fill="url(#gPlays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* right column */}
        <div className="space-y-5">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="rounded-xl border border-line bg-panel p-5">
            <h2 className="font-display text-2xl tracking-wide text-ink">WHERE THEY LISTEN</h2>
            <ul className="mt-4 space-y-4">
              {PLATFORMS.map((p, i) => (
                <li key={p.name}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-head font-semibold text-ink">{p.name}</span>
                    <span className="tnum font-bold" style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sunken">
                    <div className="bar-grow h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color, animationDelay: `${0.2 + i * 0.12}s` }} />
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className={`rounded-xl border p-5 ${drafts.length ? "border-amber/40 bg-amber/[0.05]" : "border-line bg-panel"}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide text-ink">IN THE OVEN</h2>
              <span className={`rounded-full px-2.5 py-1 font-head text-[10px] font-bold uppercase tracking-widest ${drafts.length ? "bg-amber/15 text-amber" : "bg-teal/10 text-teal"}`}>
                {drafts.length} draft{drafts.length === 1 ? "" : "s"}
              </span>
            </div>
            {drafts.length ? (
              <ul className="mt-3 space-y-2">
                {drafts.map((d) => (
                  <li key={d.id}>
                    <Link to="/episodes" className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-panel px-3.5 py-2.5 transition hover:border-amber/50">
                      <span className="min-w-0">
                        <span className="font-display block text-lg tracking-wide text-amber">EP {d.num}</span>
                        <span className="block truncate text-xs text-mute">{d.title}</span>
                      </span>
                      <IcEdit size={14} className="shrink-0 text-faint transition group-hover:text-amber" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-mute">Pipeline empty — the streets are fed. 🎙</p>
            )}
          </motion.section>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        {/* top episodes */}
        <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl border border-line bg-panel p-5 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide text-ink">TOP EPISODES</h2>
            <Link to="/episodes" className="font-head text-[11px] font-bold uppercase tracking-widest text-teal transition hover:text-ember">Manage all →</Link>
          </div>
          <ol className="mt-4 divide-y divide-line">
            {top.map((e, i) => (
              <li key={e.id} className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className={`font-display w-8 text-center text-2xl ${i === 0 ? "text-ember" : "text-faint"}`}>{i + 1}</span>
                <span className="h-9 w-9 shrink-0 rounded-lg" style={{ background: `linear-gradient(140deg, ${e.palette.a}, ${e.palette.b})`, boxShadow: `inset 0 0 0 1px ${e.palette.accent}44` }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink transition group-hover:text-teal">{e.title}</span>
                  <span className="block text-[11px] uppercase tracking-wider text-mute">EP {e.num} · {e.category}</span>
                </span>
                <span className="hidden w-28 sm:block">
                  <span className="block h-1 overflow-hidden rounded-full bg-sunken">
                    <span className="bar-grow block h-full rounded-full bg-teal" style={{ width: `${Math.round((e.plays / maxPlays) * 100)}%`, animationDelay: `${0.15 + i * 0.1}s` }} />
                  </span>
                </span>
                <span className="tnum w-16 text-right text-sm font-bold text-teal">{fmtPlays(e.plays)}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* activity */}
        <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-xl border border-line bg-panel p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide text-ink">CONTROL ROOM LOG</h2>
            <span className="tnum flex items-center gap-1.5 text-[11px] font-head font-semibold uppercase tracking-widest text-mute"><IcCal size={12} /> {activity.length} events</span>
          </div>
          {activity.length === 0 ? (
            <div className="mt-4"><EmptyState icon={<IcGear size={22} />} title="QUIET IN HERE" sub="Every publish, edit and listener message lands in this log." /></div>
          ) : (
            <ul className="mt-4 space-y-1">
              {activity.slice(0, 9).map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-raise/50">
                  <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${activityColor(a.kind)}`}>{activityIcon(a.kind)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{a.text}</span>
                    <span className="text-[11px] text-faint">{timeAgo(a.ts)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11px] text-faint">
            <IcUsers size={12} /> {quotes.length} quotes in library · {messages.length} conversations on file
          </p>
        </motion.section>
      </div>
    </div>
  );
}

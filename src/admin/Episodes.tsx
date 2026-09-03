import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCms } from "./cms";
import { CATEGORIES, PALETTES, fmtClock, fmtDate, fmtPlays, uid, type Category, type Episode, type ShowNote } from "./data";
import { Drawer, EmptyState, Field, IcClock, IcEdit, IcMic, IcPlus, IcSearch, Switch, TwoStepDelete, inputCls } from "./ui";

/* ---------------- form state ---------------- */
interface FormState {
  num: string;
  title: string;
  category: Category;
  guestName: string;
  guestRole: string;
  minutes: number;
  date: string;
  tags: string;
  paletteIdx: number;
  status: "published" | "draft";
  description: string;
  notes: { time: string; label: string }[];
}

const toSec = (s: string) => {
  const m = s.trim().match(/^(\d+):(\d{1,2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
};

const nextNum = (episodes: Episode[]) =>
  String(Math.max(0, ...episodes.map((e) => Number(e.num) || 0)) + 1).padStart(3, "0");

const blank = (episodes: Episode[]): FormState => ({
  num: nextNum(episodes),
  title: "",
  category: "Motivation",
  guestName: "",
  guestRole: "",
  minutes: 45,
  date: new Date().toISOString().slice(0, 10),
  tags: "",
  paletteIdx: episodes.length % PALETTES.length,
  status: "draft",
  description: "",
  notes: [{ time: "0:00", label: "Cold open" }],
});

const fromEp = (ep: Episode): FormState => ({
  num: ep.num,
  title: ep.title,
  category: ep.category,
  guestName: ep.guest?.name ?? "",
  guestRole: ep.guest?.role ?? "",
  minutes: Math.round(ep.duration / 60),
  date: ep.date.slice(0, 10),
  tags: ep.tags.join(", "),
  paletteIdx: Math.max(0, PALETTES.findIndex((p) => p.accent === ep.palette.accent)),
  status: ep.status,
  description: ep.description,
  notes: ep.showNotes.length ? ep.showNotes.map((n) => ({ time: fmtClock(n.time), label: n.label })) : [{ time: "0:00", label: "Cold open" }],
});

/* ---------------- editor drawer content ---------------- */
function EpisodeForm({ initial, existing, onDone }: { initial: FormState; existing?: Episode; onDone: () => void }) {
  const upsertEpisode = useCms((s) => s.upsertEpisode);
  const [f, setF] = useState(initial);
  const [err, setErr] = useState("");
  const up = (patch: Partial<FormState>) => setF((s) => ({ ...s, ...patch }));

  const save = () => {
    if (!f.title.trim()) {
      setErr("Give the episode a title — the corner needs one.");
      return;
    }
    if (f.minutes < 1) {
      setErr("Duration must be at least 1 minute.");
      return;
    }
    const notes: ShowNote[] = f.notes
      .filter((n) => n.label.trim())
      .map((n) => ({ time: toSec(n.time), label: n.label.trim() }))
      .sort((a, b) => a.time - b.time);
    upsertEpisode({
      id: existing?.id ?? uid(),
      num: f.num.trim() || nextNum([]),
      title: f.title.trim(),
      guest: f.guestName.trim() ? { name: f.guestName.trim(), role: f.guestRole.trim() || "Guest" } : undefined,
      category: f.category,
      duration: f.minutes * 60,
      date: f.date || new Date().toISOString().slice(0, 10),
      plays: existing?.plays ?? 0,
      status: f.status,
      tags: f.tags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean).slice(0, 5),
      description: f.description.trim(),
      showNotes: notes,
      palette: PALETTES[f.paletteIdx] ?? PALETTES[0],
    });
    onDone();
  };

  return (
    <div className="space-y-5">
      {err && (
        <p role="alert" className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-2.5 text-sm font-medium text-ember">{err}</p>
      )}

      <div className="grid grid-cols-[92px_1fr] gap-4">
        <Field label="Episode №">
          <input className={inputCls} value={f.num} onChange={(e) => up({ num: e.target.value })} aria-label="Episode number" />
        </Field>
        <Field label="Title">
          <input className={inputCls} value={f.title} onChange={(e) => up({ title: e.target.value })} placeholder="e.g. The Day I Almost Quit" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select className={inputCls} value={f.category} onChange={(e) => up({ category: e.target.value as Category })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <div className="grid grid-cols-2 gap-2">
            {(["draft", "published"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => up({ status: st })}
                aria-pressed={f.status === st}
                className={`rounded-lg border px-3 py-2.5 font-head text-[11px] font-bold uppercase tracking-widest transition ${
                  f.status === st
                    ? st === "published" ? "border-teal/60 bg-teal/10 text-teal" : "border-amber/60 bg-amber/10 text-amber"
                    : "border-line text-mute hover:text-ink"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Guest name" hint="optional">
          <input className={inputCls} value={f.guestName} onChange={(e) => up({ guestName: e.target.value })} placeholder="e.g. Ama Serwaa" />
        </Field>
        <Field label="Guest role" hint="optional">
          <input className={inputCls} value={f.guestRole} onChange={(e) => up({ guestRole: e.target.value })} placeholder="e.g. Financial coach" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Duration" hint="minutes">
          <input type="number" min={1} className={inputCls} value={f.minutes} onChange={(e) => up({ minutes: Number(e.target.value) })} />
        </Field>
        <Field label="Release date">
          <input type="date" className={inputCls} value={f.date} onChange={(e) => up({ date: e.target.value })} />
        </Field>
        <Field label="Tags" hint="comma sep.">
          <input className={inputCls} value={f.tags} onChange={(e) => up({ tags: e.target.value })} placeholder="hustle, craft" />
        </Field>
      </div>

      <Field label="Cover palette">
        <div className="flex gap-2.5" role="radiogroup" aria-label="Cover palette">
          {PALETTES.map((p, i) => (
            <button
              key={p.accent}
              type="button"
              role="radio"
              aria-checked={f.paletteIdx === i}
              onClick={() => up({ paletteIdx: i })}
              className={`h-11 flex-1 rounded-lg transition-all ${f.paletteIdx === i ? "scale-105 ring-2 ring-teal ring-offset-2 ring-offset-panel" : "opacity-70 hover:opacity-100"}`}
              style={{ background: `linear-gradient(140deg, ${p.a}, ${p.b})`, boxShadow: `inset 0 0 0 1px ${p.accent}66` }}
              aria-label={`Palette ${i + 1}`}
            />
          ))}
        </div>
      </Field>

      <Field label="Description">
        <textarea rows={3} className={`${inputCls} resize-y`} value={f.description} onChange={(e) => up({ description: e.target.value })} placeholder="One or two lines that sell the episode…" />
      </Field>

      <Field label="Show notes & timestamps" hint="m:ss format">
        <div className="space-y-2">
          {f.notes.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputCls} w-20 text-center`} value={n.time} onChange={(e) => up({ notes: f.notes.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)) })} aria-label={`Timestamp ${i + 1}`} />
              <input className={inputCls} value={n.label} onChange={(e) => up({ notes: f.notes.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} placeholder="Chapter label" aria-label={`Chapter label ${i + 1}`} />
              <button type="button" onClick={() => up({ notes: f.notes.filter((_, j) => j !== i) })} aria-label="Remove chapter" className="grid w-9 shrink-0 place-items-center rounded-lg border border-line text-faint transition hover:border-ember/60 hover:text-ember">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => up({ notes: [...f.notes, { time: "0:00", label: "" }] })} className="font-head flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal transition hover:text-ember">
            <IcPlus size={12} /> Add chapter
          </button>
        </div>
      </Field>

      <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t border-line bg-panel/95 px-6 py-4 backdrop-blur">
        <button onClick={onDone} className="font-head rounded-lg border border-line px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-mute transition hover:text-ink">Cancel</button>
        <button onClick={save} className="font-head rounded-lg bg-teal px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0a192f] shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110">
          {existing ? "Save changes" : "Create episode"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
type StatusTab = "all" | "published" | "draft";

export default function EpisodesAdmin() {
  const location = useLocation();
  const episodes = useCms((s) => s.episodes);
  const togglePublish = useCms((s) => s.togglePublish);
  const deleteEpisode = useCms((s) => s.deleteEpisode);

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<StatusTab>("all");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "plays">("newest");
  const [editing, setEditing] = useState<Episode | "new" | null>(
    (location.state as { new?: boolean } | null)?.new ? "new" : null
  );

  const list = useMemo(() => {
    let l = [...episodes];
    if (tab !== "all") l = l.filter((e) => e.status === tab);
    if (cat !== "all") l = l.filter((e) => e.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((e) => e.title.toLowerCase().includes(s) || e.num.includes(s) || (e.guest?.name.toLowerCase().includes(s) ?? false) || e.tags.some((t) => t.includes(s)));
    }
    l.sort((a, b) => (sort === "plays" ? b.plays - a.plays : sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    return l;
  }, [episodes, tab, cat, q, sort]);

  const maxPlays = Math.max(1, ...episodes.map((e) => e.plays));
  const counts = {
    all: episodes.length,
    published: episodes.filter((e) => e.status === "published").length,
    draft: episodes.filter((e) => e.status === "draft").length,
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-head text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">Library management</p>
          <h1 className="font-display mt-1 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl">EPISODES</h1>
        </div>
        <button onClick={() => setEditing("new")} className="font-head group inline-flex items-center gap-2.5 rounded-lg bg-ember px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0a192f] shadow-ember transition-all hover:-translate-y-0.5 hover:brightness-110">
          <IcPlus size={15} className="transition-transform group-hover:rotate-90" /> New episode
        </button>
      </motion.div>

      {/* toolbar */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel p-3">
        <div className="relative min-w-[200px] flex-1">
          <IcSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, guest, № or tag…" aria-label="Search episodes" className={`${inputCls} pl-9`} />
        </div>
        <div className="flex rounded-lg border border-line bg-sunken p-0.5" role="tablist" aria-label="Filter by status">
          {(["all", "published", "draft"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-md px-3.5 py-2 font-head text-[11px] font-bold uppercase tracking-widest transition ${tab === t ? (t === "draft" ? "bg-amber/15 text-amber" : "bg-teal/15 text-teal") : "text-mute hover:text-ink"}`}>
              {t} <span className="tnum opacity-60">{counts[t]}</span>
            </button>
          ))}
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value as typeof cat)} aria-label="Filter by category" className={`${inputCls} w-auto`}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort episodes" className={`${inputCls} w-auto`}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="plays">Most played</option>
        </select>
      </motion.div>

      {/* table */}
      {list.length === 0 ? (
        <EmptyState icon={<IcMic size={22} />} title="NO EPISODES MATCH" sub="Loosen the filters or record something new — the bench is waiting." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          <div className="hidden grid-cols-[64px_minmax(0,1fr)_110px_84px_110px_120px_78px_96px] items-center gap-3 border-b border-line bg-sunken/60 px-4 py-2.5 font-head text-[10px] font-semibold uppercase tracking-[0.16em] text-faint md:grid">
            <span>Cover</span><span>Episode</span><span>Category</span><span>Length</span><span>Released</span><span>Plays</span><span>Live</span><span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-line">
            {list.map((e, i) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                className="group grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-raise/40 md:grid-cols-[64px_minmax(0,1fr)_110px_84px_110px_120px_78px_96px]"
              >
                <button onClick={() => setEditing(e)} aria-label={`Edit EP ${e.num}`} className="relative block h-11 w-14 shrink-0 overflow-hidden rounded-lg transition-transform group-hover:scale-105" style={{ background: `linear-gradient(140deg, ${e.palette.a}, ${e.palette.b})` }}>
                  <span className="font-display absolute inset-0 grid place-items-center text-lg" style={{ color: e.palette.accent }}>{e.num}</span>
                </button>
                <div className="min-w-0">
                  <button onClick={() => setEditing(e)} className="block max-w-full truncate text-left text-sm font-semibold text-ink transition group-hover:text-teal">{e.title}</button>
                  <p className="truncate text-[11px] text-mute">
                    EP {e.num}{e.guest ? ` · ${e.guest.name}` : " · solo"} <span className="md:hidden">· {e.category} · {fmtDate(e.date)}</span>
                  </p>
                </div>
                <span className="hidden md:block">
                  <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-head font-semibold uppercase tracking-widest text-mute">{e.category}</span>
                </span>
                <span className="tnum hidden items-center gap-1.5 text-xs text-mute md:flex"><IcClock size={12} /> {fmtClock(e.duration)}</span>
                <span className="tnum hidden text-xs text-mute lg:block">{fmtDate(e.date)}</span>
                <span className="hidden md:block">
                  <span className="tnum block text-xs font-bold text-teal">{e.plays ? fmtPlays(e.plays) : "—"}</span>
                  {e.plays > 0 && (
                    <span className="mt-1 block h-1 w-20 overflow-hidden rounded-full bg-sunken">
                      <span className="block h-full rounded-full bg-teal/70" style={{ width: `${Math.max(4, Math.round((e.plays / maxPlays) * 100))}%` }} />
                    </span>
                  )}
                </span>
                <span className="hidden md:block"><Switch checked={e.status === "published"} onChange={() => togglePublish(e.id)} label={`Toggle publish for EP ${e.num}`} /></span>
                <span className={`hidden md:inline-block justify-self-start rounded-full px-2 py-0.5 font-head text-[9px] font-bold uppercase tracking-widest ${e.status === "published" ? "bg-teal/10 text-teal" : "bg-amber/10 text-amber"}`}>
                  {e.status}
                </span>
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => setEditing(e)} aria-label={`Edit EP ${e.num}`} className="grid h-8 w-8 place-items-center rounded-md border border-line text-mute transition hover:border-teal/60 hover:text-teal"><IcEdit size={14} /></button>
                  <TwoStepDelete label={`Delete EP ${e.num}`} onConfirm={() => deleteEpisode(e.id)} />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <p className="tnum text-xs text-faint">{list.length} of {episodes.length} episodes shown</p>

      {/* editor */}
      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "NEW EPISODE" : editing ? `EDIT EP ${editing.num}` : ""}
        sub={editing === "new" ? "Drafts stay private until you flip the live switch" : "Changes save straight to the console"}
      >
        {editing !== null && (
          <EpisodeForm
            key={editing === "new" ? "new" : (editing as Episode).id}
            initial={editing === "new" ? blank(episodes) : fromEp(editing as Episode)}
            existing={editing === "new" ? undefined : (editing as Episode)}
            onDone={() => setEditing(null)}
          />
        )}
      </Drawer>
    </div>
  );
}

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCms } from "./cms";
import { TOPICS, uid, type Quote, type Topic } from "./data";
import { EmptyState, Field, IcCopy, IcEdit, IcPlus, IcQuote, IcSearch, IcStar, Modal, TwoStepDelete, inputCls } from "./ui";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

interface QForm {
  text: string;
  author: string;
  episode: string;
  topic: Topic;
  featured: boolean;
}

const empty: QForm = { text: "", author: "Marvin Marbell", episode: "EP 011", topic: "Hustle", featured: false };

export default function QuotesAdmin() {
  const quotes = useCms((s) => s.quotes);
  const episodes = useCms((s) => s.episodes);
  const upsertQuote = useCms((s) => s.upsertQuote);
  const deleteQuote = useCms((s) => s.deleteQuote);
  const toggleFeatured = useCms((s) => s.toggleFeatured);
  const toast = useCms((s) => s.toast);

  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [editing, setEditing] = useState<Quote | "new" | null>(null);
  const [f, setF] = useState<QForm>(empty);
  const [err, setErr] = useState("");

  const list = useMemo(() => {
    let l = [...quotes];
    if (topic !== "All") l = l.filter((x) => x.topic === topic);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((x) => x.text.toLowerCase().includes(s) || x.author.toLowerCase().includes(s) || x.episode.toLowerCase().includes(s));
    }
    return l.sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [quotes, topic, q]);

  const openEditor = (target: Quote | "new") => {
    setErr("");
    setF(target === "new" ? empty : { text: target.text, author: target.author, episode: target.episode, topic: target.topic, featured: target.featured });
    setEditing(target);
  };

  const save = () => {
    if (f.text.trim().length < 8) {
      setErr("Quotes need at least 8 characters — make it hit.");
      return;
    }
    const id = editing !== "new" && editing ? editing.id : uid();
    upsertQuote({ id, text: f.text.trim(), author: f.author.trim() || "Marvin Marbell", episode: f.episode.trim() || "EP 000", topic: f.topic, featured: f.featured });
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-head text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">Words worth printing</p>
          <h1 className="font-display mt-1 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl">QUOTE LIBRARY</h1>
        </div>
        <button onClick={() => openEditor("new")} className="font-head group inline-flex items-center gap-2.5 rounded-lg bg-ember px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0a192f] shadow-ember transition-all hover:-translate-y-0.5 hover:brightness-110">
          <IcPlus size={15} className="transition-transform group-hover:rotate-90" /> Add quote
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel p-3">
        <div className="relative min-w-[200px] flex-1">
          <IcSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the library…" aria-label="Search quotes" className={`${inputCls} pl-9`} />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by topic">
          {(["All", ...TOPICS] as const).map((t) => (
            <button key={t} onClick={() => setTopic(t as typeof topic)} aria-pressed={topic === t} className={`rounded-full border px-3 py-1.5 font-head text-[10px] font-bold uppercase tracking-widest transition ${topic === t ? "border-ember/60 bg-ember/10 text-ember" : "border-line text-mute hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {list.length === 0 ? (
        <EmptyState icon={<IcQuote size={22} />} title="THE WALL IS BARE" sub="Every sharp line from an episode deserves a pin. Add the first one." />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {list.map((x, i) => (
            <motion.figure
              key={x.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.35) }}
              className={`group relative mb-4 break-inside-avoid rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${x.featured ? "border-ember/40 bg-ember/[0.04] hover:shadow-ember" : "border-line bg-panel hover:border-teal/40 hover:shadow-glow"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <IcQuote size={22} className={x.featured ? "text-ember" : "text-teal"} />
                <button
                  onClick={() => toggleFeatured(x.id)}
                  aria-pressed={x.featured}
                  aria-label={x.featured ? "Unpin quote" : "Pin as featured"}
                  className={`transition-all hover:scale-110 ${x.featured ? "text-ember" : "text-faint hover:text-ember"}`}
                >
                  <IcStar size={17} className={x.featured ? "fill-current" : ""} />
                </button>
              </div>
              <blockquote className="mt-3 text-[15px] font-medium leading-relaxed text-ink">{x.text}</blockquote>
              <figcaption className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3.5">
                <div className="min-w-0">
                  <p className="font-head truncate text-xs font-bold text-teal">{x.author}</p>
                  <p className="text-[11px] uppercase tracking-wider text-mute">{x.episode} · {x.topic}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 opacity-60 transition group-hover:opacity-100">
                  <button
                    onClick={async () => toast((await copyText(`“${x.text}” — ${x.author}, ${x.episode}`)) ? "Quote copied" : "Couldn't copy", "info")}
                    aria-label="Copy quote"
                    className="grid h-8 w-8 place-items-center rounded-md border border-line text-mute transition hover:border-teal/60 hover:text-teal"
                  >
                    <IcCopy size={13} />
                  </button>
                  <button onClick={() => openEditor(x)} aria-label="Edit quote" className="grid h-8 w-8 place-items-center rounded-md border border-line text-mute transition hover:border-teal/60 hover:text-teal">
                    <IcEdit size={13} />
                  </button>
                  <TwoStepDelete label="Delete quote" onConfirm={() => deleteQuote(x.id)} />
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      )}

      <p className="tnum text-xs text-faint">{list.length} of {quotes.length} quotes · {quotes.filter((x) => x.featured).length} pinned to the site</p>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "New quote" : "Edit quote"}>
        <div className="space-y-4">
          {err && <p role="alert" className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-2.5 text-sm font-medium text-ember">{err}</p>}
          <Field label="The line">
            <textarea rows={3} className={`${inputCls} resize-y`} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder="The street doesn't grade your homework…" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Spoken by">
              <input className={inputCls} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} />
            </Field>
            <Field label="Episode">
              <input className={inputCls} list="wits-ep-refs" value={f.episode} onChange={(e) => setF({ ...f, episode: e.target.value })} />
              <datalist id="wits-ep-refs">
                {episodes.map((e) => <option key={e.id} value={`EP ${e.num}`} />)}
              </datalist>
            </Field>
          </div>
          <div className="grid grid-cols-2 items-end gap-4">
            <Field label="Topic">
              <select className={inputCls} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value as Topic })}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-sunken px-3.5 py-2.5">
              <input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} className="accent-[#ff6b35]" />
              <span className="font-head text-[11px] font-bold uppercase tracking-widest text-mute">Pin as featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditing(null)} className="font-head rounded-lg border border-line px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-mute transition hover:text-ink">Cancel</button>
            <button onClick={save} className="font-head rounded-lg bg-teal px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0a192f] shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110">
              {editing === "new" ? "Add to library" : "Save quote"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCms } from "./cms";
import { fmtDate, timeAgo, type Message, type MessageType } from "./data";
import { EmptyState, IcCopy, IcExt, IcInbox, IcWhatsApp, TwoStepDelete, inputCls } from "./ui";
import { IcSearch } from "./ui";

type Tab = "all" | "unread" | "guest" | "archived";

const TYPE_META: Record<MessageType, { label: string; cls: string }> = {
  general: { label: "General", cls: "bg-teal/10 text-teal" },
  guest: { label: "Guest app", cls: "bg-ember/10 text-ember" },
  booking: { label: "Booking", cls: "bg-amber/10 text-amber" },
};

export default function MessagesAdmin() {
  const messages = useCms((s) => s.messages);
  const markRead = useCms((s) => s.markRead);
  const setArchived = useCms((s) => s.setArchived);
  const deleteMessage = useCms((s) => s.deleteMessage);
  const settings = useCms((s) => s.settings);
  const toast = useCms((s) => s.toast);

  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const counts: Record<Tab, number> = {
    all: messages.filter((m) => !m.archived).length,
    unread: messages.filter((m) => !m.read && !m.archived).length,
    guest: messages.filter((m) => m.type === "guest" && !m.archived).length,
    archived: messages.filter((m) => m.archived).length,
  };

  const list = useMemo(() => {
    let l = [...messages];
    if (tab === "archived") l = l.filter((m) => m.archived);
    else l = l.filter((m) => !m.archived);
    if (tab === "unread") l = l.filter((m) => !m.read);
    if (tab === "guest") l = l.filter((m) => m.type === "guest");
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((m) => m.name.toLowerCase().includes(s) || m.subject.toLowerCase().includes(s) || m.email.toLowerCase().includes(s));
    }
    return l.sort((a, b) => b.date.localeCompare(a.date));
  }, [messages, tab, q]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const open = (m: Message) => {
    setSelectedId(m.id);
    if (!m.read) markRead(m.id, true);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-head text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">Listener wire</p>
          <h1 className="font-display mt-1 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl">INBOX</h1>
        </div>
        <div className="relative w-full max-w-xs">
          <IcSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, subject…" aria-label="Search messages" className={`${inputCls} pl-9`} />
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Message filters">
        {(["all", "unread", "guest", "archived"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setSelectedId(null); }} className={`rounded-full border px-4 py-2 font-head text-[11px] font-bold uppercase tracking-widest transition ${tab === t ? (t === "unread" ? "border-amber/60 bg-amber/10 text-amber" : "border-teal/60 bg-teal/10 text-teal") : "border-line text-mute hover:text-ink"}`}>
            {t} <span className="tnum opacity-60">{counts[t]}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<IcInbox size={22} />} title="NOTHING ON THE WIRE" sub={tab === "unread" ? "Inbox zero. The corner respects you." : "No conversations in this view yet."} />
      ) : (
        <div className="grid overflow-hidden rounded-xl border border-line bg-panel lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* list */}
          <ul className="max-h-[70vh] divide-y divide-line overflow-y-auto border-b border-line lg:border-b-0 lg:border-r">
            {list.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => open(m)}
                  aria-current={selectedId === m.id}
                  className={`relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${selectedId === m.id ? "bg-teal/[0.06]" : "hover:bg-raise/40"}`}
                >
                  {selectedId === m.id && <span className="absolute inset-y-0 left-0 w-0.5 bg-teal" aria-hidden="true" />}
                  <span className={`font-display mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm ${!m.read && !m.archived ? "bg-ember/15 text-ember" : "bg-sunken text-faint"}`}>
                    {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${!m.read && !m.archived ? "font-bold text-ink" : "font-medium text-mute"}`}>{m.name}</span>
                      <span className="tnum shrink-0 text-[10px] text-faint">{timeAgo(m.date)}</span>
                    </span>
                    <span className={`block truncate text-xs ${!m.read && !m.archived ? "font-semibold text-ink" : "text-mute"}`}>{m.subject}</span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 font-head text-[9px] font-bold uppercase tracking-widest ${TYPE_META[m.type].cls}`}>{TYPE_META[m.type].label}</span>
                      {!m.read && !m.archived && <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-label="Unread" />}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* detail */}
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex h-full flex-col p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-full px-2.5 py-1 font-head text-[10px] font-bold uppercase tracking-widest ${TYPE_META[selected.type].cls}`}>{TYPE_META[selected.type].label}</span>
                      <h2 className="font-head mt-3 text-xl font-bold leading-snug text-ink">{selected.subject}</h2>
                      <p className="mt-1.5 text-sm text-mute">
                        <span className="font-semibold text-teal">{selected.name}</span> · {selected.email} · {fmtDate(selected.date)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex-1 rounded-xl border border-line bg-sunken/60 p-5 text-[15px] leading-relaxed text-ink">
                    {selected.body}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selected.name.split(" ")[0]}, Marvin here from Wisdom In The Streets — thanks for "${selected.subject}".`)}`}
                      target="_blank" rel="noreferrer"
                      className="font-head inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:brightness-110"
                    >
                      <IcWhatsApp size={14} /> Reply on WhatsApp
                    </a>
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject} — Wisdom In The Streets`)}`}
                      className="font-head inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:border-teal/50 hover:text-teal"
                    >
                      <IcExt size={13} /> Email reply
                    </a>
                    <button
                      onClick={async () => { try { await navigator.clipboard.writeText(selected.email); toast("Email copied"); } catch { toast("Couldn't copy", "error"); } }}
                      className="font-head inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:border-teal/50 hover:text-teal"
                    >
                      <IcCopy size={13} /> Copy email
                    </button>
                    <span className="flex-1" />
                    <button onClick={() => markRead(selected.id, !selected.read)} className="font-head rounded-lg border border-line px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:text-ink">
                      Mark {selected.read ? "unread" : "read"}
                    </button>
                    <button onClick={() => { setArchived(selected.id, !selected.archived); setSelectedId(null); }} className="font-head rounded-lg border border-line px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:text-amber">
                      {selected.archived ? "Restore" : "Archive"}
                    </button>
                    <TwoStepDelete label="Delete message" onConfirm={() => { deleteMessage(selected.id); setSelectedId(null); }} />
                  </div>
                </motion.article>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full place-items-center p-8 text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl border border-line bg-sunken text-faint"><IcInbox size={22} /></span>
                    <p className="font-display mt-4 text-2xl tracking-wide text-ink">PICK A CONVERSATION</p>
                    <p className="mt-1.5 text-sm text-mute">Guest applications, bookings and love letters from the corner.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

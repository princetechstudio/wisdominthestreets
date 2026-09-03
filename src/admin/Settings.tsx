import { useState } from "react";
import { motion } from "framer-motion";
import { useCms } from "./cms";
import type { Settings } from "./data";
import { Field, IcAlert, IcCheck, IcDownload, IcX, inputCls } from "./ui";

export default function SettingsAdmin() {
  const settings = useCms((s) => s.settings);
  const updateSettings = useCms((s) => s.updateSettings);
  const resetDemo = useCms((s) => s.resetDemo);
  const episodes = useCms((s) => s.episodes);
  const quotes = useCms((s) => s.quotes);
  const messages = useCms((s) => s.messages);

  const [f, setF] = useState<Settings>(settings);
  const [armReset, setArmReset] = useState(false);
  const dirty = JSON.stringify(f) !== JSON.stringify(settings);
  const up = (patch: Partial<Settings>) => setF((s) => ({ ...s, ...patch }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ episodes, quotes, messages, settings }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wits-cms-export.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-head text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">Show configuration</p>
        <h1 className="font-display mt-1 text-5xl leading-[0.92] tracking-wide text-ink sm:text-6xl">SETTINGS</h1>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="rounded-xl border border-line bg-panel p-6">
        <h2 className="font-display text-2xl tracking-wide text-ink">SHOW IDENTITY</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Show name"><input className={inputCls} value={f.showName} onChange={(e) => up({ showName: e.target.value })} /></Field>
          <Field label="Host"><input className={inputCls} value={f.host} onChange={(e) => up({ host: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Tagline"><input className={inputCls} value={f.tagline} onChange={(e) => up({ tagline: e.target.value })} /></Field>
          </div>
          <Field label="Contact email"><input type="email" className={inputCls} value={f.email} onChange={(e) => up({ email: e.target.value })} /></Field>
          <Field label="WhatsApp number" hint="used for click-to-chat"><input className={inputCls} value={f.whatsapp} onChange={(e) => up({ whatsapp: e.target.value })} /></Field>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-xl border border-line bg-panel p-6">
        <h2 className="font-display text-2xl tracking-wide text-ink">PLATFORM LINKS</h2>
        <p className="mt-1 text-xs text-mute">These feed the public site badges and the RSS enclosure URLs.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Spotify"><input className={inputCls} value={f.spotify} onChange={(e) => up({ spotify: e.target.value })} /></Field>
          <Field label="Apple Podcasts"><input className={inputCls} value={f.apple} onChange={(e) => up({ apple: e.target.value })} /></Field>
          <Field label="YouTube"><input className={inputCls} value={f.youtube} onChange={(e) => up({ youtube: e.target.value })} /></Field>
          <Field label="RSS feed"><input className={inputCls} value={f.rss} onChange={(e) => up({ rss: e.target.value })} /></Field>
        </div>
      </motion.section>

      {/* save bar */}
      <div aria-live="polite">
        {dirty && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border border-teal/40 bg-raise/95 px-5 py-3.5 shadow-glow backdrop-blur">
            <p className="font-head text-xs font-bold uppercase tracking-widest text-teal">Unsaved changes</p>
            <div className="flex gap-2.5">
              <button onClick={() => setF(settings)} className="font-head inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:text-ink"><IcX size={12} /> Discard</button>
              <button onClick={() => updateSettings(f)} className="font-head inline-flex items-center gap-1.5 rounded-lg bg-teal px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:brightness-110"><IcCheck size={12} /> Save settings</button>
            </div>
          </motion.div>
        )}
      </div>

      <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-xl border border-ember/30 bg-ember/[0.04] p-6">
        <h2 className="font-display flex items-center gap-2.5 text-2xl tracking-wide text-ember"><IcAlert size={20} /> DANGER ZONE</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-head text-sm font-bold text-ink">Reset demo data</p>
            <p className="text-xs text-mute">Restores the 11 seeded episodes, 12 quotes and 5 messages. Your edits are wiped.</p>
          </div>
          {armReset ? (
            <div className="flex shrink-0 gap-2">
              <button onClick={() => { resetDemo(); setF(useCms.getState().settings); setArmReset(false); }} className="font-head rounded-lg bg-ember px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#0a192f] transition hover:brightness-110">Yes, wipe it</button>
              <button onClick={() => setArmReset(false)} className="font-head rounded-lg border border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute hover:text-ink">Keep</button>
            </div>
          ) : (
            <button onClick={() => setArmReset(true)} className="font-head shrink-0 rounded-lg border border-ember/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-ember transition hover:bg-ember hover:text-[#0a192f]">Reset…</button>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-3 border-t border-ember/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-head text-sm font-bold text-ink">Export console data</p>
            <p className="text-xs text-mute">Downloads episodes, quotes, messages and settings as JSON.</p>
          </div>
          <button onClick={exportJson} className="font-head inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-mute transition hover:border-teal/50 hover:text-teal">
            <IcDownload size={13} /> Export JSON
          </button>
        </div>
      </motion.section>
    </div>
  );
}

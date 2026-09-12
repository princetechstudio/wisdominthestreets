import { motion, AnimatePresence } from "framer-motion";
import { useCms } from "./cms";
import { fmtClock, fmtDate, fmtPlays } from "./data";
import { IcX } from "./ui";

interface Props {
  episodeId: number | null;
  onClose: () => void;
}

export default function EpisodePreview({ episodeId, onClose }: Props) {
  const episodes = useCms((s) => s.episodes);
  const ep = episodes.find((e) => e.id === episodeId);

  if (!ep) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050d1d]/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-panel/80 text-mute backdrop-blur transition hover:text-ink"
          >
            <IcX size={18} />
          </button>

          {/* Preview header */}
          <div className="border-b border-line bg-sunken/50 px-6 py-3">
            <p className="font-head text-[10px] font-bold uppercase tracking-widest text-faint">Public preview</p>
            <p className="text-xs text-mute">This is what listeners see on the website</p>
          </div>

          {/* Episode content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
              {/* Cover art */}
              <div>
                <div
                  className="aspect-square overflow-hidden rounded-xl shadow-lg"
                  style={{ background: `linear-gradient(140deg, ${ep.palette.a}, ${ep.palette.b})` }}
                >
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <span className="font-display text-7xl tracking-wider" style={{ color: ep.palette.accent }}>
                      {ep.num}
                    </span>
                    <div className="mt-4 h-1 w-20 rounded-full" style={{ background: ep.palette.accent }} />
                  </div>
                </div>
              </div>

              {/* Episode details */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm tracking-widest" style={{ color: ep.palette.accent }}>
                    EPISODE {ep.num}
                  </span>
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: ep.palette.accent, borderColor: `${ep.palette.accent}44` }}>
                    {ep.category}
                  </span>
                  {ep.status === "published" ? (
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">
                      Draft
                    </span>
                  )}
                </div>

                <h2 className="font-display mt-3 text-3xl leading-tight tracking-wide text-ink">
                  {ep.title}
                </h2>

                {ep.guest && (
                  <p className="mt-2 text-sm text-mute">
                    with <span className="font-semibold text-ink">{ep.guest.name}</span>
                    {ep.guest.role && <span className="text-faint"> · {ep.guest.role}</span>}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-mute">
                  <span>{fmtDate(ep.date)}</span>
                  <span>·</span>
                  <span>{fmtClock(ep.duration)}</span>
                  <span>·</span>
                  <span>{fmtPlays(ep.plays)} plays</span>
                </div>

                {ep.description && (
                  <p className="mt-5 text-sm leading-relaxed text-ink/90">
                    {ep.description}
                  </p>
                )}

                {ep.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ep.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-sunken px-3 py-1 text-xs text-mute">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Show notes */}
                {ep.showNotes.length > 0 && (
                  <div className="mt-6 border-t border-line pt-6">
                    <h3 className="font-head text-xs font-bold uppercase tracking-widest text-teal">
                      Show notes
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {ep.showNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="font-mono shrink-0 text-xs text-faint">
                            [{fmtClock(note.time)}]
                          </span>
                          <span className="text-ink/90">{note.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-line bg-sunken/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-faint">
                Preview only — changes are saved in the editor
              </p>
              <button
                onClick={onClose}
                className="font-head rounded-lg border border-line px-4 py-2 text-xs font-bold uppercase tracking-widest text-mute transition hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

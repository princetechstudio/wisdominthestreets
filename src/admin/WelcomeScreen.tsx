import { motion, AnimatePresence } from "framer-motion";
import { useCms } from "./cms";
import { IcCheck, IcDash, IcInbox, IcMic, IcQuote } from "./ui";

export default function WelcomeScreen() {
  const hasSeenWelcome = useCms((s) => s.hasSeenWelcome);
  const markWelcomeSeen = useCms((s) => s.markWelcomeSeen);

  if (hasSeenWelcome) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-[#050d1d]/90 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-teal/30 bg-panel shadow-2xl"
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal/10 via-panel to-ember/10 px-8 py-10 text-center">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(100,255,218,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,107,53,0.3) 0%, transparent 50%)"
            }} />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-ember shadow-lg">
                <span className="font-display text-3xl text-[#0a192f]">W</span>
              </div>
              <h1 className="font-display text-5xl tracking-wide text-ink">
                WELCOME TO THE <span className="text-teal">CONSOLE</span>
              </h1>
              <p className="mt-3 text-sm text-mute">
                Your production hub for Wisdom In The Streets
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 px-8 py-8">
            <p className="text-center text-sm leading-relaxed text-mute">
              This is your complete production dashboard. Manage episodes, curate quotes, handle listener messages, and track performance — all in one place.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-sunken/50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal/15 text-teal">
                  <IcMic size={20} />
                </div>
                <h3 className="font-head text-sm font-bold text-ink">Episodes</h3>
                <p className="mt-1 text-xs text-mute">Create, edit, and publish episodes. Manage guests, show notes, and cover art.</p>
              </div>

              <div className="rounded-xl border border-line bg-sunken/50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ember/15 text-ember">
                  <IcQuote size={20} />
                </div>
                <h3 className="font-head text-sm font-bold text-ink">Quotes</h3>
                <p className="mt-1 text-xs text-mute">Build your quote library. Pin favorites, organize by topic, and export for social media.</p>
              </div>

              <div className="rounded-xl border border-line bg-sunken/50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber/15 text-amber">
                  <IcInbox size={20} />
                </div>
                <h3 className="font-head text-sm font-bold text-ink">Inbox</h3>
                <p className="mt-1 text-xs text-mute">Handle listener messages, guest applications, and booking requests. Reply directly via WhatsApp or email.</p>
              </div>

              <div className="rounded-xl border border-line bg-sunken/50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal/15 text-teal">
                  <IcDash size={20} />
                </div>
                <h3 className="font-head text-sm font-bold text-ink">Dashboard</h3>
                <p className="mt-1 text-xs text-mute">Track performance metrics, monitor activity, and get insights on what's working.</p>
              </div>
            </div>

            <div className="rounded-xl border border-teal/30 bg-teal/10 p-5">
              <p className="font-head text-xs font-bold uppercase tracking-widest text-teal">Pro tip</p>
              <p className="mt-2 text-sm text-ink">
                Press <kbd className="rounded border border-teal/40 bg-panel px-2 py-0.5 font-mono text-xs">⌘K</kbd> (or <kbd className="rounded border border-teal/40 bg-panel px-2 py-0.5 font-mono text-xs">Ctrl+K</kbd>) anytime to open the command palette — search episodes, navigate quickly, and execute actions without touching the mouse.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-sunken/50 p-5">
              <p className="font-head text-xs font-bold uppercase tracking-widest text-mute">Your data</p>
              <p className="mt-2 text-sm text-mute">
                This console comes pre-loaded with demo data so you can explore. All changes are saved locally in your browser. You can export your data or reset to demo state anytime from Settings.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-line bg-sunken/30 px-8 py-5">
            <button
              onClick={markWelcomeSeen}
              className="font-head flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#0a192f] shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              <IcCheck size={16} />
              Start exploring
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

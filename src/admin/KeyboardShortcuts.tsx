import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IcX } from "./ui";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ["⌘", "K"], description: "Open command palette", category: "Navigation" },
  { keys: ["Esc"], description: "Close modal / command palette", category: "Navigation" },

  // Episodes
  { keys: ["N"], description: "Create new episode", category: "Episodes" },
  { keys: ["↑"], description: "Navigate up in lists", category: "Episodes" },
  { keys: ["↓"], description: "Navigate down in lists", category: "Episodes" },
  { keys: ["Enter"], description: "Open selected episode", category: "Episodes" },

  // Messages
  { keys: ["A"], description: "Select all messages", category: "Messages" },
  { keys: ["R"], description: "Mark selected as read", category: "Messages" },
  { keys: ["Del"], description: "Archive selected messages", category: "Messages" },

  // General
  { keys: ["⌘", "S"], description: "Save current changes", category: "General" },
  { keys: ["⌘", "Z"], description: "Undo last action", category: "General" },
  { keys: ["⌘", "Shift", "Z"], description: "Redo last action", category: "General" },
  { keys: ["?"], description: "Show keyboard shortcuts", category: "General" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Open with ? key (but not when typing in inputs)
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen(true);
      }
      // Close with Esc
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const categories = Array.from(new Set(SHORTCUTS.map((s) => s.category)));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050d1d]/90 backdrop-blur-md p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 className="font-display text-2xl tracking-wide text-ink">Keyboard Shortcuts</h2>
                <p className="mt-0.5 text-xs text-mute">Master the console with these shortcuts</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-mute transition hover:text-ink">
                <IcX size={18} />
              </button>
            </div>

            {/* Shortcuts */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="font-head mb-3 text-xs font-bold uppercase tracking-widest text-teal">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {SHORTCUTS.filter((s) => s.category === category).map((shortcut, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-line bg-sunken/50 px-4 py-3"
                        >
                          <span className="text-sm text-ink">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, j) => (
                              <span key={j} className="flex items-center">
                                <kbd className="rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs font-semibold text-mute shadow-sm">
                                  {key}
                                </kbd>
                                {j < shortcut.keys.length - 1 && (
                                  <span className="mx-1 text-xs text-faint">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-line bg-sunken/30 px-6 py-4">
              <p className="text-xs text-faint">
                Press <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[10px]">?</kbd> anytime to show this help
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

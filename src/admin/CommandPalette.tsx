import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCms } from "./cms";
import { IcDash, IcEdit, IcInbox, IcMic, IcPlus, IcQuote, IcSearch, IcX } from "./ui";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "action" | "episode" | "quote";
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const episodes = useCms((s) => s.episodes);
  const quotes = useCms((s) => s.quotes);
  const togglePublish = useCms((s) => s.togglePublish);

  /* Cmd+K / Ctrl+K to open */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const commands: Command[] = [
    /* Navigation */
    { id: "nav-dash", label: "Go to Dashboard", icon: <IcDash size={16} />, action: () => navigate("/"), category: "navigation" },
    { id: "nav-eps", label: "Go to Episodes", icon: <IcMic size={16} />, action: () => navigate("/episodes"), category: "navigation" },
    { id: "nav-quotes", label: "Go to Quotes", icon: <IcQuote size={16} />, action: () => navigate("/quotes"), category: "navigation" },
    { id: "nav-inbox", label: "Go to Inbox", icon: <IcInbox size={16} />, action: () => navigate("/messages"), category: "navigation" },
    { id: "nav-settings", label: "Go to Settings", icon: <IcSearch size={16} />, action: () => navigate("/settings"), category: "navigation" },

    /* Actions */
    { id: "new-ep", label: "Create new episode", icon: <IcPlus size={16} />, action: () => navigate("/episodes", { state: { new: true } }), category: "action" },
    { id: "new-quote", label: "Add new quote", icon: <IcPlus size={16} />, action: () => navigate("/quotes"), category: "action" },

    /* Episodes (top 5) */
    ...episodes.slice(0, 5).map((ep) => ({
      id: `ep-${ep.id}`,
      label: `Edit EP ${ep.num}: ${ep.title}`,
      description: ep.status === "published" ? "Published" : "Draft",
      icon: <IcEdit size={16} />,
      action: () => navigate("/episodes"),
      category: "episode" as const,
    })),

    /* Quotes (top 3) */
    ...quotes.slice(0, 3).map((q) => ({
      id: `quote-${q.id}`,
      label: `Quote: "${q.text.slice(0, 40)}…"`,
      description: `${q.episode} · ${q.topic}`,
      icon: <IcQuote size={16} />,
      action: () => navigate("/quotes"),
      category: "quote" as const,
    })),
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description?.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const handleSelect = (cmd: Command) => {
    cmd.action();
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      e.preventDefault();
      handleSelect(filtered[selected]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[#050d1d]/80 backdrop-blur-sm pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <IcSearch size={18} className="text-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
                aria-label="Command palette search"
              />
              <button onClick={() => setOpen(false)} aria-label="Close command palette" className="text-faint transition hover:text-ink">
                <IcX size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-faint">
                  No results for "{query}"
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {filtered.map((cmd, i) => (
                    <li key={cmd.id}>
                      <button
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelected(i)}
                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition ${
                          selected === i ? "bg-teal/10" : "hover:bg-raise/40"
                        }`}
                      >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          selected === i ? "bg-teal/15 text-teal" : "bg-sunken text-faint"
                        }`}>
                          {cmd.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">{cmd.label}</span>
                          {cmd.description && (
                            <span className="block truncate text-xs text-faint">{cmd.description}</span>
                          )}
                        </span>
                        <span className="font-head shrink-0 text-[9px] font-bold uppercase tracking-widest text-faint">
                          {cmd.category}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-line bg-sunken/50 px-5 py-2.5 text-[10px] text-faint">
              <span>
                <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[9px]">↑↓</kbd> Navigate
                <span className="mx-2">·</span>
                <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[9px]">↵</kbd> Select
                <span className="mx-2">·</span>
                <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[9px]">esc</kbd> Close
              </span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

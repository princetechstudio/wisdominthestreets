import { create } from "zustand";
import {
  SEED_ACTIVITY,
  SEED_EPISODES,
  SEED_MESSAGES,
  SEED_QUOTES,
  SEED_SETTINGS,
  type Activity,
  type ActivityKind,
  type Episode,
  type Message,
  type Quote,
  type Settings,
} from "./data";

/* ============================================================
   WITS CMS store — persisted to localStorage ("wits-cms-v1").
   The demo data can be reset from Settings → Danger zone.
   ============================================================ */

const LS_KEY = "wits-cms-v1";

export interface Toast {
  id: number;
  msg: string;
  kind: "success" | "error" | "info";
}

interface CmsState {
  episodes: Episode[];
  quotes: Quote[];
  messages: Message[];
  activity: Activity[];
  settings: Settings;
  toasts: Toast[];

  toast: (msg: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: number) => void;

  log: (kind: ActivityKind, text: string) => void;

  upsertEpisode: (ep: Episode) => void;
  deleteEpisode: (id: number) => void;
  togglePublish: (id: number) => void;

  upsertQuote: (q: Quote) => void;
  deleteQuote: (id: number) => void;
  toggleFeatured: (id: number) => void;

  markRead: (id: number, read: boolean) => void;
  setArchived: (id: number, archived: boolean) => void;
  deleteMessage: (id: number) => void;
  receiveMessage: (m: Omit<Message, "id" | "date" | "read" | "archived">) => void;

  updateSettings: (patch: Partial<Settings>) => void;
  resetDemo: () => void;
}

interface Persisted {
  episodes: Episode[];
  quotes: Quote[];
  messages: Message[];
  activity: Activity[];
  settings: Settings;
}

function loadSeed(): Persisted {
  return {
    episodes: SEED_EPISODES,
    quotes: SEED_QUOTES,
    messages: SEED_MESSAGES,
    activity: SEED_ACTIVITY,
    settings: SEED_SETTINGS,
  };
}

function loadInitial(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return loadSeed();
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    // merge with seed so newly added fields never crash older saves
    const seed = loadSeed();
    return {
      episodes: parsed.episodes?.length ? parsed.episodes : seed.episodes,
      quotes: parsed.quotes?.length ? parsed.quotes : seed.quotes,
      messages: parsed.messages ?? seed.messages,
      activity: parsed.activity?.length ? parsed.activity : seed.activity,
      settings: { ...seed.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return loadSeed();
  }
}

function persist(state: CmsState) {
  try {
    const { episodes, quotes, messages, activity, settings } = state;
    localStorage.setItem(LS_KEY, JSON.stringify({ episodes, quotes, messages, activity: activity.slice(0, 40), settings }));
  } catch {
    /* storage full or blocked — non-fatal in demo mode */
  }
}

let toastSeq = 0;

export const useCms = create<CmsState>()((set, get) => ({
  ...loadInitial(),
  toasts: [],

  toast: (msg, kind = "success") => {
    const id = ++toastSeq;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, msg, kind }] }));
    window.setTimeout(() => get().dismissToast(id), 3600);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  log: (kind, text) => {
    set((s) => ({
      activity: [{ id: Date.now() + Math.random(), kind, text, ts: Date.now() }, ...s.activity].slice(0, 40),
    }));
    persist(get());
  },

  /* ---------- episodes ---------- */
  upsertEpisode: (ep) => {
    const exists = get().episodes.some((e) => e.id === ep.id);
    set((s) => ({
      episodes: exists ? s.episodes.map((e) => (e.id === ep.id ? ep : e)) : [...s.episodes, ep],
    }));
    get().log("episode", exists ? `EP ${ep.num} updated — "${ep.title}"` : `EP ${ep.num} created as ${ep.status}`);
    get().toast(exists ? `Episode ${ep.num} saved` : `Episode ${ep.num} created`, "success");
    persist(get());
  },

  deleteEpisode: (id) => {
    const ep = get().episodes.find((e) => e.id === id);
    set((s) => ({ episodes: s.episodes.filter((e) => e.id !== id) }));
    if (ep) get().log("episode", `EP ${ep.num} deleted — "${ep.title}"`);
    get().toast("Episode deleted", "info");
    persist(get());
  },

  togglePublish: (id) => {
    const ep = get().episodes.find((e) => e.id === id);
    if (!ep) return;
    const next: Episode["status"] = ep.status === "published" ? "draft" : "published";
    set((s) => ({ episodes: s.episodes.map((e) => (e.id === id ? { ...e, status: next } : e)) }));
    get().log("episode", `EP ${ep.num} ${next === "published" ? "published to all platforms" : "moved back to drafts"}`);
    get().toast(next === "published" ? `EP ${ep.num} is live 🎙` : `EP ${ep.num} moved to drafts`, next === "published" ? "success" : "info");
    persist(get());
  },

  /* ---------- quotes ---------- */
  upsertQuote: (q) => {
    const exists = get().quotes.some((x) => x.id === q.id);
    set((s) => ({ quotes: exists ? s.quotes.map((x) => (x.id === q.id ? q : x)) : [q, ...s.quotes] }));
    get().log("quote", exists ? `Quote from ${q.episode} edited` : `New quote added from ${q.episode}`);
    get().toast(exists ? "Quote updated" : "Quote added to the library");
    persist(get());
  },

  deleteQuote: (id) => {
    set((s) => ({ quotes: s.quotes.filter((q) => q.id !== id) }));
    get().toast("Quote removed", "info");
    persist(get());
  },

  toggleFeatured: (id) => {
    let featured = false;
    set((s) => ({
      quotes: s.quotes.map((q) => {
        if (q.id !== id) return q;
        featured = !q.featured;
        return { ...q, featured };
      }),
    }));
    const q = get().quotes.find((x) => x.id === id);
    if (q) get().log("quote", `${featured ? "Pinned" : "Unpinned"}: "${q.text.slice(0, 42)}…"`);
    persist(get());
  },

  /* ---------- messages ---------- */
  markRead: (id, read) => {
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, read } : m)) }));
    persist(get());
  },

  setArchived: (id, archived) => {
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, archived } : m)) }));
    get().toast(archived ? "Conversation archived" : "Restored to inbox", "info");
    persist(get());
  },

  deleteMessage: (id) => {
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
    get().toast("Message deleted", "info");
    persist(get());
  },

  receiveMessage: (m) => {
    const msg: Message = { ...m, id: Date.now(), date: new Date().toISOString(), read: false, archived: false };
    set((s) => ({ messages: [msg, ...s.messages] }));
    get().log("message", `New ${m.type === "guest" ? "guest application" : "message"} from ${m.name}`);
    persist(get());
  },

  /* ---------- settings ---------- */
  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
    get().log("system", "Show settings updated");
    get().toast("Settings saved");
    persist(get());
  },

  resetDemo: () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch { /* ignore */ }
    set({ ...loadSeed() });
    get().toast("Demo data restored to factory state", "info");
  },
}));

/* convenience selectors */
export const selectPublished = (s: CmsState) => s.episodes.filter((e) => e.status === "published");
export const selectDrafts = (s: CmsState) => s.episodes.filter((e) => e.status === "draft");
export const selectUnread = (s: CmsState) => s.messages.filter((m) => !m.read && !m.archived);

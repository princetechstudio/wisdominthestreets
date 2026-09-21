import { create } from "zustand";
import { EPISODES, episodeById, type Episode } from "./data/content";

/* ============================================================
   Global store: audio player (module-level <audio> singleton),
   favorites, bookmarks, history, theme, toasts.
   Persisted slices live in localStorage (keys prefixed wits-*).
   ============================================================ */

const LS = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — ignore */
    }
  },
};

/** A single shared audio element — survives route changes, so playback never stops. */
export const audioEl = new Audio();
audioEl.preload = "metadata";

export interface Toast {
  id: number;
  msg: string;
  kind: "success" | "error" | "info";
}

interface PlayerSlice {
  current: Episode | null;
  queue: number[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  favorites: number[];
  bookmarks: Record<number, number[]>;
  history: number[];
  lastPlayed: { id: number; time: number } | null;
  theme: "dark" | "light";
  toasts: Toast[];

  playEpisode: (ep: Episode, queue?: number[], startAt?: number) => void;
  togglePlay: () => void;
  seek: (t: number) => void;
  skip: (delta: number) => void;
  setSpeed: (s: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  next: (auto?: boolean) => void;
  prev: () => void;
  toggleFavorite: (id: number) => void;
  addBookmark: (id: number, time: number) => void;
  removeBookmark: (id: number, time: number) => void;
  toggleTheme: () => void;
  toast: (msg: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: number) => void;
}

let toastSeq = 0;
let lastSave = 0;

export const useStore = create<PlayerSlice>()((set, get) => ({
  current: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: LS.get("wits-volume", 0.85),
  muted: false,
  speed: 1,
  favorites: LS.get<number[]>("wits-favorites", []),
  bookmarks: LS.get<Record<number, number[]>>("wits-bookmarks", {}),
  history: LS.get<number[]>("wits-history", []),
  lastPlayed: LS.get<PlayerSlice["lastPlayed"]>("wits-last", null),
  theme: LS.get<"dark" | "light">("wits-theme", "dark"),
  toasts: [],

  playEpisode: (ep, queue, startAt = 0) => {
    const a = audioEl;
    const isNew = get().current?.id !== ep.id;
    if (isNew) {
      a.src = ep.audioUrl;
      a.load();
    }
    const applyTime = () => {
      try {
        a.currentTime = Math.min(startAt, Math.max(a.duration - 2 || startAt, 0));
      } catch {
        /* metadata not ready */
      }
    };
    if (startAt > 0) {
      if (a.readyState >= 1) applyTime();
      else a.addEventListener("loadedmetadata", applyTime, { once: true });
    }
    a.play().catch(() => {
      get().toast("Tap play again — your browser blocked autoplay", "info");
    });
    set({
      current: ep,
      queue: queue && queue.length ? queue : EPISODES.map((e) => e.id),
      isPlaying: true,
      currentTime: startAt,
      duration: isNew ? 0 : get().duration,
    });
    // history (most recent first, max 12)
    const history = [ep.id, ...get().history.filter((h) => h !== ep.id)].slice(0, 12);
    set({ history });
    LS.set("wits-history", history);
    LS.set("wits-last", { id: ep.id, time: startAt });
    set({ lastPlayed: { id: ep.id, time: startAt } });
  },

  togglePlay: () => {
    const { current, isPlaying } = get();
    if (!current) {
      const featured = EPISODES[EPISODES.length - 1];
      get().playEpisode(featured);
      return;
    }
    if (isPlaying) audioEl.pause();
    else audioEl.play().catch(() => get().toast("Playback failed — check your connection", "error"));
    set({ isPlaying: !isPlaying });
  },

  seek: (t) => {
    const d = get().duration || get().current?.duration || 0;
    const clamped = Math.max(0, Math.min(t, d || t));
    try {
      audioEl.currentTime = clamped;
    } catch {
      /* not ready */
    }
    set({ currentTime: clamped });
  },

  skip: (delta) => {
    const t = get().currentTime + delta;
    get().seek(t);
  },

  setSpeed: (s) => {
    audioEl.playbackRate = s;
    set({ speed: s });
  },

  setVolume: (v) => {
    audioEl.volume = v;
    audioEl.muted = false;
    set({ volume: v, muted: false });
    LS.set("wits-volume", v);
  },

  toggleMute: () => {
    const muted = !get().muted;
    audioEl.muted = muted;
    set({ muted });
  },

  next: (auto = false) => {
    const { queue, current } = get();
    if (!current) return;
    const i = queue.indexOf(current.id);
    const nid = queue[i + 1];
    const ep = nid ? episodeById(nid) : undefined;
    if (ep) get().playEpisode(ep, queue);
    else if (auto) set({ isPlaying: false, currentTime: 0 });
  },

  prev: () => {
    const { queue, current, currentTime } = get();
    if (!current) return;
    if (currentTime > 5) {
      get().seek(0);
      return;
    }
    const i = queue.indexOf(current.id);
    const pid = queue[i - 1];
    const ep = pid ? episodeById(pid) : undefined;
    if (ep) get().playEpisode(ep, queue);
    else get().seek(0);
  },

  toggleFavorite: (id) => {
    const favs = get().favorites;
    const nextFavs = favs.includes(id) ? favs.filter((f) => f !== id) : [id, ...favs];
    set({ favorites: nextFavs });
    LS.set("wits-favorites", nextFavs);
    get().toast(favs.includes(id) ? "Removed from favorites" : "Saved to favorites ♥", "success");
  },

  addBookmark: (id, time) => {
    const bm = { ...get().bookmarks };
    const list = bm[id] ?? [];
    if (list.some((t) => Math.abs(t - time) < 3)) {
      get().toast("You already bookmarked this moment", "info");
      return;
    }
    bm[id] = [...list, Math.floor(time)].sort((a, b) => a - b);
    set({ bookmarks: bm });
    LS.set("wits-bookmarks", bm);
    get().toast(`Bookmark saved at ${Math.floor(time)}s`, "success");
  },

  removeBookmark: (id, time) => {
    const bm = { ...get().bookmarks };
    bm[id] = (bm[id] ?? []).filter((t) => t !== time);
    set({ bookmarks: bm });
    LS.set("wits-bookmarks", bm);
  },

  toggleTheme: () => {
    const theme = get().theme === "dark" ? "light" : "dark";
    set({ theme });
    LS.set("wits-theme", theme);
  },

  toast: (msg, kind = "info") => {
    const id = ++toastSeq;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, msg, kind }] }));
    window.setTimeout(() => get().dismissToast(id), 3600);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/* ---------- Wire the audio element once (call from App root) ---------- */
export function bindAudioEvents() {
  const a = audioEl;
  a.volume = useStore.getState().volume;
  a.addEventListener("timeupdate", () => {
    const t = a.currentTime;
    useStore.setState({ currentTime: t });
    // persist resume point every ~5s
    const now = Date.now();
    if (now - lastSave > 5000) {
      lastSave = now;
      const ep = useStore.getState().current;
      if (ep) LS.set("wits-last", { id: ep.id, time: Math.floor(t) });
    }
  });
  a.addEventListener("loadedmetadata", () => {
    useStore.setState({ duration: a.duration });
  });
  a.addEventListener("ended", () => {
    useStore.setState({ isPlaying: false, currentTime: 0 });
    useStore.getState().next(true);
  });
  a.addEventListener("error", () => {
    if (useStore.getState().current) {
      useStore.getState().toast("Couldn't load the audio — check your connection", "error");
      useStore.setState({ isPlaying: false });
    }
  });
}

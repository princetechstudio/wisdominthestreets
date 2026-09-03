import { format, formatDistanceToNowStrict } from "date-fns";

/* ============================================================
   WITS CMS — types, seed data and formatting helpers
   ============================================================ */

export type Category = "Motivation" | "Business" | "Life" | "Relationships";
export const CATEGORIES: Category[] = ["Motivation", "Business", "Life", "Relationships"];

export const TOPICS = ["Hustle", "Fear", "Money", "Family", "Discipline", "Purpose"] as const;
export type Topic = (typeof TOPICS)[number];

export interface ShowNote {
  time: number;
  label: string;
}

export interface Palette {
  a: string;
  b: string;
  accent: string;
}

export const PALETTES: Palette[] = [
  { a: "#112240", b: "#0d3b3a", accent: "#64ffda" },
  { a: "#1a1030", b: "#3d1608", accent: "#ff6b35" },
  { a: "#0e2a45", b: "#123f2e", accent: "#7ef0c0" },
  { a: "#2b1220", b: "#4a2508", accent: "#ffd166" },
  { a: "#101d38", b: "#27395e", accent: "#8ab4ff" },
];

export interface Episode {
  id: number;
  num: string;
  title: string;
  guest?: { name: string; role: string };
  category: Category;
  duration: number; // seconds
  date: string; // ISO
  plays: number;
  status: "published" | "draft";
  tags: string[];
  description: string;
  showNotes: ShowNote[];
  palette: Palette;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  episode: string;
  topic: Topic;
  featured: boolean;
}

export type MessageType = "general" | "guest" | "booking";

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  type: MessageType;
  date: string; // ISO
  read: boolean;
  archived: boolean;
}

export type ActivityKind = "episode" | "quote" | "message" | "system";

export interface Activity {
  id: number;
  kind: ActivityKind;
  text: string;
  ts: number;
}

export interface Settings {
  showName: string;
  tagline: string;
  host: string;
  email: string;
  whatsapp: string;
  spotify: string;
  apple: string;
  youtube: string;
  rss: string;
}

export interface WeekStat {
  label: string;
  plays: number;
  subs: number;
}

export interface PlatformShare {
  name: string;
  pct: number;
  color: string;
}

/* ---------------- formatting helpers ---------------- */
export const fmtClock = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};
export const fmtPlays = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtDate = (iso: string) => format(new Date(iso), "MMM d, yyyy");
export const timeAgo = (ts: number | string) =>
  formatDistanceToNowStrict(new Date(ts), { addSuffix: true });

let uidSeq = 1000;
export const uid = () => ++uidSeq + Math.floor(Math.random() * 9000);

/* ---------------- seed: episodes ---------------- */
const notes = (rows: [number, string][]): ShowNote[] => rows.map(([time, label]) => ({ time, label }));

export const SEED_EPISODES: Episode[] = [
  {
    id: 1, num: "001", title: "The Corner Raised Me", category: "Life", duration: 2538,
    date: "2025-03-07", plays: 15240, status: "published", tags: ["origin", "community"],
    description: "Where it all began — the bench, the elders, and the lessons nobody wrote down.",
    guest: undefined, palette: PALETTES[0],
    showNotes: notes([[0, "Cold open — the bench"], [312, "What the elders knew"], [1240, "Why I started recording"], [2210, "Corner rules"]]),
  },
  {
    id: 2, num: "002", title: "Hustle Is a Language", category: "Business", duration: 3066,
    date: "2025-03-21", plays: 18920, status: "published", tags: ["hustle", "craft"],
    description: "KJ breaks down street hustle as a skill stack — pricing, pitch and patience.",
    guest: { name: 'Kwame "KJ" Mensah', role: "Serial hustler & market strategist" }, palette: PALETTES[1],
    showNotes: notes([[0, "Meet KJ"], [428, "Pricing on the pavement"], [1502, "The patience stack"], [2700, "Rapid fire"]]),
  },
  {
    id: 3, num: "003", title: "Fear Is a Liar With a Microphone", category: "Motivation", duration: 2324,
    date: "2025-04-04", plays: 22480, status: "published", tags: ["fear", "mindset"],
    description: "Fear talks loud because it knows you're listening. Here's how to take the mic back.",
    guest: undefined, palette: PALETTES[4],
    showNotes: notes([[0, "The loudest voice in the room"], [540, "Naming the fear"], [1330, "Exposure reps"], [2050, "Listener voice note"]]),
  },
  {
    id: 4, num: "004", title: "Money Conversations Nobody Has", category: "Business", duration: 3451,
    date: "2025-04-18", plays: 26750, status: "published", tags: ["money", "family"],
    description: "Ama Serwaa on salaries at the dinner table, black tax and building quietly.",
    guest: { name: "Ama Serwaa", role: "Financial coach, Cedi & Sense" }, palette: PALETTES[2],
    showNotes: notes([[0, "The taboo"], [615, "Black tax, honest talk"], [1870, "The quiet-build method"], [3050, "Ama's 3 rules"]]),
  },
  {
    id: 5, num: "005", title: "Love, Loyalty & Street Logic", category: "Relationships", duration: 2832,
    date: "2025-05-02", plays: 24130, status: "published", tags: ["love", "loyalty"],
    description: "Why the corner's loyalty code works — and where it quietly breaks your relationships.",
    guest: undefined, palette: PALETTES[3],
    showNotes: notes([[0, "The code"], [480, "Where loyalty goes wrong"], [1690, "Repair conversations"], [2520, "Voice notes"]]),
  },
  {
    id: 6, num: "006", title: "The Day I Almost Quit", category: "Life", duration: 2405,
    date: "2025-05-16", plays: 28910, status: "published", tags: ["resilience", "story"],
    description: "Episode 112 of trying. The unedited story of the Tuesday I nearly deleted the show.",
    guest: undefined, palette: PALETTES[0],
    showNotes: notes([[0, "Tuesday"], [398, "The numbers that hurt"], [1305, "One voice note"], [2100, "Why I stayed"]]),
  },
  {
    id: 7, num: "007", title: "Build in Silence", category: "Business", duration: 2998,
    date: "2025-05-30", plays: 31240, status: "published", tags: ["focus", "craft"],
    description: "Daniel Ofori on deep work from a one-room shop — no announcements, just evidence.",
    guest: { name: "Daniel Ofori", role: "Founder, Ofori Woodworks" }, palette: PALETTES[2],
    showNotes: notes([[0, "The one-room shop"], [520, "Announcements vs evidence"], [1720, "The 6-month rule"], [2660, "Daniel's bench test"]]),
  },
  {
    id: 8, num: "008", title: "Fatherhood From the Pavement", category: "Life", duration: 3260,
    date: "2025-06-13", plays: 34680, status: "published", tags: ["family", "men"],
    description: "Kojo Antwi on raising sons with the street as a classroom — not a threat.",
    guest: { name: "Kojo Antwi", role: "Father of three & youth mentor" }, palette: PALETTES[1],
    showNotes: notes([[0, "The classroom outside"], [610, "What sons watch"], [1955, "Hard conversations"], [2900, "Kojo's letter"]]),
  },
  {
    id: 9, num: "009", title: "Your Circle Is Your Ceiling", category: "Relationships", duration: 2207,
    date: "2025-06-27", plays: 37950, status: "published", tags: ["circle", "growth"],
    description: "You don't outgrow your dreams — you outgrow the conversations around them.",
    guest: undefined, palette: PALETTES[4],
    showNotes: notes([[0, "The audit"], [445, "Kind distance"], [1260, "Building upwards"], [1980, "Listener stories"]]),
  },
  {
    id: 10, num: "010", title: "Real Wisdom. Real Streets. Real Talk.", category: "Motivation", duration: 2700,
    date: "2025-07-11", plays: 42310, status: "published", tags: ["milestone", "best-of"],
    description: "Ten episodes in. The lines that hit hardest, the moments that mattered, and what season two changes.",
    guest: undefined, palette: PALETTES[3],
    showNotes: notes([[0, "Ten deep"], [530, "Best listener lines"], [1490, "Season two roadmap"], [2380, "Thank you"]]),
  },
  {
    id: 11, num: "011", title: "The Season Nobody Saw Coming", category: "Life", duration: 2580,
    date: "2025-07-25", plays: 0, status: "draft", tags: ["season-2", "teaser"],
    description: "Season two teaser — draft copy. Do not publish until the trailer is cut and the artwork swap is approved.",
    guest: undefined, palette: PALETTES[2],
    showNotes: notes([[0, "Cold open (pending)"], [480, "New format reveal"], [1900, "Outro tag"]]),
  },
];

/* ---------------- seed: quotes ---------------- */
export const SEED_QUOTES: Quote[] = [
  { id: 1, text: "The street doesn't grade your homework. It grades your consistency.", author: "Marvin Marbell", episode: "EP 001", topic: "Discipline", featured: true },
  { id: 2, text: "Hustle is a language — and most people only know the greeting.", author: "Marvin Marbell", episode: "EP 002", topic: "Hustle", featured: true },
  { id: 3, text: "Fear talks loud because it knows you're listening.", author: "Marvin Marbell", episode: "EP 003", topic: "Fear", featured: true },
  { id: 4, text: "Money arguments at the dinner table are really respect arguments in disguise.", author: "Ama Serwaa", episode: "EP 004", topic: "Money", featured: false },
  { id: 5, text: "Loyalty without truth is just organised silence.", author: "Marvin Marbell", episode: "EP 005", topic: "Family", featured: false },
  { id: 6, text: "You didn't fail. You got feedback with a delivery fee.", author: "Marvin Marbell", episode: "EP 006", topic: "Fear", featured: false },
  { id: 7, text: "Announce less. Let the evidence do the shouting.", author: "Daniel Ofori", episode: "EP 007", topic: "Discipline", featured: true },
  { id: 8, text: "Your son isn't listening to your advice. He's memorising your habits.", author: "Kojo Antwi", episode: "EP 008", topic: "Family", featured: true },
  { id: 9, text: "You don't outgrow your dreams — you outgrow the conversations around them.", author: "Marvin Marbell", episode: "EP 009", topic: "Purpose", featured: false },
  { id: 10, text: "A circle that never stretches you is a fence with a view.", author: "Marvin Marbell", episode: "EP 009", topic: "Purpose", featured: false },
  { id: 11, text: "Wisdom is what's left when the noise leaves the corner.", author: "Marvin Marbell", episode: "EP 010", topic: "Purpose", featured: false },
  { id: 12, text: "Save like the street owes you. Spend like the street is watching.", author: "Ama Serwaa", episode: "EP 004", topic: "Money", featured: false },
];

/* ---------------- seed: messages ---------------- */
export const SEED_MESSAGES: Message[] = [
  {
    id: 1, name: "Efua Mensimah", email: "efua.m@example.com", type: "guest",
    subject: "Guest application — youth entrepreneurship in Tamale",
    body: "Hi Marvin, I run a maker-space for 40+ teens in Tamale and your EP 007 episode is basically our Friday sermon. I'd love to come on and talk about building where the infrastructure is thin — happy to send my one-pager.",
    date: "2025-07-18T09:24:00", read: false, archived: false,
  },
  {
    id: 2, name: "Yaw Darko Events", email: "bookings@yawdarko.gh", type: "booking",
    subject: "Paid appearance — Accra Business Week panel",
    body: "We'd like to book Marvin for a 40-minute fireside at Accra Business Week (Oct 12). Budget available, travel covered. Can the team share availability and rates?",
    date: "2025-07-16T14:02:00", read: false, archived: false,
  },
  {
    id: 3, name: "Kwabena O.", email: "kwabena.o@example.com", type: "general",
    subject: "EP 006 kept me going — thank you",
    body: "I almost closed my shop in March. Played EP 006 on repeat that week. Still open. Just wanted the corner to know the corner matters.",
    date: "2025-07-12T20:41:00", read: true, archived: false,
  },
  {
    id: 4, name: "Adjoa from Cedi & Sense", email: "adjoa@cedisense.com", type: "general",
    subject: "Ama's EP 004 clip — permission for our newsletter",
    body: "Can we quote the 'respect arguments' line in our August newsletter with a link back to the episode?",
    date: "2025-07-09T11:15:00", read: true, archived: false,
  },
  {
    id: 5, name: "Spam Bot 3000", email: "growth@totally-real.biz", type: "general",
    subject: "10,000 REAL listeners!!! guaranteed!!!",
    body: "Dear podcast owner, send $50 and receive ten thousand real human listeners within 24 hours…",
    date: "2025-07-02T03:03:00", read: true, archived: true,
  },
];

/* ---------------- seed: activity / stats / platforms ---------------- */
const ago = (mins: number) => Date.now() - mins * 60_000;

export const SEED_ACTIVITY: Activity[] = [
  { id: 1, kind: "episode", text: "EP 011 saved as draft — season two teaser", ts: ago(42) },
  { id: 2, kind: "message", text: "New guest application from Efua Mensimah", ts: ago(130) },
  { id: 3, kind: "message", text: "Booking enquiry — Accra Business Week", ts: ago(2900) },
  { id: 4, kind: "quote", text: "Kojo Antwi's line from EP 008 pinned as featured", ts: ago(4300) },
  { id: 5, kind: "episode", text: "EP 010 published — milestone episode", ts: ago(9800) },
  { id: 6, kind: "system", text: "RSS feed regenerated for platforms", ts: ago(10100) },
  { id: 7, kind: "quote", text: "2 new quotes imported from EP 009 transcript", ts: ago(15000) },
  { id: 8, kind: "episode", text: "EP 009 show notes updated with timestamps", ts: ago(20200) },
];

export const WEEKLY: WeekStat[] = [
  { label: "Apr 21", plays: 9800, subs: 14210 },
  { label: "Apr 28", plays: 10650, subs: 14690 },
  { label: "May 5", plays: 12400, subs: 15180 },
  { label: "May 12", plays: 11900, subs: 15540 },
  { label: "May 19", plays: 13750, subs: 16010 },
  { label: "May 26", plays: 15300, subs: 16390 },
  { label: "Jun 2", plays: 14900, subs: 16720 },
  { label: "Jun 9", plays: 16800, subs: 17050 },
  { label: "Jun 16", plays: 18250, subs: 17420 },
  { label: "Jun 23", plays: 19600, subs: 17740 },
  { label: "Jun 30", plays: 22100, subs: 18060 },
  { label: "Jul 7", plays: 24600, subs: 18420 },
];

export const PLATFORMS: PlatformShare[] = [
  { name: "Spotify", pct: 46, color: "#64ffda" },
  { name: "Apple Podcasts", pct: 24, color: "#ff6b35" },
  { name: "YouTube", pct: 19, color: "#ffd166" },
  { name: "Other apps", pct: 11, color: "#8892b0" },
];

export const SEED_SETTINGS: Settings = {
  showName: "Wisdom In The Streets",
  tagline: "Real Wisdom. Real Streets. Real Talk.",
  host: "Marvin Marbell",
  email: "thecorner@witspodcast.com",
  whatsapp: "0273996065",
  spotify: "https://open.spotify.com/show/wisdom-in-the-streets",
  apple: "https://podcasts.apple.com/show/wisdom-in-the-streets",
  youtube: "https://youtube.com/@WITSPodcast",
  rss: "https://witspodcast.com/feed.xml",
};

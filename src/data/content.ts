/* ============================================================
   Wisdom In The Streets — content & mock data layer
   In production these records would come from PostgreSQL/Mongo
   via the API routes (see README). The shapes are API-ready.
   ============================================================ */

export const IMAGES = {
  host: "https://image.qwenlm.ai/generated-images/ecdeb684-8b28-415e-9767-a13afa95d8a8/_result.png",
  street: "https://image.qwenlm.ai/generated-images/52d5101e-97ec-4129-a730-390248ff9fbb/_result.png",
  coverArt: "https://image.qwenlm.ai/generated-images/e34a33cd-4557-40ac-b6a6-f6fbed794ba0/_result.png",
};

export type Category = "Motivation" | "Business" | "Life" | "Relationships";

export interface ShowNote {
  time: number; // seconds
  label: string;
}

export interface Guest {
  name: string;
  role: string;
  bio: string;
  handle: string;
  url: string;
}

export interface Episode {
  id: number;
  num: string;
  title: string;
  category: Category;
  tags: string[];
  date: string; // ISO
  duration: number; // seconds (display)
  plays: number;
  audioUrl: string;
  blurb: string;
  description: string;
  guest?: Guest;
  showNotes: ShowNote[];
  palette: { a: string; b: string; accent: string };
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  episode: string;
  topic: string;
}

/* ---------- Category cover palettes ---------- */
export const CATEGORY_META: Record<Category, { accent: string; a: string; b: string }> = {
  Motivation: { accent: "#64ffda", a: "#0d2444", b: "#123a63" },
  Business: { accent: "#ff6b35", a: "#241106", b: "#47200c" },
  Life: { accent: "#8ab4ff", a: "#0e1c3a", b: "#20355f" },
  Relationships: { accent: "#ff7ab0", a: "#2a0e22", b: "#471a37" },
};

const audio = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const EPISODES: Episode[] = [
  {
    id: 1,
    num: "001",
    title: "The Pavement Was My Classroom",
    category: "Motivation",
    tags: ["mindset", "origins"],
    date: "2025-01-10",
    duration: 2304,
    plays: 18432,
    audioUrl: audio(1),
    blurb: "Where it all began — why the corner of Oxford Street taught Marvin more than any lecture hall ever did.",
    description:
      "In the very first episode, Marvin sits on the exact corner where he grew up selling sachet water and opens the series with a raw account of how the street raised him. He breaks down the three teachers every young person skips — failure, boredom and embarrassment — and explains why discipline, not motivation, is the language the pavement speaks. If you only ever listen to one episode, the community says start here.",
    showNotes: [
      { time: 0, label: "Cold open — the corner of Oxford Street" },
      { time: 252, label: "Why the street doesn't grade you" },
      { time: 418, label: "The three teachers everyone skips" },
      { time: 305, label: "Discipline is a love language" },
      { time: 340, label: "Your first assignment" },
    ],
    palette: CATEGORY_META.Motivation,
  },
  {
    id: 2,
    num: "002",
    title: "Hustle Is a Language",
    category: "Business",
    tags: ["entrepreneurship", "hustle"],
    date: "2025-01-24",
    duration: 2710,
    plays: 22154,
    audioUrl: audio(2),
    blurb: "Ama Serwaa grew one market table into three stores. She and Marvin decode the grammar of the daily hustle.",
    description:
      "Ama Serwaa joins the corner with a masterclass in street economics. From pricing by eye contact to building trust faster than any bank, Ama explains how hustle is not noise — it's a language with rules, tenses and fluent speakers. The two trade stories about first losses, first hires, and why your grandmother's ledger beat every app they tried.",
    guest: {
      name: "Ama Serwaa",
      role: "Founder, Serwaa Provisions",
      bio: "Ama turned a single table at Makola Market into a three-store provisions brand employing 14 people. She mentors first-time women traders across Greater Accra.",
      handle: "@ama.serwaa",
      url: "https://instagram.com/ama.serwaa",
    },
    showNotes: [
      { time: 0, label: "Ama's first table at Makola" },
      { time: 180, label: "Pricing with your eyes, not an app" },
      { time: 290, label: "Trust is the real currency" },
      { time: 335, label: "Grandma's ledger vs. the spreadsheet" },
      { time: 300, label: "When the hustle becomes a business" },
    ],
    palette: CATEGORY_META.Business,
  },
  {
    id: 3,
    num: "003",
    title: "What Your Father Never Said",
    category: "Relationships",
    tags: ["family", "fatherhood"],
    date: "2025-02-07",
    duration: 2462,
    plays: 19810,
    audioUrl: audio(3),
    blurb: "A quiet, heavy conversation about silent fathers, inherited strength, and the words we never got to hear.",
    description:
      "The episode listeners message about the most. Marvin reads voice notes sent in by the community — sons and daughters describing fathers who showed love through work, worry and silence. He unpacks why a generation that built with its hands struggled to speak with its heart, and offers a script for starting the conversation before it's too late.",
    showNotes: [
      { time: 0, label: "Voice notes from the community" },
      { time: 205, label: "Love with no vocabulary" },
      { time: 310, label: "The provider wound" },
      { time: 275, label: "A script for the hard conversation" },
      { time: 330, label: "Breaking the silence gently" },
    ],
    palette: CATEGORY_META.Relationships,
  },
  {
    id: 4,
    num: "004",
    title: "Money Conversations Nobody Had With You",
    category: "Business",
    tags: ["money", "financial literacy"],
    date: "2025-02-21",
    duration: 3157,
    plays: 30126,
    audioUrl: audio(4),
    blurb: "Financial coach Kofi Boateng and Marvin cover the money rules school skipped: saving, debt, family pressure and 'black tax'.",
    description:
      "The most-shared episode of the season. Kofi Boateng brings his 'Cedi Sense' framework to the corner: pay the future you first, debt is a guest that over-stays, and family money requests deserve a budget line — not guilt. Marvin confesses his own money mistakes from age 19, and the two build a simple 50/30/20 plan you can start this Friday on any income.",
    guest: {
      name: "Kofi Boateng",
      role: "Financial coach, Cedi Sense",
      bio: "Kofi runs the Cedi Sense newsletter read by 40,000+ young Ghanaians and coaches first-generation earners on money without shame.",
      handle: "@kofibmoney",
      url: "https://instagram.com/kofibmoney",
    },
    showNotes: [
      { time: 0, label: "Marvin's money mistakes at 19" },
      { time: 195, label: "Pay the future you first" },
      { time: 280, label: "Debt is a guest that over-stays" },
      { time: 320, label: "Family requests & 'black tax'" },
      { time: 350, label: "The Friday 50/30/20 plan" },
    ],
    palette: CATEGORY_META.Business,
  },
  {
    id: 5,
    num: "005",
    title: "Grief Sits on the Front Steps",
    category: "Life",
    tags: ["grief", "healing"],
    date: "2025-03-07",
    duration: 2875,
    plays: 24603,
    audioUrl: audio(5),
    blurb: "Grief counsellor Dr. Efua Mensah on mourning in a culture that says 'be strong' — and why strength includes tears.",
    description:
      "Dr. Efua Mensah joins Marvin for the tenderest hour of the season. They discuss how Ghanaian funerals hold a whole community, yet the quiet months afterwards hold no one. Efua shares the 'front steps' practice — giving grief a daily place to sit — and the two answer listener letters about losing parents, friends and versions of themselves.",
    guest: {
      name: "Dr. Efua Mensah",
      role: "Grief counsellor, University of Ghana",
      bio: "Efua has spent 15 years counselling families through loss and leads community healing circles in Osu every month.",
      handle: "@drefua.heals",
      url: "https://instagram.com/drefua.heals",
    },
    showNotes: [
      { time: 0, label: "The funeral holds you — then it ends" },
      { time: 215, label: "'Be strong' and other traps" },
      { time: 305, label: "The front steps practice" },
      { time: 345, label: "Listener letters" },
      { time: 260, label: "Tears are also strength" },
    ],
    palette: CATEGORY_META.Life,
  },
  {
    id: 6,
    num: "006",
    title: "Street Lights & Late Nights",
    category: "Life",
    tags: ["reflection", "solitude"],
    date: "2025-03-21",
    duration: 2208,
    plays: 17302,
    audioUrl: audio(6),
    blurb: "A solo night-walk episode. Marvin talks solitude, comparison, and the thoughts that only visit after 11pm.",
    description:
      "Recorded on an actual night walk from Osu to Jamestown, this solo episode is Marvin thinking out loud about the hours when the street is honest. He unpacks comparison as 'paying somebody else's rent with your peace', defends doing nothing on Sundays, and reads a poem his late auntie wrote in 1987.",
    showNotes: [
      { time: 0, label: "Recording on the move — Osu to Jamestown" },
      { time: 185, label: "The 11pm visitor: comparison" },
      { time: 270, label: "In defence of boring Sundays" },
      { time: 315, label: "Auntie's poem, 1987" },
      { time: 340, label: "Walk home safe — closing" },
    ],
    palette: CATEGORY_META.Life,
  },
  {
    id: 7,
    num: "007",
    title: "Love in the Time of Side Hustles",
    category: "Relationships",
    tags: ["love", "balance"],
    date: "2025-04-04",
    duration: 2956,
    plays: 27884,
    audioUrl: audio(7),
    blurb: "Nana Adjoa and Marvin argue (lovingly) about dating when everyone has two jobs, a brand and no sleep.",
    description:
      "Nana Adjoa of Soft Life Radio brings heat and humour to the corner. The two debate whether 'soft life' is a standard or an escape, why a good partner is infrastructure not distraction, and how to love somebody whose phone never stops buzzing with orders. Ends with the community's favourite segment: 'Red flag, green flag, Accra flag.'",
    guest: {
      name: "Nana Adjoa",
      role: "Host, Soft Life Radio",
      bio: "Nana hosts one of West Africa's fastest-growing relationship podcasts and is famous for her no-nonsense 'flags' segment.",
      handle: "@nanatalks",
      url: "https://instagram.com/nanatalks",
    },
    showNotes: [
      { time: 0, label: "Soft life: standard or escape?" },
      { time: 225, label: "A partner is infrastructure" },
      { time: 310, label: "Loving a busy phone" },
      { time: 355, label: "Red flag, green flag, Accra flag" },
      { time: 240, label: "Splitting the bill, splitting the dream" },
    ],
    palette: CATEGORY_META.Relationships,
  },
  {
    id: 8,
    num: "008",
    title: "The Discipline of Small Doors",
    category: "Motivation",
    tags: ["discipline", "habits"],
    date: "2025-04-18",
    duration: 2601,
    plays: 21456,
    audioUrl: audio(8),
    blurb: "Why Marvin bows through small doors: a systems-first episode on habits, humility and showing up when nobody claps.",
    description:
      "No guests, no gimmicks — just Marvin and the whiteboard. He explains the 'small doors' theory: every humble entrance is training for a bigger gate. The episode walks through his actual weekly system — the 5am call, the 90-minute deep block, the Sunday review — and why consistency beats intensity every single week of the year.",
    showNotes: [
      { time: 0, label: "The small doors theory" },
      { time: 190, label: "The 5am call (non-negotiable)" },
      { time: 285, label: "The 90-minute deep block" },
      { time: 330, label: "Sunday review ritual" },
      { time: 300, label: "Consistency > intensity" },
    ],
    palette: CATEGORY_META.Motivation,
  },
  {
    id: 9,
    num: "009",
    title: "From Makola to Boardrooms",
    category: "Business",
    tags: ["legacy", "retail"],
    date: "2025-05-02",
    duration: 3309,
    plays: 33248,
    audioUrl: audio(9),
    blurb: "Auntie Comfort Owusu — 30 years trading at Makola — on negotiation, motherhood and building a name that outlives you.",
    description:
      "The most requested guest in the show's history finally sits down. Auntie Comfort has fed, clothed and credit-sold to three generations of Accra. She negotiates live with Marvin on air (she wins), explains why 'your name is your first shop', and reveals the family constitution she wrote in 1998 that still governs her business today.",
    guest: {
      name: "Comfort Owusu",
      role: "Trader & matriarch, Makola Market",
      bio: "'Auntie Comfort' has traded textiles at Makola for 30 years, raised five children through her stall, and chairs the market women's welfare association.",
      handle: "@auntiecomfort.makola",
      url: "https://instagram.com/auntiecomfort.makola",
    },
    showNotes: [
      { time: 0, label: "Auntie Comfort arrives (in style)" },
      { time: 240, label: "Live negotiation — she wins" },
      { time: 330, label: "Your name is your first shop" },
      { time: 295, label: "The 1998 family constitution" },
      { time: 360, label: "What she wants for her granddaughters" },
    ],
    palette: CATEGORY_META.Business,
  },
  {
    id: 10,
    num: "010",
    title: "Wisdom Is Not a Destination",
    category: "Motivation",
    tags: ["season finale", "community"],
    date: "2025-05-16",
    duration: 3524,
    plays: 41562,
    audioUrl: audio(10),
    blurb: "The season one finale — every guest returns for a roundtable on the corner. Listeners ask the final questions.",
    description:
      "The whole season comes home. Ama, Kofi, Efua, Nana and Auntie Comfort crowd onto the corner for a roundtable moderated by listener questions: 'Is wisdom inherited or earned?' 'What do you tell your 18-year-old self now?' 'Where is the street in 10 years?' It ends with Marvin's now-famous closing line and a teaser for the Jamestown live sessions.",
    guest: {
      name: "The Season One Panel",
      role: "Ama, Kofi, Efua, Nana & Auntie Comfort",
      bio: "All five season-one guests return for the finale roundtable — the most downloaded hour in the show's history.",
      handle: "@WITS_Podcast",
      url: "https://instagram.com/WITS_Podcast",
    },
    showNotes: [
      { time: 0, label: "The corner, but crowded" },
      { time: 260, label: "Is wisdom inherited or earned?" },
      { time: 320, label: "Letters to our 18-year-old selves" },
      { time: 290, label: "Where is the street in 10 years?" },
      { time: 355, label: "Marvin's closing line + season 2 teaser" },
    ],
    palette: CATEGORY_META.Motivation,
  },
];

export const FEATURED_EPISODE = EPISODES[EPISODES.length - 1];

/* ---------- Quotes (20) ---------- */
export const QUOTES: Quote[] = [
  { id: 1, text: "The street doesn't care about your certificate. It cares whether you show up when it rains.", author: "Marvin Marbell", episode: "EP 001", topic: "Hustle" },
  { id: 2, text: "Your hustle should speak so clearly that your mouth can rest.", author: "Ama Serwaa", episode: "EP 002", topic: "Hustle" },
  { id: 3, text: "Failure is tuition. Most people just keep skipping class and wondering about the fee.", author: "Marvin Marbell", episode: "EP 001", topic: "Failure" },
  { id: 4, text: "Money is a terrible master but a brilliant apprentice. Put it to school.", author: "Kofi Boateng", episode: "EP 004", topic: "Money" },
  { id: 5, text: "Save like the bill is coming — because it is. Spend like the blessing is here — because it is.", author: "Marvin Marbell", episode: "EP 004", topic: "Money" },
  { id: 6, text: "Rich is a number. Wealth is a Tuesday morning with nothing to fear.", author: "Marvin Marbell", episode: "EP 004", topic: "Money" },
  { id: 7, text: "A father's silence is not an absence of love. Sometimes it is love with no vocabulary.", author: "Marvin Marbell", episode: "EP 003", topic: "Family" },
  { id: 8, text: "You don't heal by leaving home. You heal by rearranging the furniture inside you.", author: "Dr. Efua Mensah", episode: "EP 005", topic: "Family" },
  { id: 9, text: "Grief is just love that missed its appointment. Let it sit with you.", author: "Dr. Efua Mensah", episode: "EP 005", topic: "Faith" },
  { id: 10, text: "Discipline is choosing the person you're becoming over the mood you're in.", author: "Marvin Marbell", episode: "EP 008", topic: "Discipline" },
  { id: 11, text: "Small doors teach you to bow. One day you'll walk through gates without bending.", author: "Marvin Marbell", episode: "EP 008", topic: "Discipline" },
  { id: 12, text: "Show up on the boring days. The loud days will take care of themselves.", author: "Marvin Marbell", episode: "EP 008", topic: "Discipline" },
  { id: 13, text: "Love is not a break from the hustle. A good partner is infrastructure.", author: "Nana Adjoa", episode: "EP 007", topic: "Love" },
  { id: 14, text: "Marry someone who claps when your phone lights up with money — not someone who counts the minutes you spent earning it.", author: "Nana Adjoa", episode: "EP 007", topic: "Love" },
  { id: 15, text: "I buried three businesses before 25. The graveyard is where my MBA is.", author: "Comfort Owusu", episode: "EP 009", topic: "Failure" },
  { id: 16, text: "The trader who shades her goods at noon already knows the sun will turn. Plan for the turn.", author: "Comfort Owusu", episode: "EP 009", topic: "Hustle" },
  { id: 17, text: "Faith is not the absence of shaking knees. It is walking anyway.", author: "Marvin Marbell", episode: "EP 006", topic: "Faith" },
  { id: 18, text: "Comparison is paying somebody else's rent with your peace.", author: "Marvin Marbell", episode: "EP 006", topic: "Hustle" },
  { id: 19, text: "Community is remembering somebody's order. That is how the corner loves you.", author: "Marvin Marbell", episode: "EP 010", topic: "Community" },
  { id: 20, text: "You can't download wisdom. You have to stand where it rains — and stay.", author: "Marvin Marbell", episode: "EP 010", topic: "Community" },
];

export const QUOTE_TOPICS = ["All", "Hustle", "Money", "Discipline", "Family", "Love", "Faith", "Failure", "Community"];

/* ---------- Stats, testimonials, story ---------- */
export const STATS = [
  { label: "Episodes released", value: 10, suffix: "" },
  { label: "Plays across platforms", value: 256400, suffix: "+" },
  { label: "Countries reached", value: 42, suffix: "" },
  { label: "Community followers", value: 85200, suffix: "+" },
];

export const TESTIMONIALS = [
  { quote: "I play one episode every Monday before I open my shop. It's like Marvin reads my week before I live it.", name: "Akosua B.", place: "Kumasi, Ghana" },
  { quote: "Episode 004 changed how my wife and I talk about money. We finally have a budget that survives us both.", name: "Daniel O.", place: "Accra, Ghana" },
  { quote: "I found this podcast in London, homesick and tired. For 40 minutes, the streets of Accra came through my headphones.", name: "Efua K.", place: "London, UK" },
  { quote: "My father and I listened to Episode 003 together in the car. We talked for three hours after. Thank you, Marvin.", name: "Kwame A.", place: "Takoradi, Ghana" },
];

export const TIMELINE = [
  { year: "2021", title: "A cracked phone and a corner", text: "Marvin records his first voice notes on a cracked Tecno phone between shifts — wisdom overheard at the lorry station, saved before it fades." },
  { year: "2022", title: "The Pavement Sessions", text: "Twelve raw, unedited conversations with traders, drivers and barbers. Fifty loyal listeners. Zero sponsors. Everything that matters." },
  { year: "Jan 2025", title: "Wisdom In The Streets launches", text: "Episode 001 drops and enters the top 50 self-improvement charts in Ghana within its first week. The corner gets louder." },
  { year: "May 2025", title: "250K plays, 40+ countries", text: "From Accra to Atlanta to Amsterdam — the season one finale becomes the most-shared episode in the show's history." },
  { year: "Next", title: "Live from Jamestown", text: "The first open-street recording sessions: chairs in a circle, a mic in the middle, and the community asking the questions." },
];

export const VALUES = [
  { title: "No scripts, no pretence", text: "Conversations stay unpolished on purpose. If it stutters, it stays — real talk doesn't come with a teleprompter." },
  { title: "Lift as you climb", text: "Every guest leaves a ladder behind: a contact, a framework, a first step for the listener still on the corner." },
  { title: "Stories over statistics", text: "Data informs the show, but a trader's Tuesday teaches it. We trust the scar more than the spreadsheet." },
  { title: "The street teaches", text: "Lorry stations, markets and barbershops are classrooms. The show just puts a microphone where the lesson already lives." },
];

/* ---------- Links & socials ---------- */
export const WHATSAPP_DISPLAY = "027 399 6065";
export const WHATSAPP_INTL = "233273996065";
export const CONTACT_EMAIL = "hello@witspodcast.com";

export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(text)}`;

export const SOCIALS = [
  { label: "Instagram", handle: "@WITS_Podcast", url: "https://instagram.com/WITS_Podcast" },
  { label: "X (Twitter)", handle: "@WITS_Podcast", url: "https://x.com/WITS_Podcast" },
  { label: "YouTube", handle: "WITS Podcast", url: "https://youtube.com/@WITSPodcast" },
  { label: "LinkedIn", handle: "WITS Podcast", url: "https://linkedin.com/company/wits-podcast" },
  { label: "TikTok", handle: "@wits_podcast", url: "https://tiktok.com/@wits_podcast" },
];

export const PLATFORMS = [
  { label: "Spotify", url: "https://open.spotify.com/show/wisdom-in-the-streets", note: "Follow the show" },
  { label: "Apple Podcasts", url: "https://podcasts.apple.com/show/wisdom-in-the-streets", note: "Rate ★★★★★" },
  { label: "YouTube", url: "https://youtube.com/@WITSPodcast", note: "Watch full video" },
  { label: "RSS Feed", url: "https://witspodcast.com/feed.xml", note: "Any podcast app" },
];

export const HOST = {
  name: "Marvin Marbell",
  role: "Host & Creator",
  tagline: "Real Wisdom. Real Streets. Real Talk.",
  bio: [
    "Marvin Marbell grew up between a lorry station in Jamestown and a classroom in Osu, and he never fully decided which one raised him — so he lets both speak. After six years in sales and one failed logistics startup, he started recording the wisdom he kept overhearing on street corners: traders negotiating like diplomats, drivers philosophising between fares, aunties dispensing financial advice sharper than any bank's.",
    "Wisdom In The Streets is the result — a weekly motivational podcast where the microphone sits at street level. Marvin's gift is translation: he takes the raw, unpolished intelligence of the street and frames it so a student in Legon, a trader in Makola and a nurse in London can all carry it home.",
    "When he's not recording, Marvin mentors first-time founders, hosts the monthly Osu healing-and-hustle circles, and is usually — reliably — late for everything except the 5am call.",
  ],
  mission: "To prove that wisdom is not gated by degrees or boardrooms — it lives on every corner, and it deserves a microphone.",
  vision: "A generation that stops waiting for permission to grow: one street conversation at a time, from Accra to everywhere.",
};

/* ---------- Small helpers ---------- */
export const fmtDuration = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const fmtClock = (secs: number) => {
  if (!Number.isFinite(secs)) return "0:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
};

export const fmtDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const fmtPlays = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : `${n}`);

export const episodeById = (id: number) => EPISODES.find((e) => e.id === id);

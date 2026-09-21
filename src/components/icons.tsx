/* Hand-drawn inline SVG icon set — single source, stroke-based, inherits currentColor. */

export type IconProps = { size?: number; className?: string };

const base = (p: IconProps) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className,
  "aria-hidden": true as const,
});

/* ---------- Brand ---------- */
export const LogoMark = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <rect x="9" y="2.5" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" stroke="var(--wits-ember)" />
    <line x1="12" y1="17.5" x2="12" y2="20.5" stroke="var(--wits-ember)" />
    <path d="M2.5 21.5h5M9.5 21.5h5M16.5 21.5h5" stroke="var(--wits-ember)" strokeWidth={1.6} />
  </svg>
);

/* ---------- Player ---------- */
export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7.5 4.8v14.4L19.5 12z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPause = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="6.5" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const IconNext = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 5.5v13l9-6.5z" fill="currentColor" stroke="none" />
    <line x1="18" y1="5.5" x2="18" y2="18.5" strokeWidth={2.2} />
  </svg>
);
export const IconPrev = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 5.5v13l-9-6.5z" fill="currentColor" stroke="none" />
    <line x1="6" y1="5.5" x2="6" y2="18.5" strokeWidth={2.2} />
  </svg>
);
export const IconSkipFwd = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.8 3.5v3.4h-3.4" />
    <text x="12" y="15.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none">15</text>
  </svg>
);
export const IconSkipBack = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.2 3.5v3.4h3.4" />
    <text x="12" y="15.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none">15</text>
  </svg>
);
export const IconVolume = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
    <path d="M15 9a4.2 4.2 0 0 1 0 6" />
    <path d="M17.5 6.8a8 8 0 0 1 0 10.4" />
  </svg>
);
export const IconMute = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
    <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
  </svg>
);

/* ---------- Actions ---------- */
export const IconHeart = (p: IconProps & { filled?: boolean }) => (
  <svg {...base(p)}>
    <path
      d="M12 20.5s-7.6-4.9-9.6-9.1A5.4 5.4 0 0 1 12 6.6a5.4 5.4 0 0 1 9.6 4.8c-2 4.2-9.6 9.1-9.6 9.1z"
      fill={p.filled ? "var(--wits-ember)" : "none"}
      stroke={p.filled ? "var(--wits-ember)" : "currentColor"}
    />
  </svg>
);
export const IconBookmark = (p: IconProps & { filled?: boolean }) => (
  <svg {...base(p)}>
    <path d="M6.5 3.5h11V21L12 16.6 6.5 21z" fill={p.filled ? "currentColor" : "none"} />
  </svg>
);
export const IconDownload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v10.5M7.5 10.5L12 15l4.5-4.5" />
    <path d="M4.5 16.5v2.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
  </svg>
);
export const IconLink = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.2 13.8a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.6 1.6" />
    <path d="M13.8 10.2a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.6-1.6" />
  </svg>
);
export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15.2 15.2L20 20" />
  </svg>
);
export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" />
  </svg>
);
export const IconHeadphones = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3.5" y="13.5" width="4.5" height="7" rx="2" fill="currentColor" stroke="none" />
    <rect x="16" y="13.5" width="4.5" height="7" rx="2" fill="currentColor" stroke="none" />
  </svg>
);
export const IconMic = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5M8.5 21.5h7" />
  </svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M3.5 6.5h17M3.5 12h11M3.5 17.5h17" />
  </svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);
export const IconSun = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
  </svg>
);
export const IconMoon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 13.5A8.5 8.5 0 0 1 10.5 4a8.5 8.5 0 1 0 9.5 9.5z" />
  </svg>
);
export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13.5 5.5L20 12l-6.5 6.5" />
  </svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12H5M10.5 5.5L4 12l6.5 6.5" />
  </svg>
);
export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5.5 9l6.5 6.5L18.5 9" />
  </svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);
export const IconMail = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13.5" rx="2" />
    <path d="M4.5 7.5l7.5 6 7.5-6" />
  </svg>
);
export const IconPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21.5s7-6.4 7-11.5a7 7 0 1 0-14 0c0 5.1 7 11.5 7 11.5z" />
    <circle cx="12" cy="9.8" r="2.5" />
  </svg>
);
export const IconSend = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.5 3.5L10 14M20.5 3.5L14 20.5l-4-6.5-7-3.5z" />
  </svg>
);
export const IconGlobe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S9.4 5.9 12 3.5z" />
  </svg>
);
export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3.5 20c.6-3.5 2.7-5.5 5.5-5.5s4.9 2 5.5 5.5" />
    <path d="M15.5 5.4a3.5 3.5 0 0 1 0 6.2M17.5 14.9c1.6.8 2.6 2.5 3 5.1" />
  </svg>
);
export const IconQuote = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 13.5c0-4.5 2.6-7.6 6.5-9l1 1.8c-2.4 1.1-3.9 2.8-4.2 4.7.4-.2.9-.3 1.4-.3 2 0 3.3 1.4 3.3 3.4S10.5 17.5 8.4 17.5C5.8 17.5 4 15.9 4 13.5zM13.5 13.5c0-4.5 2.6-7.6 6.5-9l1 1.8c-2.4 1.1-3.9 2.8-4.2 4.7.4-.2.9-.3 1.4-.3 2 0 3.3 1.4 3.3 3.4s-1.5 3.4-3.6 3.4c-2.6 0-4.4-1.6-4.4-4z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconExternal = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
    <path d="M13.5 3.5H20.5V10.5M20 4L11.5 12.5" />
  </svg>
);
export const IconStepUp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 20h4.5v-4.5h4.5V11H17V6.5h3.5" />
    <path d="M17 3.5h3.5V7" />
  </svg>
);
export const IconBook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19V3.5H7.5A2.5 2.5 0 0 0 5 6z" />
    <path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H19v-5" />
    <path d="M9.5 8h5.5M9.5 11.5h3.5" />
  </svg>
);
export const IconSignpost = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21.5V4" />
    <path d="M5 5h11l3 2.25L16 9.5H5z" />
    <path d="M19 12H8L5 14.25 8 16.5h11z" />
  </svg>
);
export const IconQueue = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 6h12M3.5 10.5h12M3.5 15h7" />
    <path d="M16 10.5v7.2a2.4 2.4 0 1 1-1.5-2.2" />
    <path d="M16 10.5l4-.8v3" />
  </svg>
);

/* ---------- Social / platform marks (simplified) ---------- */
export const IconWhatsApp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8z" fill="currentColor" stroke="none" />
    <path d="M8.6 8.3c-.4 2.7 3.3 6.8 6.6 7 .9.1 1.5-.5 1.6-1.1l-2-1.5-1.4.9c-1.4-.6-2.6-1.8-3.1-3.1l1-1.4-1.4-2c-.6 0-1.2.4-1.3 1.2z" stroke="var(--wits-panel)" strokeWidth={1.3} fill="none" />
  </svg>
);
export const IconXSocial = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.4}>
    <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />
  </svg>
);
export const IconFacebook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13.4 21.5v-7.3h2.5l.4-3h-2.9V9.3c0-.9.3-1.5 1.6-1.5h1.4V5.1c-.3 0-1.2-.1-2.3-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.4v7.3z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconInstagram = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
export const IconYouTube = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13.5" rx="3.5" fill="currentColor" stroke="none" />
    <path d="M10.2 9.2l4.6 3-4.6 3z" fill="var(--wits-panel)" stroke="none" />
  </svg>
);
export const IconLinkedIn = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M7.6 10.5V17M7.6 7.3v.2M11.4 17v-3.7c0-1.6 1-2.7 2.5-2.7s2.4 1.1 2.4 2.7V17" />
  </svg>
);
export const IconTikTok = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14.3 3.5c.4 2.5 2 4.1 4.5 4.4v2.7c-1.7 0-3.2-.5-4.5-1.4v5.8a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.9 2.9 0 1 0 2 2.7V3.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconSpotify = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M7.6 9.7c3-.9 6.1-.6 8.8 1M8 12.5c2.4-.6 4.9-.4 7.1.9M8.5 15.2c1.8-.4 3.7-.3 5.4.6" />
  </svg>
);
export const IconApple = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.8" />
    <circle cx="12" cy="9.8" r="2.1" fill="currentColor" stroke="none" />
    <path d="M8.6 16.8c.4-2.3 1.6-3.5 3.4-3.5s3 1.2 3.4 3.5" />
  </svg>
);
export const IconRss = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="5.8" cy="18.2" r="1.8" fill="currentColor" stroke="none" />
    <path d="M4.5 11.2A8.3 8.3 0 0 1 12.8 19.5M4.5 5.5A14 14 0 0 1 18.5 19.5" />
  </svg>
);

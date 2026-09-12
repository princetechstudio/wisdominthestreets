# WITS Producer Console

A complete production management dashboard for the **Wisdom In The Streets** podcast. Manage episodes, curate quotes, handle listener messages, and track performance — all in one place.

![WITS Console](https://img.shields.io/badge/Status-Production%20Ready-64ffda?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

### 📊 Dashboard
- **Real-time analytics** — Track plays, subscribers, and completion rates
- **Audience insights** — Platform distribution and growth trends
- **Activity feed** — Monitor all console actions in real-time
- **Draft alerts** — Never forget unpublished episodes
- **Top episodes** — See what's resonating with listeners

### 🎙 Episode Management
- **Create & edit** — Full episode editor with guest info, show notes, and metadata
- **Publish workflow** — Draft → Published with one-click toggle
- **Preview mode** — See exactly what listeners will see before publishing
- **Bulk operations** — Import episodes from JSON, export to CSV
- **Cover art** — Procedurally generated with customizable palettes
- **Show notes** — Timestamped chapters with auto-formatting

### 💬 Quote Library
- **Curate wisdom** — Build your quote collection from episodes
- **Topic organization** — Tag quotes by theme (Hustle, Fear, Money, etc.)
- **Featured quotes** — Pin your best lines for homepage rotation
- **Export ready** — Copy quotes with attribution for social media
- **Search & filter** — Find quotes by text, author, or topic

### 📬 Inbox
- **Message management** — Handle listener messages, guest applications, bookings
- **Bulk operations** — Select all, mark read, archive, delete
- **Reply templates** — Quick responses for common scenarios
- **WhatsApp integration** — One-click replies with pre-filled messages
- **Priority tracking** — Unread badges and category filters

### ⚙️ Settings
- **Show configuration** — Update show name, host, tagline, contact info
- **Platform links** — Manage Spotify, Apple Podcasts, YouTube, RSS URLs
- **Data management** — Export console data as JSON, reset to demo state
- **Persistent storage** — All changes saved to localStorage

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## ⌨️ Keyboard Shortcuts

### Navigation
- `⌘K` / `Ctrl+K` — Open command palette
- `Esc` — Close modal / command palette
- `?` — Show keyboard shortcuts help

### Episodes
- `N` — Create new episode
- `↑` / `↓` — Navigate in lists
- `Enter` — Open selected episode

### Messages
- `A` — Select all messages
- `R` — Mark selected as read
- `Del` — Archive selected messages

### General
- `⌘S` / `Ctrl+S` — Save current changes
- `⌘Z` / `Ctrl+Z` — Undo last action
- `⌘⇧Z` / `Ctrl+Shift+Z` — Redo last action

## 🎯 Command Palette

Press `⌘K` (or `Ctrl+K`) to open the universal command palette:

- **Navigate** — Jump to any section instantly
- **Search** — Find episodes, quotes, or messages
- **Quick actions** — Create new episodes, publish drafts, etc.
- **Fuzzy matching** — Works with partial text

## 📦 Data Structure

### Episodes
```typescript
{
  id: number;
  num: string;              // "001", "002", etc.
  title: string;
  guest?: { name: string; role: string };
  category: Category;       // Motivation | Business | Life | Relationships
  duration: number;         // seconds
  date: string;             // ISO date
  plays: number;
  status: "published" | "draft";
  tags: string[];
  description: string;
  showNotes: { time: number; label: string }[];
  palette: { a: string; b: string; accent: string };
}
```

### Quotes
```typescript
{
  id: number;
  text: string;
  author: string;
  episode: string;          // "EP 001"
  topic: Topic;             // Hustle | Fear | Money | Family | Discipline | Purpose
  featured: boolean;
}
```

### Messages
```typescript
{
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  type: "general" | "guest" | "booking";
  date: string;             // ISO datetime
  read: boolean;
  archived: boolean;
}
```

## 🔧 Configuration

All data is stored in `localStorage` under the key `wits-cms-v1`. The console comes pre-loaded with demo data:

- **11 episodes** (10 published, 1 draft)
- **12 quotes** (5 featured)
- **5 messages** (various types)

### Reset to Demo Data
Go to **Settings → Danger Zone → Reset demo data** to restore the original demo content.

### Export Data
- **Episodes** → Export CSV button
- **All data** → Settings → Export JSON

### Import Data
- **Episodes** → Import button (JSON format)

## 🎨 Design System

### Colors
- **Base**: `#0a192f` (Deep Navy)
- **Panel**: `#112240` (Dark Blue)
- **Teal**: `#64ffda` (Primary accent)
- **Ember**: `#ff6b35` (Secondary accent)
- **Amber**: `#ffd166` (Tertiary accent)

### Typography
- **Display**: Bebas Neue (Headings)
- **Head**: Poppins (UI elements)
- **Body**: Inter (Content)

### Components
- **Toast notifications** — With undo actions
- **Modals** — For editing and previews
- **Drawers** — Slide-in panels for complex forms
- **Command palette** — Universal search and actions
- **Welcome screen** — First-run onboarding

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 Responsive Design

The console is fully responsive:
- **Desktop** (1024px+) — Full sidebar + content layout
- **Tablet** (768px-1023px) — Collapsible sidebar
- **Mobile** (< 768px) — Bottom navigation, stacked layouts

## 🔐 Data Privacy

All data is stored locally in your browser. Nothing is sent to external servers. Clear your browser data to reset the console.

## 🛠 Tech Stack

- **React 18** — UI framework
- **TypeScript 5** — Type safety
- **Vite 6** — Build tool
- **Tailwind CSS 4** — Styling
- **Framer Motion** — Animations
- **Zustand** — State management
- **Recharts** — Analytics charts
- **date-fns** — Date formatting

## 📄 License

MIT License - feel free to use this for your own podcast production needs.

## 🎙 About

Built for **Wisdom In The Streets** — a motivational podcast hosted by Marvin Marbell, recorded at street level in Accra, Ghana.

> "Real Wisdom. Real Streets. Real Talk."

---

**Made with ♥ on the corner**

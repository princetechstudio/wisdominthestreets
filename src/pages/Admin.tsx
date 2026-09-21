import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCms, type PublishedMedia } from "../lib/cms";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Episode, Quote } from "../data/content";

const emptyEpisode = {
  id: "", num: "", title: "", category: "Motivation", date: "",
  duration: "1800", plays: "0", audioUrl: "", blurb: "", description: "",
  tags: "", imageUrl: "",
};
const emptyQuote = { text: "", author: "", episode: "", topic: "Community" };
const mediaTypes = ["video", "image"] as const;

async function uploadFile(file: File, folder: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("wits-media").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("wits-media").getPublicUrl(path).data.publicUrl;
}

export default function Admin() {
  const navigate = useNavigate();
  const { refresh, media } = useCms();
  const [session, setSession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [episode, setEpisode] = useState(emptyEpisode);
  const [quote, setQuote] = useState(emptyQuote);
  const [mediaForm, setMediaForm] = useState({ title: "", type: "video" as PublishedMedia["type"], url: "", thumbnailUrl: "", description: "" });
  const [episodeAudio, setEpisodeAudio] = useState<File | null>(null);
  const [episodeImage, setEpisodeImage] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSession(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, authSession) => setSession(Boolean(authSession)));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Welcome back.");
    setBusy(false);
  };

  const choose = (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) =>
    setter(event.target.files?.[0] ?? null);

  const publishEpisode = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage("");
    try {
      const audioUrl = episodeAudio ? await uploadFile(episodeAudio, "audio") : episode.audioUrl.trim();
      const imageUrl = episodeImage ? await uploadFile(episodeImage, "episode-art") : episode.imageUrl.trim();
      if (!audioUrl) throw new Error("Add an audio file or audio URL.");
      const id = Number(episode.id);
      const payload: Episode = {
        id, num: episode.num, title: episode.title, category: episode.category as Episode["category"],
        date: episode.date, duration: Number(episode.duration), plays: Number(episode.plays),
        audioUrl, imageUrl: imageUrl || undefined, blurb: episode.blurb, description: episode.description,
        tags: episode.tags.split(",").map((tag) => tag.trim()).filter(Boolean), showNotes: [],
        palette: { a: "#0d2444", b: "#123a63", accent: "#64ffda" },
      };
      const { error } = await supabase.from("published_episodes").upsert({ id: String(id), payload, published_at: new Date().toISOString() });
      if (error) throw error;
      setEpisode(emptyEpisode); setEpisodeAudio(null); setEpisodeImage(null); setMessage("Episode published successfully."); await refresh();
    } catch (error) {
      console.error("Episode publishing failed", error);
      setMessage(error instanceof Error ? error.message : "Episode publishing failed.");
    } finally { setBusy(false); }
  };

  const publishQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage("");
    const { error } = await supabase.from("published_quotes").insert({ payload: { id: Date.now(), ...quote }, published_at: new Date().toISOString() });
    setMessage(error ? error.message : "Quote published successfully.");
    if (!error) { setQuote(emptyQuote); await refresh(); }
    setBusy(false);
  };

  const publishMedia = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage("");
    try {
      const url = mediaFile ? await uploadFile(mediaFile, mediaForm.type) : mediaForm.url.trim();
      const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, "thumbnails") : mediaForm.thumbnailUrl.trim();
      if (!url) throw new Error("Choose a file or enter a media URL.");
      const { error } = await supabase.from("published_media").insert({
        title: mediaForm.title, type: mediaForm.type, url, thumbnail_url: thumbnailUrl || null,
        description: mediaForm.description || null, published_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMediaForm({ title: "", type: "video", url: "", thumbnailUrl: "", description: "" });
      setMediaFile(null); setThumbnailFile(null); setMessage("Media published successfully."); await refresh();
    } catch (error) {
      console.error("Media publishing failed", error);
      setMessage(error instanceof Error ? error.message : "Media publishing failed.");
    } finally { setBusy(false); }
  };

  if (!isSupabaseConfigured) return <AdminFrame><SetupMessage /></AdminFrame>;
  if (!session) return <AdminFrame><form onSubmit={signIn} className="mx-auto max-w-md rounded-2xl border border-line bg-panel p-8 shadow-2xl shadow-black/10"><p className="admin-kicker">Private publishing desk</p><h1 className="font-display mt-3 text-6xl text-ink">SIGN IN</h1><p className="mt-3 text-sm leading-relaxed text-mute">Manage the corner from one calm workspace.</p><div className="mt-8 space-y-3"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="admin-input" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="admin-input" /><button disabled={busy} className="admin-button w-full">{busy ? "Signing in…" : "Sign in"}</button></div>{message && <p role="alert" className="mt-4 text-sm text-ember">{message}</p>}</form></AdminFrame>;

  return (
    <AdminFrame>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="admin-kicker">Private publishing desk</p><h1 className="font-display mt-2 text-6xl leading-none text-ink sm:text-8xl">THE <span className="text-hollow">CORNER</span></h1><p className="mt-4 max-w-xl text-sm text-mute">Publish once. Reach every listener. Upload from your laptop or paste a hosted URL.</p></div>
        <button onClick={async () => { await supabase?.auth.signOut(); navigate("/"); }} className="admin-secondary">Sign out</button>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Stat label="Published media" value={media.length} />
        <Stat label="Storage bucket" value="WITS media" />
        <Stat label="Publishing status" value={busy ? "Working…" : "Ready"} />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="admin-card">
          <div className="admin-section-title"><div><p className="admin-kicker">01 · Audio archive</p><h2>Publish an episode</h2></div><span className="admin-badge">MP3 / M4A</span></div>
          <form onSubmit={publishEpisode} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Episode number"><input required value={episode.num} onChange={(e) => setEpisode({ ...episode, num: e.target.value })} placeholder="011" className="admin-input" /></Field>
            <Field label="Database ID"><input required type="number" value={episode.id} onChange={(e) => setEpisode({ ...episode, id: e.target.value })} placeholder="11" className="admin-input" /></Field>
            <Field label="Title" wide><input required value={episode.title} onChange={(e) => setEpisode({ ...episode, title: e.target.value })} placeholder="The next lesson" className="admin-input" /></Field>
            <Field label="Category"><select value={episode.category} onChange={(e) => setEpisode({ ...episode, category: e.target.value })} className="admin-input"><option>Motivation</option><option>Business</option><option>Life</option><option>Relationships</option></select></Field>
            <Field label="Release date"><input required type="date" value={episode.date} onChange={(e) => setEpisode({ ...episode, date: e.target.value })} className="admin-input" /></Field>
            <Field label="Duration (seconds)"><input required type="number" value={episode.duration} onChange={(e) => setEpisode({ ...episode, duration: e.target.value })} className="admin-input" /></Field>
            <Field label="Tags" wide><input value={episode.tags} onChange={(e) => setEpisode({ ...episode, tags: e.target.value })} placeholder="discipline, growth, money" className="admin-input" /></Field>
            <FileField label="Upload audio from laptop" file={episodeAudio} onChange={choose(setEpisodeAudio)} accept="audio/*" />
            <Field label="Or paste audio URL"><input value={episode.audioUrl} onChange={(e) => setEpisode({ ...episode, audioUrl: e.target.value })} placeholder="https://…" className="admin-input" /></Field>
            <FileField label="Episode cover image" file={episodeImage} onChange={choose(setEpisodeImage)} accept="image/*" />
            <Field label="Or paste cover URL"><input value={episode.imageUrl} onChange={(e) => setEpisode({ ...episode, imageUrl: e.target.value })} placeholder="https://…" className="admin-input" /></Field>
            <Field label="Short description" wide><textarea required rows={2} value={episode.blurb} onChange={(e) => setEpisode({ ...episode, blurb: e.target.value })} className="admin-input" /></Field>
            <Field label="Full description" wide><textarea required rows={5} value={episode.description} onChange={(e) => setEpisode({ ...episode, description: e.target.value })} className="admin-input" /></Field>
            <button disabled={busy} className="admin-button sm:col-span-2">{busy ? "Uploading and publishing…" : "Publish episode"}</button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="admin-card"><div className="admin-section-title"><div><p className="admin-kicker">02 · Quotes</p><h2>Publish a quote</h2></div><span className="admin-badge">Shareable</span></div><form onSubmit={publishQuote} className="mt-6 space-y-4"><Field label="Quote"><textarea required rows={5} value={quote.text} onChange={(e) => setQuote({ ...quote, text: e.target.value })} placeholder="A line worth carrying home…" className="admin-input" /></Field><Field label="Author"><input required value={quote.author} onChange={(e) => setQuote({ ...quote, author: e.target.value })} placeholder="Marvin Marbell" className="admin-input" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Episode"><input required value={quote.episode} onChange={(e) => setQuote({ ...quote, episode: e.target.value })} placeholder="EP 011" className="admin-input" /></Field><Field label="Topic"><input required value={quote.topic} onChange={(e) => setQuote({ ...quote, topic: e.target.value })} placeholder="Growth" className="admin-input" /></Field></div><button disabled={busy} className="admin-button w-full">Publish quote</button></form></section>
          <section className="admin-card"><div className="admin-section-title"><div><p className="admin-kicker">03 · Visuals</p><h2>Publish media</h2></div><span className="admin-badge">Image / video</span></div><form onSubmit={publishMedia} className="mt-6 space-y-4"><Field label="Title"><input required value={mediaForm.title} onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })} placeholder="Behind the mic" className="admin-input" /></Field><Field label="Media type"><select value={mediaForm.type} onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value as PublishedMedia["type"] })} className="admin-input">{mediaTypes.map((type) => <option key={type}>{type}</option>)}</select></Field><FileField label={`Upload ${mediaForm.type} from laptop`} file={mediaFile} onChange={choose(setMediaFile)} accept={mediaForm.type === "video" ? "video/*" : "image/*"} /><Field label="Or paste media URL"><input value={mediaForm.url} onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })} placeholder="https://…" className="admin-input" /></Field>{mediaForm.type === "video" && <><FileField label="Video thumbnail (optional)" file={thumbnailFile} onChange={choose(setThumbnailFile)} accept="image/*" /><Field label="Or paste thumbnail URL"><input value={mediaForm.thumbnailUrl} onChange={(e) => setMediaForm({ ...mediaForm, thumbnailUrl: e.target.value })} placeholder="https://…" className="admin-input" /></Field></>}<Field label="Caption (optional)"><textarea rows={2} value={mediaForm.description} onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })} className="admin-input" /></Field><button disabled={busy} className="admin-button w-full">{busy ? "Uploading…" : "Publish media"}</button></form></section>
        </div>
      </div>
      {message && <p role="status" className="mt-6 rounded-lg border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal">{message}</p>}
    </AdminFrame>
  );
}

function AdminFrame({ children }: { children: ReactNode }) { return <main className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pt-36">{children}</main>; }
function SetupMessage() { return <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-ember/40 bg-panel p-8"><p className="admin-kicker">Setup required</p><h1 className="font-display mt-3 text-6xl text-ink">CONNECT SUPABASE</h1><p className="mt-4 text-mute">Set your Supabase environment variables, run supabase/schema.sql, and create an admin user.</p></div>; }
function Stat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl border border-line bg-panel p-5"><p className="admin-kicker">{label}</p><p className="mt-2 font-display text-3xl text-ink">{value}</p></div>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) { return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="admin-label">{label}</span>{children}</label>; }
function FileField({ label, file, onChange, accept }: { label: string; file: File | null; onChange: (event: ChangeEvent<HTMLInputElement>) => void; accept: string }) { return <label className="block"><span className="admin-label">{label}</span><span className="flex min-h-11 cursor-pointer items-center rounded-lg border border-dashed border-teal/40 bg-teal/[0.04] px-3 text-sm text-mute transition hover:border-teal hover:text-teal"><input type="file" accept={accept} onChange={onChange} className="sr-only" />{file ? <><span className="truncate text-teal">{file.name}</span><span className="ml-auto text-xs">{Math.ceil(file.size / 1024 / 1024)} MB</span></> : "Choose a file…"}</span></label>; }

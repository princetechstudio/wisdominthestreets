import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL, SOCIALS, WHATSAPP_DISPLAY, whatsappLink } from "../data/content";
import { socialIcon } from "../components/chrome";
import { Reveal, usePageMeta } from "../components/ui";
import { useStore } from "../store";
import { IconCheck, IconClock, IconMail, IconPin, IconSend, IconWhatsApp } from "../components/icons";

type Subject = "General inquiry" | "Guest application" | "Booking & partnerships" | "Just saying thank you";
const SUBJECTS: Subject[] = ["General inquiry", "Guest application", "Booking & partnerships", "Just saying thank you"];

interface FormState {
  name: string;
  email: string;
  subject: Subject;
  message: string;
  pitch: string;
  handle: string;
}

export default function Contact() {
  usePageMeta("Contact — Talk to the corner", "Get in touch with Wisdom In The Streets: general questions, guest applications, bookings — or jump straight into WhatsApp.");

  const toast = useStore((s) => s.toast);
  const [f, setF] = useState<FormState>({ name: "", email: "", subject: "General inquiry", message: "", pitch: "", handle: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (f.name.trim().length < 2) errs.name = "Tell us your name — at least 2 letters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errs.email = "That email doesn't look right.";
    if (f.message.trim().length < 10) errs.message = "Give us a little more — 10 characters minimum.";
    if (f.subject === "Guest application" && f.pitch.trim().length < 10) errs.pitch = "Pitch your story in at least a sentence.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast("A couple of fields need attention", "error");
      return;
    }
    setStatus("sending");
    // Production: POST /api/contact → Nodemailer/Formspree (see .env.example)
    window.setTimeout(() => {
      setStatus("sent");
      toast("Message sent — the corner heard you ✓", "success");
    }, 1100);
  };

  const inputCls = (err?: string) =>
    `w-full rounded-lg border bg-base px-4 py-3 text-sm text-ink placeholder:text-mute/60 transition focus:outline-none ${
      err ? "border-ember/60" : "border-line focus:border-teal/60"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      {/* head */}
      <div className="max-w-3xl">
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] font-head font-semibold uppercase tracking-[0.28em] text-teal">
            <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" /> Say hello
          </p>
          <h1 className="font-display mt-3 text-6xl leading-[0.9] tracking-wide text-ink sm:text-7xl lg:text-8xl">
            TALK TO <span className="text-hollow">THE CORNER</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mute">
            Questions, story ideas, guest pitches, bookings — or just tell us which line hit you this week. We read everything, and we answer in street time: within 48 hours.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---------- form ---------- */}
        <Reveal>
          <div className="rounded-xl border border-line bg-panel p-6 sm:p-8">
            {status === "sent" ? (
              <div className="grid place-items-center py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-teal/50 bg-teal/10 text-teal">
                  <IconCheck size={28} />
                </span>
                <p className="font-display mt-6 text-4xl tracking-wide text-ink">MESSAGE RECEIVED</p>
                <p className="mt-3 max-w-sm text-sm text-mute">
                  Thanks, {f.name.split(" ")[0] || "friend"} — your {f.subject.toLowerCase()} is in the queue. Expect a reply within 48 hours.
                </p>
                <button
                  onClick={() => {
                    setF({ name: "", email: "", subject: "General inquiry", message: "", pitch: "", handle: "" });
                    setStatus("idle");
                  }}
                  className="font-head mt-7 rounded-full border border-teal/50 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-teal transition hover:bg-teal hover:text-[#0a192f]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Your name</label>
                    <input id="c-name" type="text" value={f.name} onChange={set("name")} placeholder="Kwame Mensah" className={inputCls(errors.name)} aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-1.5 text-xs text-ember" role="alert">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Email</label>
                    <input id="c-email" type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" className={inputCls(errors.email)} aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1.5 text-xs text-ember" role="alert">{errors.email}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="c-subject" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Subject</label>
                  <div className="relative">
                    <select id="c-subject" value={f.subject} onChange={set("subject")} className={`${inputCls()} cursor-pointer appearance-none pr-10`}>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mute" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M5.5 9l6.5 6.5L18.5 9" />
                    </svg>
                  </div>
                </div>

                {f.subject === "Guest application" && (
                  <div className="mt-5 space-y-5 rounded-lg border border-ember/30 bg-ember/[0.05] p-4">
                    <p className="font-head text-[11px] font-bold uppercase tracking-widest text-ember">Guest application — tell us your story</p>
                    <div>
                      <label htmlFor="c-pitch" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Your story in one paragraph</label>
                      <textarea id="c-pitch" rows={3} value={f.pitch} onChange={set("pitch")} placeholder="What did the street teach you that a classroom couldn't?" className={inputCls(errors.pitch)} aria-invalid={!!errors.pitch} />
                      {errors.pitch && <p className="mt-1.5 text-xs text-ember" role="alert">{errors.pitch}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-handle" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Social handle (optional)</label>
                      <input id="c-handle" type="text" value={f.handle} onChange={set("handle")} placeholder="@yourhandle" className={inputCls()} />
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <label htmlFor="c-message" className="font-head mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-mute">Message</label>
                  <textarea id="c-message" rows={6} value={f.message} onChange={set("message")} placeholder="Talk to us…" className={inputCls(errors.message)} aria-invalid={!!errors.message} />
                  {errors.message && <p className="mt-1.5 text-xs text-ember" role="alert">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-head mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-teal px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-[#0a192f] transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a192f]/30 border-t-[#0a192f]" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <IconSend size={15} /> Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>

        {/* ---------- sidebar ---------- */}
        <div className="space-y-5">
          <Reveal delay={0.08}>
            <a
              href={whatsappLink("Hello WITS! 👋 I just visited the website and…")}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-teal/40 bg-teal/[0.07] p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-[#0a192f] transition-transform group-hover:scale-110">
                <IconWhatsApp size={26} />
              </span>
              <span>
                <span className="font-head block text-sm font-bold uppercase tracking-widest text-teal">WhatsApp — fastest reply</span>
                <span className="mt-1 block font-display text-3xl tracking-wider text-ink">{WHATSAPP_DISPLAY}</span>
                <span className="mt-0.5 block text-xs text-mute">Tap to chat — message is pre-filled for you</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="divide-y divide-[var(--wits-line)] rounded-xl border border-line bg-panel">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-4 p-5 transition hover:bg-raise">
                <span className="text-teal"><IconMail size={19} /></span>
                <span>
                  <span className="font-head block text-[11px] font-bold uppercase tracking-widest text-mute">Email</span>
                  <span className="text-sm font-medium text-ink">{CONTACT_EMAIL}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 p-5">
                <span className="text-teal"><IconPin size={19} /></span>
                <span>
                  <span className="font-head block text-[11px] font-bold uppercase tracking-widest text-mute">The studio</span>
                  <span className="text-sm font-medium text-ink">Jamestown, Accra, Ghana</span>
                </span>
              </div>
              <div className="flex items-center gap-4 p-5">
                <span className="text-teal"><IconClock size={19} /></span>
                <span>
                  <span className="font-head block text-[11px] font-bold uppercase tracking-widest text-mute">Street hours</span>
                  <span className="text-sm font-medium text-ink">Mon–Fri · 9:00–17:00 GMT</span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-xl border border-line bg-panel p-6">
              <p className="font-head text-[11px] font-bold uppercase tracking-widest text-teal">Find us everywhere</p>
              <ul className="mt-4 space-y-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-lg border border-line px-4 py-2.5 transition-all hover:-translate-y-0.5 hover:border-teal/40">
                      <span className="flex items-center gap-3 text-sm text-ink">
                        <span className="text-mute transition group-hover:text-teal">{socialIcon(s.label, 16)}</span>
                        {s.label}
                      </span>
                      <span className="font-head text-xs font-semibold text-teal">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="rounded-xl border border-dashed border-line bg-panel/50 p-5 text-sm leading-relaxed text-mute">
              <strong className="font-head font-semibold text-ember">Want to sit on the corner?</strong> Choose{" "}
              <em>“Guest application”</em> in the form — we cast everyday wisdom: traders, drivers, nurses, teachers. No celebrities required, stories only.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

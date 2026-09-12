import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCms } from "./cms";
import type { Message } from "./data";
import { IcCopy, IcX } from "./ui";

interface Props {
  message: Message | null;
  onClose: () => void;
}

interface Template {
  id: string;
  label: string;
  forTypes: Message["type"][];
  text: string;
}

const TEMPLATES: Template[] = [
  {
    id: "guest-accept",
    label: "Accept guest application",
    forTypes: ["guest"],
    text: `Hi {{name}},

Thanks so much for reaching out! I love what you're doing with {{topic}} — it's exactly the kind of street wisdom we feature on the show.

I'd love to have you on. Are you free for a 45-minute recording session sometime in the next 2-3 weeks? We can do it in person at the studio or remotely via Zoom.

Let me know what works for you.

— Marvin`,
  },
  {
    id: "guest-decline",
    label: "Decline guest application",
    forTypes: ["guest"],
    text: `Hi {{name}},

Thanks for sharing your story with us. I really appreciate you taking the time to write in.

Unfortunately, we're not able to feature your story at this time — but please don't let that stop you. Keep doing what you're doing, and feel free to reach out again in the future.

All the best,
Marvin`,
  },
  {
    id: "booking-quote",
    label: "Booking rate quote",
    forTypes: ["booking"],
    text: `Hi {{name}},

Thanks for the booking enquiry! Here are the details:

• 40-minute fireside: $2,500
• 60-minute keynote: $4,000
• Panel discussion: $3,000 per panelist
• Travel & accommodation: covered by organizer

All fees include a 15-minute Q&A and social media promotion.

Let me know if you'd like to proceed and I'll send over the contract.

— Marvin`,
  },
  {
    id: "general-thanks",
    label: "Thank listener for message",
    forTypes: ["general"],
    text: `Hi {{name}},

Thanks so much for reaching out! It means a lot to hear that the show is resonating with you.

Keep listening, and feel free to share your favorite episodes with friends. That's how the corner grows.

— Marvin`,
  },
  {
    id: "quote-permission",
    label: "Grant quote permission",
    forTypes: ["general"],
    text: `Hi {{name}},

Absolutely — you're welcome to use that quote! Just please credit it as:

"{{quote}}" — Marvin Marbell, Wisdom In The Streets

And if you can, link back to the episode. That helps other listeners find it too.

Thanks for spreading the wisdom!

— Marvin`,
  },
];

export default function ReplyTemplates({ message, onClose }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const settings = useCms((s) => s.settings);

  if (!message) return null;

  const applicable = TEMPLATES.filter((t) => t.forTypes.includes(message.type));

  const copyTemplate = async (template: Template) => {
    let text = template.text
      .replace(/\{\{name\}\}/g, message.name.split(" ")[0])
      .replace(/\{\{topic\}\}/g, message.subject.toLowerCase())
      .replace(/\{\{quote\}\}/g, "The street doesn't grade your homework. It grades your consistency.");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(template.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(template.id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050d1d]/90 backdrop-blur-md p-4"
        onClick={onClose}
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
              <h2 className="font-head text-sm font-bold uppercase tracking-widest text-ink">Reply templates</h2>
              <p className="mt-0.5 text-xs text-mute">Quick responses for {message.name}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-mute transition hover:text-ink">
              <IcX size={18} />
            </button>
          </div>

          {/* Templates */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-4">
              {applicable.map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-line bg-sunken/50 p-5 transition hover:border-teal/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-head text-sm font-bold text-ink">{template.label}</h3>
                    <button
                      onClick={() => copyTemplate(template)}
                      className={`font-head flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition ${
                        copied === template.id
                          ? "bg-teal/15 text-teal"
                          : "border border-line text-mute hover:border-teal/50 hover:text-teal"
                      }`}
                    >
                      <IcCopy size={12} />
                      {copied === template.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-body text-xs leading-relaxed text-mute">
                    {template.text}
                  </pre>
                </div>
              ))}
            </div>

            {applicable.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-faint">No templates available for this message type</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-line bg-sunken/30 px-6 py-4">
            <p className="text-xs text-faint">
              Templates auto-fill recipient name. Edit before sending.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

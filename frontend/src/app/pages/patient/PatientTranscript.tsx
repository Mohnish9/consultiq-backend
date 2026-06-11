import { useState, useRef } from "react";
import { Search, ArrowLeft, Copy, Download, CheckCircle2 } from "lucide-react";

interface PatientTranscriptProps {
  onNavigate: (page: string) => void;
}

const transcriptLines = [
  { ts: "00:02", speaker: "Consultant", text: "Good morning, Priya. How have you been feeling this week?" },
  { ts: "00:14", speaker: "Patient", text: "I've been experiencing a lot of stress due to work. The deadlines are piling up and I feel overwhelmed most evenings." },
  { ts: "00:28", speaker: "Consultant", text: "I understand. Can you describe what that overwhelm feels like physically?" },
  { ts: "00:35", speaker: "Patient", text: "I get tight shoulders, headaches, and sometimes my heart races. It's worse around 4 or 5 PM." },
  { ts: "00:52", speaker: "Consultant", text: "That's your nervous system activating. What you're describing is classic sympathetic arousal triggered by deadline pressure." },
  { ts: "01:08", speaker: "Patient", text: "Yes, I didn't realize it had a name. I just thought I was bad at managing stress." },
  { ts: "01:18", speaker: "Consultant", text: "Not at all. Let's discuss stress management techniques specifically for work environments. How is your sleep quality?" },
  { ts: "01:32", speaker: "Patient", text: "It's been quite poor. I usually scroll through my phone before bed. I know it's bad but it relaxes me after a stressful day." },
  { ts: "01:49", speaker: "Consultant", text: "The blue light from your phone actually suppresses melatonin — the hormone that signals sleep onset. It may feel relaxing but it's working against you." },
  { ts: "02:06", speaker: "Patient", text: "Oh, I didn't know that. What would you suggest instead?" },
  { ts: "02:13", speaker: "Consultant", text: "Let's discuss stress management techniques. Starting tonight, try 10 minutes of progressive muscle relaxation before bed — it activates the parasympathetic nervous system." },
  { ts: "02:35", speaker: "Patient", text: "I've heard of that. Can you walk me through how to do it properly?" },
  { ts: "02:42", speaker: "Consultant", text: "Absolutely. You start from your feet and work upward — tense each muscle group for 5 seconds, then release completely. The contrast signals your body to deeply relax." },
  { ts: "03:05", speaker: "Patient", text: "That sounds simple enough. I also wanted to mention — I've been feeling anxious in team meetings recently. I freeze when people ask me to speak." },
  { ts: "03:21", speaker: "Consultant", text: "That's an important area to address. What you're describing is anticipatory anxiety — the mind catastrophizes before the event happens." },
  { ts: "03:35", speaker: "Patient", text: "Yes, exactly. I imagine everyone judging me and it gets worse." },
  { ts: "03:44", speaker: "Consultant", text: "Let's use a cognitive reframing approach. Instead of 'everyone is judging me', we'll work on replacing that with 'I have information worth sharing and it's okay to take a breath before speaking'." },
  { ts: "04:02", speaker: "Patient", text: "I like that. It feels more realistic than just telling myself to be confident." },
  { ts: "04:10", speaker: "Consultant", text: "Exactly. Confidence follows action, not the other way around. The homework this week is to use that phrase three times before you speak in a meeting." },
];

export function PatientTranscript({ onNavigate }: PatientTranscriptProps) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = transcriptLines.filter(
    l => !query || l.text.toLowerCase().includes(query.toLowerCase()) || l.speaker.toLowerCase().includes(query.toLowerCase())
  );

  const highlight = (text: string) => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return <>{parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-amber-200 text-foreground rounded px-0.5 not-italic">{p}</mark>
        : p
    )}</>;
  };

  const handleCopy = () => {
    const text = transcriptLines.map(l => `[${l.ts}] ${l.speaker}: ${l.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate("p-consultations")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground" style={{ fontSize: "13px" }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-border">/</span>
        <span className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>Transcript — Jun 11, 2026</span>
        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Dr. Arjun Rajan · Therapy Session · 52 min</span>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>
            {copied ? <><CheckCircle2 size={12} className="text-emerald-500" /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search transcript…"
              className="w-full pl-8 pr-3 py-1.5 bg-muted rounded-lg border-0 outline-none focus:ring-1 focus:ring-primary/30"
              style={{ fontSize: "13px" }}
            />
          </div>
          {query && (
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
              {filtered.length} line{filtered.length !== 1 ? "s" : ""} match
            </span>
          )}
          <span className="text-muted-foreground ml-auto" style={{ fontSize: "12px" }}>{transcriptLines.length} lines · {transcriptLines.length} turns</span>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Search size={20} className="mb-2" />
            <p style={{ fontSize: "13px" }}>No transcript lines match "{query}"</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {filtered.map((line, i) => (
              <div
                key={i}
                className={`flex gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors ${line.speaker === "Patient" ? "bg-muted/5" : ""}`}
              >
                {/* Timestamp */}
                <div className="flex-shrink-0 w-10 mt-0.5">
                  <span className="text-muted-foreground" style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}>{line.ts}</span>
                </div>

                {/* Speaker + text */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full mb-1.5 ${line.speaker === "Consultant" ? "bg-indigo-50 text-indigo-700" : "bg-violet-50 text-violet-700"}`}
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    {line.speaker}
                  </span>
                  <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                    {highlight(line.text)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

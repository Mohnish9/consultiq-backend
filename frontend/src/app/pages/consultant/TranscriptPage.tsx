import { useState } from "react";
import {
  ArrowLeft, Search, Copy, Download, CheckCircle2,
  MessageSquare, User, Stethoscope, Filter, Clock
} from "lucide-react";

interface TranscriptPageProps {
  onNavigate: (page: string, id?: string) => void;
}

type Speaker = "All" | "Consultant" | "Patient";

const transcript = [
  { ts: "00:00", speaker: "Consultant" as const, text: "Good morning, Priya. How have you been feeling since our last session two weeks ago?" },
  { ts: "00:14", speaker: "Patient" as const, text: "Honestly, a bit better. I've been doing the breathing exercises you suggested and they help when I feel overwhelmed at work." },
  { ts: "00:38", speaker: "Consultant" as const, text: "That's great to hear. Can you tell me more about the situations where you feel overwhelmed?" },
  { ts: "01:02", speaker: "Patient" as const, text: "Mostly around 4–5 PM when deadlines pile up. I've been experiencing headaches and tension in my shoulders." },
  { ts: "01:24", speaker: "Consultant" as const, text: "Sounds like your nervous system is activating in response to perceived time pressure. How has your sleep quality been?" },
  { ts: "01:45", speaker: "Patient" as const, text: "It's improved slightly — I've been trying to sleep before midnight. But I still wake up around 3 AM sometimes." },
  { ts: "02:10", speaker: "Consultant" as const, text: "Waking at 3 AM is often cortisol-related. We should look at your evening routine. Are you using screens within an hour of bed?" },
  { ts: "02:31", speaker: "Patient" as const, text: "Yes, I usually scroll through my phone for about an hour before sleeping. I know I shouldn't, but it relaxes me." },
  { ts: "02:55", speaker: "Consultant" as const, text: "The blue light suppresses melatonin production and keeps your brain in alert mode. Let's work on replacing that habit." },
  { ts: "03:18", speaker: "Patient" as const, text: "What would you suggest instead?" },
  { ts: "03:25", speaker: "Consultant" as const, text: "Try 10 minutes of the progressive muscle relaxation I'll share today, followed by reading a physical book. It should significantly reduce your 3 AM waking." },
  { ts: "04:02", speaker: "Patient" as const, text: "That sounds manageable. I've also been feeling socially anxious in our team meetings — I freeze when asked to speak." },
  { ts: "04:18", speaker: "Consultant" as const, text: "That's an important area to address. This is often rooted in anticipatory anxiety. We'll use some cognitive reframing techniques today." },
  { ts: "04:45", speaker: "Patient" as const, text: "What does cognitive reframing involve exactly? I've heard the term but I'm not sure what it means in practice." },
  { ts: "05:02", speaker: "Consultant" as const, text: "It means we identify the automatic negative thought — like 'I'll say something wrong' — and replace it with a more balanced perspective, like 'I have useful input to contribute'." },
  { ts: "05:28", speaker: "Patient" as const, text: "That actually makes sense. I do tend to catastrophize before meetings. My heart starts racing even the night before." },
  { ts: "05:47", speaker: "Consultant" as const, text: "That anticipatory response is very common in social anxiety. We can work on grounding techniques to interrupt that cycle before it escalates." },
  { ts: "06:15", speaker: "Patient" as const, text: "I'd really like that. I want to be able to contribute in team meetings without dreading them for days beforehand." },
];

export function TranscriptPage({ onNavigate }: TranscriptPageProps) {
  const [query, setQuery] = useState("");
  const [speaker, setSpeaker] = useState<Speaker>("All");
  const [copied, setCopied] = useState(false);

  const filtered = transcript.filter(l => {
    const matchSpeaker = speaker === "All" || l.speaker === speaker;
    const matchQuery = !query.trim() || l.text.toLowerCase().includes(query.toLowerCase()) || l.ts.includes(query);
    return matchSpeaker && matchQuery;
  });

  const highlightText = (text: string) => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="bg-amber-200 text-foreground rounded px-0.5">{p}</mark>
            : p
        )}
      </>
    );
  };

  const handleCopy = () => {
    const text = transcript.map(l => `[${l.ts}] ${l.speaker}: ${l.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = [
      "ConsultIQ — Consultation Transcript",
      "Patient: Priya Mehta  |  Consultant: Dr. Arjun Rajan  |  Date: Jun 11, 2026  |  Duration: 52 min",
      "─".repeat(60),
      "",
      ...transcript.map(l => `[${l.ts}] ${l.speaker}:\n${l.text}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript_priya_jun11_2026.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const consultantLines = transcript.filter(l => l.speaker === "Consultant").length;
  const patientLines = transcript.filter(l => l.speaker === "Patient").length;
  const wordCount = transcript.reduce((acc, l) => acc + l.text.split(" ").length, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("consultations")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          style={{ fontSize: "13px" }}
        >
          <ArrowLeft size={14} /> Consultations
        </button>
        <span className="text-border">/</span>
        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Priya Mehta</span>
        <span className="text-border">/</span>
        <span className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>Transcript</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            style={{ fontSize: "12px" }}
          >
            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <Download size={12} /> Download TXT
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — session info + stats */}
        <div className="w-56 flex-shrink-0 border-r border-border bg-white overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Session</p>
            <div className="space-y-2">
              {[
                { icon: User, label: "Patient", value: "Priya Mehta" },
                { icon: Stethoscope, label: "Consultant", value: "Dr. Arjun Rajan" },
                { icon: Clock, label: "Date", value: "Jun 11, 2026" },
                { icon: MessageSquare, label: "Duration", value: "52 min" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2">
                  <item.icon size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p style={{ fontSize: "10px", color: "#9ca3af" }}>{item.label}</p>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#111827" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground mb-2" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Stats</p>
            <div className="space-y-2">
              {[
                { label: "Total lines", value: transcript.length },
                { label: "Consultant", value: consultantLines },
                { label: "Patient", value: patientLines },
                { label: "Word count", value: wordCount.toLocaleString() },
              ].map(s => (
                <div key={s.label} className="flex justify-between">
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{s.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#111827" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground mb-2" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Speaker Filter</p>
            <div className="space-y-1">
              {(["All", "Consultant", "Patient"] as Speaker[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeaker(s)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${speaker === s ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                  style={{ fontSize: "12px", fontWeight: speaker === s ? 500 : 400, backgroundColor: speaker === s ? "rgba(79,70,229,0.07)" : undefined }}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s === "Consultant" ? "bg-indigo-500" : s === "Patient" ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main transcript area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search transcript…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                style={{ fontSize: "13px" }}
              />
            </div>
            {query && (
              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
            <span className="ml-auto text-muted-foreground" style={{ fontSize: "12px" }}>
              {filtered.length} / {transcript.length} lines
            </span>
          </div>

          {/* Transcript lines */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-border/40">
              {filtered.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-4 px-5 py-3 hover:bg-muted/20 transition-colors ${line.speaker === "Consultant" ? "bg-indigo-50/20" : ""}`}
                >
                  <span
                    className="text-muted-foreground flex-shrink-0 mt-0.5"
                    style={{ fontSize: "11px", fontFamily: "monospace", width: "38px" }}
                  >
                    {line.ts}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full mb-1.5 ${line.speaker === "Consultant" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}
                      style={{ fontSize: "10px", fontWeight: 600 }}
                    >
                      {line.speaker}
                    </span>
                    <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                      {highlightText(line.text)}
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <Filter size={24} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>No results found</p>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                    {query ? `No lines match "${query}"` : "No lines from this speaker"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft, Download, Play, Pause, SkipBack, SkipForward, Sparkles, Stethoscope, FileText, Mic, ChevronDown, CheckCircle2, Clock, Tag, Search } from "lucide-react";

interface PatientConsultationDetailProps {
  consultationId: string;
  onNavigate: (page: string) => void;
}

const transcriptPreview = [
  { ts: "00:02", speaker: "Consultant", text: "Good morning, Priya. How have you been feeling this week?" },
  { ts: "00:14", speaker: "Patient", text: "I've been experiencing a lot of stress due to work. The deadlines are piling up." },
  { ts: "00:28", speaker: "Consultant", text: "Can you describe what that overwhelm feels like physically?" },
  { ts: "00:35", speaker: "Patient", text: "Tight shoulders, headaches, heart racing — worse around 4 or 5 PM." },
  { ts: "00:52", speaker: "Consultant", text: "That's sympathetic arousal triggered by deadline pressure. Let's discuss stress management techniques." },
];

const timeline = [
  { ts: "00:00", label: "Introduction & check-in" },
  { ts: "02:15", label: "Sleep discussion" },
  { ts: "04:02", label: "Social anxiety at work" },
  { ts: "07:40", label: "CBT reframing exercises" },
  { ts: "15:30", label: "Follow-up plan" },
];

export function PatientConsultationDetail({ consultationId, onNavigate }: PatientConsultationDetailProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(14);
  const [speed, setSpeed] = useState("1×");
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "recording", label: "Recording" },
    { id: "transcript", label: "Transcript" },
    { id: "ai", label: "AI Summary" },
    { id: "followup", label: "Follow-up" },
  ];

  const highlight = (text: string) => {
    if (!transcriptSearch.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${transcriptSearch})`, "gi"));
    return <>{parts.map((p, i) => p.toLowerCase() === transcriptSearch.toLowerCase()
      ? <mark key={i} className="bg-amber-200 rounded px-0.5">{p}</mark> : p)}</>;
  };

  const filteredTranscript = transcriptPreview.filter(l =>
    !transcriptSearch || l.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate("p-consultations")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground" style={{ fontSize: "13px" }}>
          <ArrowLeft size={14} /> My Consultations
        </button>
        <span className="text-border">/</span>
        <span className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>Therapy Session</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: "11px", fontWeight: 500 }}>Completed</span>
        <span className="text-muted-foreground ml-auto" style={{ fontSize: "12px" }}>{consultationId} · Jun 11, 2026 · 52 min</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted" style={{ fontSize: "12px" }}>
          <Download size={12} /> Export
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border px-5 flex">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 border-b-2 transition-colors ${tab === t.id ? "border-violet-600 text-violet-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            style={{ fontSize: "13px", fontWeight: tab === t.id ? 500 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="max-w-3xl space-y-3">
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={13} className="text-violet-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Consultation Info</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Consultant", "Dr. Arjun Rajan"], ["Specialty", "Clinical Psychology"], ["Date", "June 11, 2026"], ["Time", "10:30 AM"], ["Duration", "52 minutes"], ["Type", "Therapy Session"]].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{l}</p>
                    <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className="text-amber-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Session Notes</p>
              </div>
              <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                Session focused on managing generalized anxiety disorder. Demonstrated improvement with breathing exercises — 40% fewer panic episodes. Discussed workplace deadline pressure (4–5 PM), sleep issues linked to evening screen use, and social anxiety in team meetings. Progressive muscle relaxation technique introduced. CBT reframing for anticipatory anxiety in meetings.
              </p>
            </div>
          </div>
        )}

        {/* RECORDING */}
        {tab === "recording" && (
          <div className="max-w-3xl space-y-3">
            <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0"><Mic size={18} /></div>
              <div className="flex-1">
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>consultation_arjun_jun11_2026.mp3</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>48.2 MB · MP3 · 52:00</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white" style={{ fontSize: "12px", fontWeight: 500 }}>
                <Download size={12} /> Download
              </button>
            </div>
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="h-14 bg-muted/40 rounded-xl flex items-center px-3 gap-px overflow-hidden mb-2">
                {Array.from({ length: 100 }, (_, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i / 100 < progress / 100 ? "bg-violet-500" : "bg-slate-200"}`}
                    style={{ height: `${20 + Math.abs(Math.sin(i * 0.42) * 15 + Math.sin(i * 0.85) * 10)}%`, minWidth: "2px" }} />
                ))}
              </div>
              <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-violet-600 mb-1" style={{ height: "2px" }} />
              <div className="flex justify-between text-muted-foreground mb-3" style={{ fontSize: "10px" }}>
                <span>{String(Math.floor(progress * 52 / 100)).padStart(2, "0")}:{String(Math.floor(((progress * 52 / 100) % 1) * 60)).padStart(2, "0")}</span>
                <span>52:00</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="text-muted-foreground hover:text-foreground"><SkipBack size={16} /></button>
                <button onClick={() => setPlaying(!playing)} className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700">
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button className="text-muted-foreground hover:text-foreground"><SkipForward size={16} /></button>
                <div className="relative ml-4">
                  <select value={speed} onChange={e => setSpeed(e.target.value)} className="pl-2 pr-6 py-1 rounded-md border border-border bg-white text-muted-foreground focus:outline-none" style={{ fontSize: "11px" }}>
                    {["0.75×", "1×", "1.25×", "1.5×", "2×"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Timeline */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Recording Timeline</p>
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <button key={item.ts} onClick={() => setActiveTimestamp(item.ts)}
                    className="w-full flex items-center gap-3 group py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 transition-colors ${activeTimestamp === item.ts ? "border-violet-600 bg-violet-600" : "border-border group-hover:border-violet-400"}`} />
                      {i < timeline.length - 1 && <div className="w-px h-5 bg-border mt-0.5" />}
                    </div>
                    <span className="text-muted-foreground" style={{ fontSize: "11px", fontFamily: "var(--font-mono)", minWidth: "34px" }}>{item.ts}</span>
                    <span className={`transition-colors ${activeTimestamp === item.ts ? "text-violet-600" : "text-foreground"}`} style={{ fontSize: "13px" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSCRIPT PREVIEW */}
        {tab === "transcript" && (
          <div className="max-w-3xl space-y-3">
            <div className="bg-white border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={transcriptSearch} onChange={e => setTranscriptSearch(e.target.value)} placeholder="Search transcript…"
                  className="w-full pl-8 pr-3 py-1.5 bg-muted rounded-lg border-0 outline-none" style={{ fontSize: "13px" }} />
              </div>
              <button onClick={() => onNavigate("p-transcript")} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white flex-shrink-0" style={{ fontSize: "12px", fontWeight: 500 }}>
                Full Transcript
              </button>
            </div>
            <div className="bg-white border border-border rounded-xl overflow-hidden divide-y divide-border/40">
              {filteredTranscript.map((line, i) => (
                <div key={i} className="flex gap-4 px-5 py-3 hover:bg-muted/20">
                  <span className="text-muted-foreground flex-shrink-0 mt-0.5" style={{ fontSize: "11px", fontFamily: "var(--font-mono)", width: "34px" }}>{line.ts}</span>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full mb-1 ${line.speaker === "Consultant" ? "bg-indigo-50 text-indigo-700" : "bg-violet-50 text-violet-700"}`} style={{ fontSize: "10px", fontWeight: 600 }}>{line.speaker}</span>
                    <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>{highlight(line.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI SUMMARY */}
        {tab === "ai" && (
          <div className="max-w-3xl space-y-3">
            <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-primary" />
                <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>AI Summary</p>
              </div>
              <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                Session showed strong progress — approximately 40% fewer panic episodes since last session. Main stressors are workplace deadline pressure and sleep disruption from screen use. Social anxiety in meetings identified as a new focus. CBT reframing and PMR techniques were introduced.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-border rounded-xl p-4">
                <p className="text-foreground mb-3" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Key Takeaways</p>
                {["Stress — deadline pressure at 4–5 PM", "Sleep disrupted by screen use before bed", "Social anxiety in team meetings", "CBT reframing technique assigned"].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5" style={{ fontSize: "12px" }}>
                    <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{t}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-border rounded-xl p-4">
                <p className="text-foreground mb-3" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Your Action Items</p>
                {["Sleep before 11 PM — no screens before bed", "Daily 10-min mindfulness meditation", "PMR exercise every night", "CBT affirmations before meetings", "Follow-up Jun 25"].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5" style={{ fontSize: "12px" }}>
                    <div className="w-3.5 h-3.5 rounded border-2 border-violet-300 flex-shrink-0" />
                    <span className="text-foreground">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={12} className="text-amber-500" />
                <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Keywords</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["anxiety", "stress", "CBT", "PMR", "sleep hygiene", "blue light", "mindfulness"].map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100" style={{ fontSize: "11px", fontWeight: 500 }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOLLOW-UP */}
        {tab === "followup" && (
          <div className="max-w-3xl space-y-3">
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={13} className="text-violet-500" />
                <p style={{ fontSize: "13px", fontWeight: 600 }}>Next Appointment</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
                <div>
                  <p className="text-violet-700" style={{ fontSize: "14px", fontWeight: 600 }}>Jun 25, 2026 · 10:30 AM</p>
                  <p className="text-violet-600" style={{ fontSize: "12px" }}>Dr. Arjun Rajan · Therapy Session · Video</p>
                </div>
                <button className="ml-auto px-3 py-1.5 rounded-lg bg-violet-600 text-white" style={{ fontSize: "12px", fontWeight: 500 }}>Join</button>
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Follow-up Recommendations</p>
              <div className="space-y-2">
                {[
                  { text: "Review sleep diary — track waking times", priority: "high" },
                  { text: "Assess PMR adherence and update Dr. Rajan", priority: "high" },
                  { text: "Continue CBT meeting affirmations daily", priority: "medium" },
                  { text: "Maintain anxiety journal (3 entries/day)", priority: "medium" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.priority === "high" ? "bg-red-400" : "bg-amber-400"}`} />
                    <p className="text-foreground" style={{ fontSize: "12px" }}>{r.text}</p>
                    <span className={`ml-auto px-2 py-0.5 rounded-full ${r.priority === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                      {r.priority === "high" ? "High" : "Medium"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-foreground mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>Consultant Notes</p>
              <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                Patient demonstrates strong motivation and self-awareness. Excellent therapeutic alliance. Consider referral to a support group if social anxiety in meetings persists beyond 2 more sessions. No risk flags at this time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { ArrowLeft, Download, Play, Pause, Volume2, SkipBack, SkipForward, Sparkles, User, Stethoscope, FileText, Mic, Search, CheckSquare, Tag, Clock, MessageSquare } from "lucide-react";

interface ConsultationDetailPageProps {
  consultationId: string;
  onNavigate: (page: string) => void;
}

const transcript = [
  { ts: "00:00", speaker: "Consultant", text: "Good morning, Priya. How have you been feeling since our last session two weeks ago?" },
  { ts: "00:14", speaker: "Patient", text: "Honestly, a bit better. I've been doing the breathing exercises you suggested and they help when I feel overwhelmed at work." },
  { ts: "00:38", speaker: "Consultant", text: "That's great to hear. Can you tell me more about the situations where you feel overwhelmed?" },
  { ts: "01:02", speaker: "Patient", text: "Mostly around 4–5 PM when deadlines pile up. I've been experiencing headaches and tension in my shoulders." },
  { ts: "01:24", speaker: "Consultant", text: "Sounds like your nervous system is activating in response to perceived time pressure. How is your sleep quality been?" },
  { ts: "01:45", speaker: "Patient", text: "It's improved slightly — I've been trying to sleep before midnight. But I still wake up around 3 AM sometimes." },
  { ts: "02:10", speaker: "Consultant", text: "Waking at 3 AM is often cortisol-related. We should look at your evening routine. Are you using screens within an hour of bed?" },
  { ts: "02:31", speaker: "Patient", text: "Yes, I usually scroll through my phone for about an hour before sleeping. I know I shouldn't but it relaxes me." },
  { ts: "02:55", speaker: "Consultant", text: "The blue light suppresses melatonin production and keeps your brain in alert mode. Let's work on replacing that habit." },
  { ts: "03:18", speaker: "Patient", text: "What would you suggest instead?" },
  { ts: "03:25", speaker: "Consultant", text: "Try 10 minutes of the progressive muscle relaxation I'll share today, followed by reading a physical book. It should reduce your 3 AM waking significantly." },
  { ts: "04:02", speaker: "Patient", text: "That sounds manageable. I've also been feeling socially anxious in our team meetings — I freeze when asked to speak." },
  { ts: "04:18", speaker: "Consultant", text: "That's an important area to address. This is often rooted in anticipatory anxiety. We'll use some cognitive reframing techniques today." },
];

const timeline = [
  { ts: "00:00", label: "Introduction & check-in", active: false },
  { ts: "02:15", label: "Sleep discussion", active: false },
  { ts: "04:02", label: "Social anxiety at work", active: false },
  { ts: "07:40", label: "CBT reframing exercises", active: false },
  { ts: "12:10", label: "Stress management plan", active: false },
  { ts: "15:30", label: "Recommendations & follow-up", active: false },
];

export function ConsultationDetailPage({ consultationId, onNavigate }: ConsultationDetailPageProps) {
  const [tab, setTab] = useState("overview");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "recording", label: "Recording" },
    { id: "transcript", label: "Transcript" },
    { id: "ai", label: "AI Summary" },
  ];

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return <>{parts.map((p, i) => p.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-amber-200 text-foreground rounded px-0.5">{p}</mark> : p)}</>;
  };

  const filteredTranscript = transcript.filter(
    line => !transcriptSearch || line.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || line.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  const currentMinutes = Math.floor(progress * 52 / 100);
  const currentSeconds = Math.floor(((progress * 52 / 100) % 1) * 60);
  const timeStr = `${String(currentMinutes).padStart(2, "0")}:${String(currentSeconds).padStart(2, "0")}`;

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-4">
        <button onClick={() => onNavigate("consultations")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "13px" }}>
          <ArrowLeft size={14} /> Consultations
        </button>
        <span className="text-border">/</span>
        <div className="flex items-center gap-2">
          <span className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>Priya Mehta</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: "11px", fontWeight: 500 }}>Completed</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700" style={{ fontSize: "11px", fontWeight: 500 }}>Therapy</span>
        </div>
        <span className="text-muted-foreground ml-auto" style={{ fontSize: "12px" }}>{consultationId} · Jun 11, 2026 · 10:30 AM · 52 min</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>
          <Download size={13} /> Export
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border px-5 flex gap-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            style={{ fontSize: "13px", fontWeight: tab === t.id ? 500 : 400 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <User size={13} className="text-blue-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Patient</p>
              </div>
              <div className="space-y-2">
                {[["Name", "Priya Mehta"], ["Age", "32 years"], ["Phone", "+91 98765 43210"], ["Condition", "Generalized Anxiety Disorder"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{l}</span>
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={13} className="text-violet-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Consultant</p>
              </div>
              <div className="space-y-2">
                {[["Name", "Dr. Arjun Rajan"], ["Specialty", "Clinical Psychology"], ["License", "MCI-2019-0842"], ["Session", "Session 7 of 12"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{l}</span>
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className="text-amber-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Session Notes</p>
              </div>
              <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                Session focused on managing generalized anxiety disorder. Patient demonstrated improvement with breathing exercises (40% reduction in panic episodes). Discussed workplace stress triggers around 4–5 PM deadline pressure. Explored sleep quality issues — waking at 3 AM linked to cortisol patterns and blue light exposure. Introduced PMR technique and blue light hygiene. Social anxiety in team meetings identified as new focus area — CBT reframing techniques introduced.
              </p>
            </div>
          </div>
        )}

        {/* RECORDING */}
        {tab === "recording" && (
          <div className="max-w-3xl space-y-4">
            {/* File info */}
            <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><Mic size={18} /></div>
              <div className="flex-1">
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>consultation_priya_jun11_2026.mp3</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>48.2 MB · MP3 · 320 kbps · 52:00</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white" style={{ fontSize: "12px", fontWeight: 500 }}>
                <Download size={12} /> Download
              </button>
            </div>

            {/* Player */}
            <div className="bg-white rounded-xl border border-border p-5">
              <p className="text-foreground mb-4" style={{ fontSize: "13px", fontWeight: 600 }}>Audio Player</p>
              {/* Waveform */}
              <div className="h-16 bg-muted/50 rounded-xl flex items-center px-3 gap-px mb-3 overflow-hidden">
                {Array.from({ length: 120 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-colors ${i / 120 < progress / 100 ? "bg-primary" : "bg-border"}`}
                    style={{ height: `${22 + Math.sin(i * 0.35) * 14 + Math.sin(i * 0.8 + 1) * 10}%`, minWidth: "2px" }}
                  />
                ))}
              </div>
              {/* Scrubber */}
              <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-primary mb-1" style={{ height: "3px" }} />
              <div className="flex justify-between text-muted-foreground mb-4" style={{ fontSize: "11px" }}>
                <span>{timeStr}</span>
                <span>52:00</span>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-center gap-5">
                <button className="text-muted-foreground hover:text-foreground transition-colors"><SkipBack size={16} /></button>
                <button onClick={() => setPlaying(!playing)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><SkipForward size={16} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors ml-4"><Volume2 size={15} /></button>
                <select className="ml-auto border border-border rounded-md px-2 py-1 bg-white text-muted-foreground focus:outline-none" style={{ fontSize: "11px" }}>
                  {["0.75×", "1×", "1.25×", "1.5×", "2×"].map(s => <option key={s} selected={s === "1×"}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Recording Timeline */}
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Recording Timeline</p>
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <button
                    key={item.ts}
                    onClick={() => { setActiveTimestamp(item.ts); setProgress(Math.round(parseInt(item.ts.split(":")[0]) * 60 / 52 + parseInt(item.ts.split(":")[1]) / 52)); }}
                    className="w-full flex items-center gap-3 group py-2 hover:bg-muted/30 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors flex-shrink-0 ${activeTimestamp === item.ts ? "border-primary bg-primary" : "border-border bg-white group-hover:border-primary/50"}`} />
                      {i < timeline.length - 1 && <div className="w-px h-5 bg-border mt-0.5" />}
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors" style={{ fontSize: "11px", fontFamily: "var(--font-mono)", minWidth: "36px" }}>{item.ts}</span>
                    <span className={`transition-colors ${activeTimestamp === item.ts ? "text-primary" : "text-foreground group-hover:text-primary"}`} style={{ fontSize: "13px" }}>{item.label}</span>
                    {activeTimestamp === item.ts && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSCRIPT */}
        {tab === "transcript" && (
          <div className="max-w-3xl space-y-3">
            {/* Search */}
            <div className="bg-white border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={transcriptSearch}
                  onChange={e => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript…"
                  className="w-full pl-8 pr-3 py-1.5 bg-muted rounded-lg border-0 outline-none focus:ring-1 focus:ring-primary/30"
                  style={{ fontSize: "13px" }}
                />
              </div>
              {transcriptSearch && (
                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{filteredTranscript.length} result{filteredTranscript.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {/* Transcript lines */}
            <div className="bg-white border border-border rounded-xl overflow-hidden divide-y divide-border/40">
              {filteredTranscript.map((line, i) => (
                <div key={i} className={`flex gap-4 px-5 py-3 hover:bg-muted/20 transition-colors ${line.speaker === "Patient" ? "" : "bg-muted/10"}`}>
                  {/* Timestamp */}
                  <button
                    onClick={() => setActiveTimestamp(line.ts)}
                    className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                    style={{ fontSize: "11px", fontFamily: "var(--font-mono)", width: "34px" }}
                  >
                    {line.ts}
                  </button>
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full mb-1.5 ${line.speaker === "Consultant" ? "bg-indigo-50 text-indigo-700" : "bg-violet-50 text-violet-700"}`} style={{ fontSize: "10px", fontWeight: 600 }}>
                      {line.speaker}
                    </span>
                    <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                      {highlightText(line.text, transcriptSearch)}
                    </p>
                  </div>
                </div>
              ))}
              {filteredTranscript.length === 0 && (
                <div className="py-10 text-center text-muted-foreground" style={{ fontSize: "13px" }}>No transcript lines match "{transcriptSearch}"</div>
              )}
            </div>
          </div>
        )}

        {/* AI SUMMARY */}
        {tab === "ai" && (
          <div className="max-w-3xl space-y-3">
            {/* Summary card */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-primary" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>AI Summary</p>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary" style={{ fontSize: "10px", fontWeight: 500 }}>Auto-generated</span>
              </div>
              <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>
                Patient reported significant improvement with breathing exercises, showing ~40% reduction in panic episodes. Primary stressors are workplace deadline pressure (4–5 PM) and disrupted sleep patterns linked to evening screen use. Social anxiety in team meetings was identified as a new focus. Session introduced PMR technique, blue light hygiene practices, and CBT reframing for meeting-related anxiety.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Key takeaways */}
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <MessageSquare size={13} className="text-blue-500" />
                  <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Key Takeaways</p>
                </div>
                <ul className="space-y-2">
                  {["Stress identified — deadline pressure at 4–5 PM", "Sleep pattern disrupted — waking 3 AM (cortisol)", "Blue light exposure affecting melatonin production", "CBT reframing introduced for meeting anxiety", "Progressive muscle relaxation assigned"].map((p, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: "12px" }}>
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action items */}
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckSquare size={13} className="text-emerald-500" />
                  <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Action Items</p>
                </div>
                <ul className="space-y-2">
                  {["Sleep before 11 PM — no screens 60 min before", "Daily 10-min mindfulness on waking", "PMR exercise before bed each night", "Reframe meetings: 3 positive affirmations", "Follow-up appointment in 14 days"].map((a, i) => (
                    <li key={i} className="flex items-center gap-2" style={{ fontSize: "12px" }}>
                      <div className="w-3.5 h-3.5 rounded border-2 border-emerald-300 flex-shrink-0" />
                      <span className="text-foreground">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={13} className="text-amber-500" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Important Keywords</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["anxiety", "CBT", "stress", "sleep hygiene", "PMR", "blue light", "cortisol", "mindfulness", "social anxiety", "deadline pressure"].map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100" style={{ fontSize: "11px", fontWeight: 500 }}>{kw}</span>
                ))}
              </div>
            </div>

            {/* Follow-up notes */}
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={13} className="text-slate-400" />
                <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Follow-up Notes</p>
              </div>
              <p className="text-foreground" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                Next session in 14 days (Jun 25). Focus: review sleep diary, assess PMR adherence, continue CBT reframing for meeting anxiety. Consider referral to support group if social anxiety persists beyond 2 sessions.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Next appointment:</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/8 text-primary" style={{ fontSize: "11px", fontWeight: 500, backgroundColor: "rgba(79,70,229,0.07)" }}>Jun 25, 2026 · 10:30 AM</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import { useState } from "react";
import { Sparkles, CheckSquare, Tag, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const summaries = [
  {
    id: "C-1048",
    patient: "Priya Mehta",
    consultant: "Dr. Arjun Rajan",
    type: "Therapy",
    date: "Jun 11, 2026",
    duration: "52 min",
    sentiment: "positive",
    riskLevel: "low",
    followUpDate: "Jun 25, 2026",
    summary: "Patient reported significant improvement with breathing exercises (~40% reduction in panic episodes). Primary stressors are workplace deadline pressure and disrupted sleep patterns linked to evening screen exposure. Social anxiety in team meetings identified as new focus area.",
    keyTakeaways: [
      "Stress identified — deadline pressure at 4–5 PM",
      "Sleep disrupted — waking 3 AM linked to cortisol pattern",
      "Blue light exposure suppressing melatonin",
      "CBT reframing introduced for meeting anxiety",
    ],
    actionItems: [
      "Sleep before 11 PM, no screens 60 min prior",
      "Daily 10-min mindfulness on waking",
      "PMR exercise each night before bed",
      "Follow-up in 14 days",
    ],
    keywords: ["anxiety", "stress", "sleep hygiene", "CBT", "PMR", "mindfulness"],
  },
  {
    id: "C-1047",
    patient: "Rohit Verma",
    consultant: "Dr. Sunita Patel",
    type: "Medical",
    date: "Jun 11, 2026",
    duration: "38 min",
    sentiment: "neutral",
    riskLevel: "medium",
    followUpDate: "Jun 18, 2026",
    summary: "Patient presented with recurring headaches and mild hypertension (BP: 138/88). Sedentary lifestyle and high sodium diet identified as primary contributors. Referred for blood panel and cardiology consultation as precaution.",
    keyTakeaways: [
      "Hypertension at borderline level (138/88 mmHg)",
      "Sodium intake significantly elevated",
      "No current medications — lifestyle intervention first",
      "Cardiology referral issued",
    ],
    actionItems: [
      "Reduce sodium — max 2g/day",
      "30-min walk daily for 4 weeks",
      "Blood panel at nearest lab by Jun 14",
      "Re-check BP in 7 days",
    ],
    keywords: ["hypertension", "headache", "sodium", "blood pressure", "cardiology"],
  },
  {
    id: "C-1046",
    patient: "Anita Singh",
    consultant: "Dr. Karan Mehta",
    type: "Advisory",
    date: "Jun 10, 2026",
    duration: "65 min",
    sentiment: "positive",
    riskLevel: "low",
    followUpDate: "Jul 10, 2026",
    summary: "Session focused on career transition anxiety following a role change. Client demonstrated strong self-awareness and positive outlook. Identified key concerns around imposter syndrome and peer validation. Built a 90-day confidence roadmap.",
    keyTakeaways: [
      "Imposter syndrome — common in new role transitions",
      "Strong existing skill set — confidence gap, not competence gap",
      "Peer comparison identified as key anxiety driver",
      "90-day roadmap created collaboratively",
    ],
    actionItems: [
      "Track 3 daily wins for 30 days",
      "Reduce social media comparison behavior",
      "One weekly accountability check-in with manager",
      "Read 'The First 90 Days' — Chapter 3–5",
    ],
    keywords: ["career", "imposter syndrome", "confidence", "transition", "roadmap"],
  },
];

const sentimentConfig: Record<string, { label: string; color: string }> = {
  positive: { label: "Positive Progress", color: "text-emerald-700 bg-emerald-50" },
  neutral: { label: "Needs Monitoring", color: "text-amber-700 bg-amber-50" },
  negative: { label: "Needs Attention", color: "text-red-600 bg-red-50" },
};

const riskConfig: Record<string, { label: string; color: string; dot: string }> = {
  low: { label: "Low", color: "text-emerald-700", dot: "bg-emerald-400" },
  medium: { label: "Medium", color: "text-amber-600", dot: "bg-amber-400" },
  high: { label: "High", color: "text-red-600", dot: "bg-red-400" },
};

export function ConsultationInsightsPage() {
  const [selected, setSelected] = useState(summaries[0]);

  return (
    <div className="p-5 flex gap-4 h-full">
      {/* Left list */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={13} className="text-primary" />
          <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>AI Summaries</p>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary" style={{ fontSize: "10px", fontWeight: 500 }}>{summaries.length} sessions</span>
        </div>
        {summaries.map(s => {
          const active = selected.id === s.id;
          const sent = sentimentConfig[s.sentiment];
          return (
            <button key={s.id} onClick={() => setSelected(s)} className={`w-full text-left p-3 rounded-xl border transition-all ${active ? "border-primary/30 bg-primary/4 shadow-sm" : "border-border bg-white hover:bg-muted/30"}`} style={{ backgroundColor: active ? "rgba(79,70,229,0.04)" : undefined }}>
              <div className="flex items-start justify-between gap-1 mb-1">
                <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>{s.patient}</p>
                <span className={`px-1.5 py-0.5 rounded-full ${sent.color}`} style={{ fontSize: "10px", fontWeight: 500 }}>{s.sentiment === "positive" ? "✓" : "!"}</span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{s.date} · {s.type}</p>
              <p className="text-muted-foreground mt-1 line-clamp-2" style={{ fontSize: "11px", lineHeight: 1.4 }}>{s.summary.slice(0, 70)}…</p>
            </button>
          );
        })}
      </div>

      {/* Right detail */}
      <div className="flex-1 min-w-0 space-y-3 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-foreground" style={{ fontSize: "15px", fontWeight: 700 }}>{selected.patient}</p>
                <span className={`px-2 py-0.5 rounded-full ${sentimentConfig[selected.sentiment].color}`} style={{ fontSize: "11px", fontWeight: 500 }}>{sentimentConfig[selected.sentiment].label}</span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{selected.id} · {selected.consultant} · {selected.date} · {selected.duration}</p>
            </div>
            <div className="flex items-center gap-4 text-right flex-shrink-0">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${riskConfig[selected.riskLevel].dot}`} />
                  <p className={riskConfig[selected.riskLevel].color} style={{ fontSize: "12px", fontWeight: 500 }}>{riskConfig[selected.riskLevel].label}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Follow-up</p>
                <p className="text-foreground mt-0.5" style={{ fontSize: "12px", fontWeight: 500 }}>{selected.followUpDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 border border-indigo-100 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-primary" />
            <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Summary</p>
          </div>
          <p className="text-foreground leading-relaxed" style={{ fontSize: "13px" }}>{selected.summary}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Key takeaways */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-foreground mb-3" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Key Takeaways</p>
            <ul className="space-y-2">
              {selected.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2" style={{ fontSize: "12px" }}>
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action items */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-foreground mb-3" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Action Items</p>
            <ul className="space-y-2">
              {selected.actionItems.map((a, i) => (
                <li key={i} className="flex items-center gap-2" style={{ fontSize: "12px" }}>
                  <div className="w-3.5 h-3.5 rounded border-2 border-primary/30 flex-shrink-0" />
                  <span className="text-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Tag size={12} className="text-amber-500" />
            <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Keywords</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selected.keywords.map(kw => (
              <span key={kw} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100" style={{ fontSize: "11px", fontWeight: 500 }}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={12} className="text-blue-500" />
            <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>ConsultIQ Recommendations</p>
          </div>
          <div className="space-y-2">
            {[
              { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50", text: "Patient is responding well — continue current therapeutic approach." },
              { icon: AlertTriangle, color: "text-amber-500 bg-amber-50", text: `Schedule follow-up no later than ${selected.followUpDate} to track progress.` },
              selected.riskLevel !== "low"
                ? { icon: AlertTriangle, color: "text-red-500 bg-red-50", text: "Medium risk flagged — consider escalation protocol if BP remains elevated." }
                : { icon: CheckCircle2, color: "text-blue-500 bg-blue-50", text: "Engagement quality high — patient actively participating in therapeutic work." },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${r.color}`}>
                  <r.icon size={12} />
                </div>
                <p className="text-foreground" style={{ fontSize: "12px", lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

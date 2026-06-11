import { useState } from "react";
import { Sparkles, CheckSquare, Tag, CheckCircle2, AlertTriangle, Calendar, Mic2 } from "lucide-react";

const summaries = [
  {
    id: "C-1048",
    title: "Therapy Session",
    consultant: "Dr. Arjun Rajan",
    date: "Jun 11, 2026",
    followUpDate: "Jun 25, 2026",
    riskLevel: "low",
    summary: "You reported significant improvement with breathing exercises — roughly 40% fewer panic episodes since the last session. Main stressors remain workplace deadline pressure around 4–5 PM and disrupted sleep linked to evening screen use. Social anxiety in team meetings was identified as a new area to work on.",
    keyTakeaways: [
      "Stress from deadline pressure at 4–5 PM identified as primary trigger",
      "Sleep disrupted — waking at 3 AM linked to cortisol and screen use",
      "Blue light from phone suppressing melatonin before bed",
      "CBT reframing technique introduced for meeting anxiety",
    ],
    actionItems: [
      { text: "Sleep before 11 PM — no phone 60 min before bed", done: false },
      { text: "Daily 10-min mindfulness meditation on waking", done: true },
      { text: "Progressive muscle relaxation (PMR) each night", done: false },
      { text: "Follow-up with Dr. Rajan on Jun 25", done: false },
    ],
    keywords: ["anxiety", "stress", "sleep hygiene", "CBT", "PMR", "blue light"],
    sourceRecording: "consultation_arjun_jun11.mp3",
  },
  {
    id: "C-1040",
    title: "Medical Check-up",
    consultant: "Dr. Riya Sharma",
    date: "May 28, 2026",
    followUpDate: "Jun 14, 2026",
    riskLevel: "medium",
    summary: "Routine check-up revealed borderline hypertension (BP 138/88) and Vitamin D deficiency (28 ng/mL). These are linked to fatigue and mild headaches you reported. Primary cause appears to be high sodium diet and sedentary routine.",
    keyTakeaways: [
      "Blood pressure borderline high at 138/88 mmHg",
      "Vitamin D deficiency confirmed at 28 ng/mL",
      "Low iron contributing to fatigue",
      "Sedentary routine identified as key lifestyle factor",
    ],
    actionItems: [
      { text: "Vitamin D3 supplement (2000 IU) every morning", done: true },
      { text: "Reduce sodium — max 2g per day", done: false },
      { text: "30-min brisk walk, 5 days a week", done: false },
      { text: "Blood retest at lab by Jun 14", done: false },
    ],
    keywords: ["hypertension", "vitamin D", "blood pressure", "sodium", "fatigue"],
    sourceRecording: "medical_riya_may28.mp3",
  },
];

const riskConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  low: { label: "Low risk", color: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
  medium: { label: "Monitor", color: "text-amber-700 bg-amber-50", icon: AlertTriangle },
  high: { label: "Needs attention", color: "text-red-600 bg-red-50", icon: AlertTriangle },
};

export function PatientAISummaries() {
  const [selected, setSelected] = useState(summaries[0]);
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});

  const getActionDone = (sid: string, i: number) =>
    actionDone[`${sid}-${i}`] ?? selected.actionItems[i]?.done;

  return (
    <div className="p-5 flex gap-4 h-full">
      {/* Session list */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <p className="text-muted-foreground mb-3 px-1" style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Summaries</p>
        {summaries.map(s => {
          const risk = riskConfig[s.riskLevel];
          const active = selected.id === s.id;
          return (
            <button key={s.id} onClick={() => setSelected(s)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${active ? "border-violet-300 bg-violet-50/60" : "border-border bg-white hover:bg-muted/30"}`}>
              <div className="flex items-start justify-between gap-1 mb-1">
                <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>{s.title}</p>
                <span className={`px-1.5 py-0.5 rounded-full flex-shrink-0 ${risk.color}`} style={{ fontSize: "9px", fontWeight: 600 }}>{risk.label}</span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{s.consultant}</p>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{s.date}</p>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-3">
        {/* Header */}
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-foreground" style={{ fontSize: "15px", fontWeight: 700 }}>{selected.title}</p>
                <span className={`px-2 py-0.5 rounded-full ${riskConfig[selected.riskLevel].color}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                  {riskConfig[selected.riskLevel].label}
                </span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{selected.consultant} · {selected.date} · {selected.id}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-muted-foreground" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Follow-up</p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Calendar size={11} className="text-muted-foreground" />
                <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{selected.followUpDate}</p>
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
          <div className="flex items-center gap-2 mt-3">
            <Mic2 size={11} className="text-muted-foreground" />
            <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Source: {selected.sourceRecording}</span>
          </div>
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

          {/* Action items (interactive) */}
          <div className="bg-white border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Action Items</p>
              <span className="text-muted-foreground" style={{ fontSize: "11px" }}>
                {selected.actionItems.filter((_, i) => getActionDone(selected.id, i)).length}/{selected.actionItems.length} done
              </span>
            </div>
            <ul className="space-y-2">
              {selected.actionItems.map((a, i) => {
                const done = getActionDone(selected.id, i);
                return (
                  <li key={i} className="flex items-center gap-2" style={{ fontSize: "12px" }}>
                    <button
                      onClick={() => setActionDone(prev => ({ ...prev, [`${selected.id}-${i}`]: !done }))}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? "border-emerald-400 bg-emerald-400" : "border-border hover:border-emerald-400"}`}
                    >
                      {done && <span className="text-white" style={{ fontSize: "8px" }}>✓</span>}
                    </button>
                    <span className={`${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.text}</span>
                  </li>
                );
              })}
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
      </div>
    </div>
  );
}

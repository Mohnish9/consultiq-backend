import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Dumbbell, Leaf, CheckSquare, Pill, MessageSquare } from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "pending" | "done" | "overdue";

interface Rec {
  text: string;
  priority: Priority;
  dueDate: string;
  status: Status;
  assignedBy: string;
  category: string;
}

const recommendations: Rec[] = [
  { text: "Sleep before 11 PM — no screens 60 min before bed", priority: "high", dueDate: "Daily", status: "pending", assignedBy: "Dr. Arjun Rajan", category: "lifestyle" },
  { text: "Daily 10-min mindfulness meditation on waking", priority: "high", dueDate: "Daily", status: "done", assignedBy: "Dr. Arjun Rajan", category: "exercises" },
  { text: "Progressive muscle relaxation (PMR) before bed", priority: "high", dueDate: "Daily", status: "pending", assignedBy: "Dr. Arjun Rajan", category: "exercises" },
  { text: "30-minute brisk walk, 5 days a week", priority: "medium", dueDate: "5×/week", status: "pending", assignedBy: "Dr. Riya Sharma", category: "exercises" },
  { text: "Reduce sodium intake — max 2g/day", priority: "high", dueDate: "Daily", status: "overdue", assignedBy: "Dr. Riya Sharma", category: "nutrition" },
  { text: "Vitamin D3 supplement (2000 IU) every morning", priority: "high", dueDate: "Daily", status: "done", assignedBy: "Dr. Riya Sharma", category: "medication" },
  { text: "Iron supplement with Vitamin C after dinner", priority: "medium", dueDate: "Daily", status: "pending", assignedBy: "Dr. Riya Sharma", category: "medication" },
  { text: "Keep daily anxiety journal — 3 entries/day", priority: "medium", dueDate: "Daily", status: "done", assignedBy: "Dr. Arjun Rajan", category: "tasks" },
  { text: "Complete self-assessment questionnaire", priority: "medium", dueDate: "Jun 18", status: "overdue", assignedBy: "Dr. Arjun Rajan", category: "tasks" },
  { text: "Read chapters 3–5 of recommended book", priority: "low", dueDate: "Jun 25", status: "pending", assignedBy: "Dr. Arjun Rajan", category: "tasks" },
  { text: "Patient demonstrates good resilience — encourage independent practice", priority: "low", dueDate: "Ongoing", status: "done", assignedBy: "Dr. Arjun Rajan", category: "notes" },
  { text: "Monitor sleep diary and report changes at next session", priority: "medium", dueDate: "Jun 25", status: "pending", assignedBy: "Dr. Arjun Rajan", category: "notes" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "lifestyle", label: "Lifestyle", icon: Leaf },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "nutrition", label: "Nutrition", icon: Leaf },
  { id: "medication", label: "Medication", icon: Pill },
  { id: "notes", label: "Consultant Notes", icon: MessageSquare },
];

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
  high: { label: "High", color: "text-red-600 bg-red-50", dot: "bg-red-400" },
  medium: { label: "Medium", color: "text-amber-600 bg-amber-50", dot: "bg-amber-400" },
  low: { label: "Low", color: "text-slate-500 bg-slate-100", dot: "bg-slate-300" },
};

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle2; color: string }> = {
  done: { label: "Done", icon: CheckCircle2, color: "text-emerald-600" },
  pending: { label: "Pending", icon: Clock, color: "text-amber-600" },
  overdue: { label: "Overdue", icon: AlertCircle, color: "text-red-500" },
};

export function PatientRecommendations() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [statuses, setStatuses] = useState<Record<number, Status>>({});

  const getStatus = (i: number): Status => statuses[i] || recommendations[i].status;
  const markDone = (i: number) => setStatuses(prev => ({ ...prev, [i]: "done" }));

  const filtered = activeCategory === "all" ? recommendations : recommendations.filter(r => r.category === activeCategory);
  const doneCount = recommendations.filter((_, i) => getStatus(i) === "done").length;

  return (
    <div className="p-5 space-y-4">
      {/* Progress bar */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Your Progress</p>
          <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{doneCount}/{recommendations.length} completed</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${(doneCount / recommendations.length) * 100}%` }} />
        </div>
        <div className="flex gap-4">
          {[
            { label: "Done", count: recommendations.filter((_, i) => getStatus(i) === "done").length, color: "text-emerald-600" },
            { label: "Pending", count: recommendations.filter((_, i) => getStatus(i) === "pending").length, color: "text-amber-600" },
            { label: "Overdue", count: recommendations.filter((_, i) => getStatus(i) === "overdue").length, color: "text-red-500" },
          ].map(s => (
            <span key={s.label} className={`${s.color}`} style={{ fontSize: "11px" }}>{s.count} {s.label}</span>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${activeCategory === c.id ? "bg-violet-600 text-white border-violet-600" : "bg-white border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}
            style={{ fontSize: "12px", fontWeight: activeCategory === c.id ? 500 : 400 }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Recommendation cards */}
      <div className="space-y-2">
        {filtered.map((rec, idx) => {
          const globalIdx = recommendations.indexOf(rec);
          const status = getStatus(globalIdx);
          const s = statusConfig[status];
          const p = priorityConfig[rec.priority];

          return (
            <div key={idx} className={`bg-white border rounded-xl p-4 transition-all ${status === "done" ? "border-border/50 opacity-70" : status === "overdue" ? "border-red-100 bg-red-50/20" : "border-border"}`}>
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => markDone(globalIdx)}
                  disabled={status === "done"}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    status === "done" ? "border-emerald-400 bg-emerald-400" : status === "overdue" ? "border-red-300 hover:border-red-500" : "border-border hover:border-violet-500"
                  }`}
                >
                  {status === "done" && <span className="text-white" style={{ fontSize: "9px" }}>✓</span>}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-foreground leading-snug ${status === "done" ? "line-through text-muted-foreground" : ""}`} style={{ fontSize: "13px", fontWeight: 500 }}>{rec.text}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    {/* Priority */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${p.color}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />{p.label} priority
                    </span>
                    {/* Due */}
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "11px" }}>
                      <Clock size={10} />{rec.dueDate}
                    </span>
                    {/* Assigned by */}
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>· {rec.assignedBy}</span>
                    {/* Status */}
                    <span className={`ml-auto flex items-center gap-1 ${s.color}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                      <s.icon size={11} />{s.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-border rounded-xl py-10 text-center text-muted-foreground" style={{ fontSize: "13px" }}>
            No recommendations in this category.
          </div>
        )}
      </div>
    </div>
  );
}

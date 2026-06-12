import { FileText, Mic2, Calendar, Star, ArrowRight, Download } from "lucide-react";

interface PatientDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

const consultationTimeline = [
  { id: "C-1048", date: "Jun 11, 2026", event: "Therapy Session completed", consultant: "Dr. Arjun Rajan", badge: "Completed", badgeColor: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-400", hasRecording: true, hasSummary: true },
  { id: "C-1048r", date: "Jun 11, 2026", event: "Recording uploaded", consultant: "48.2 MB · MP3 audio", badge: "Recording", badgeColor: "text-violet-700 bg-violet-50", dot: "bg-violet-400", hasRecording: false, hasSummary: false },
  { id: "C-1048s", date: "Jun 12, 2026", event: "AI Summary generated", consultant: "Therapy · C-1048", badge: "AI Summary", badgeColor: "text-indigo-700 bg-indigo-50", dot: "bg-indigo-400", hasRecording: false, hasSummary: false },
  { id: "C-1040", date: "May 28, 2026", event: "Medical Consultation completed", consultant: "Dr. Riya Sharma", badge: "Completed", badgeColor: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-400", hasRecording: true, hasSummary: true },
  { id: "C-1032", date: "May 14, 2026", event: "AI Summary generated", consultant: "Therapy · C-1032", badge: "AI Summary", badgeColor: "text-indigo-700 bg-indigo-50", dot: "bg-indigo-400", hasRecording: false, hasSummary: false },
  { id: "C-1025", date: "Apr 30, 2026", event: "Follow-up completed", consultant: "Dr. Karan Mehta · Advisory", badge: "Follow-up", badgeColor: "text-amber-700 bg-amber-50", dot: "bg-amber-400", hasRecording: true, hasSummary: true },
];

const recentDocs = [
  { name: "Session Notes — Jun 11", type: "PDF", from: "Dr. Arjun Rajan", date: "Jun 11" },
  { name: "Follow-up Instructions", type: "PDF", from: "Dr. Arjun Rajan", date: "Jun 11" },
  { name: "PMR Exercise Guide", type: "PDF", from: "Dr. Arjun Rajan", date: "Jun 11" },
  { name: "Sleep Hygiene Checklist", type: "PDF", from: "Dr. Riya Sharma", date: "May 28" },
];

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  return (
    <div className="p-5 space-y-4">
      {/* Patient overview — compact info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Next Appointment", value: "Jun 18", sub: "mohnishkaplish92 · 10:30 AM", icon: Calendar, color: "text-violet-600 bg-violet-50", page: "p-appointments" },
          { label: "Last Consultation", value: "Jun 11", sub: "Therapy · 52 min · Completed", icon: FileText, color: "text-blue-600 bg-blue-50", page: "p-consultations" },
          { label: "Latest Recording", value: "Available", sub: "consultation_jun11.mp3", icon: Mic2, color: "text-emerald-600 bg-emerald-50", page: "p-recordings" },
          { label: "Pending Actions", value: "5", sub: "3 high priority items", icon: Star, color: "text-amber-600 bg-amber-50", page: "p-recommendations" },
        ].map(s => (
          <button key={s.label} onClick={() => onNavigate(s.page)} className="bg-white border border-border rounded-xl p-4 text-left hover:shadow-sm transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={13} /></div>
            </div>
            <p className="text-foreground" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>{s.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Consultation timeline */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Consultation Timeline</p>
            <button onClick={() => onNavigate("p-consultations")} className="flex items-center gap-1 text-primary" style={{ fontSize: "12px" }}>
              All consultations <ArrowRight size={11} />
            </button>
          </div>
          <div className="p-4 space-y-0">
            {consultationTimeline.map((item, i) => (
              <div key={item.id + i} className="flex gap-3 group">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${item.dot}`} />
                  {i < consultationTimeline.length - 1 && <div className="w-px flex-1 bg-border my-1" style={{ minHeight: "16px" }} />}
                </div>
                {/* Content */}
                <div className="pb-3 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>{item.event}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{item.consultant}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{item.date}</span>
                      <span className={`px-2 py-0.5 rounded-full ${item.badgeColor}`} style={{ fontSize: "10px", fontWeight: 500 }}>{item.badge}</span>
                    </div>
                  </div>
                  {(item.hasRecording || item.hasSummary) && (
                    <div className="flex gap-2 mt-1.5">
                      {item.hasRecording && (
                        <button onClick={() => onNavigate("p-recordings")} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-violet-50 hover:text-violet-600 text-muted-foreground transition-colors" style={{ fontSize: "11px" }}>
                          <Mic2 size={10} /> Recording
                        </button>
                      )}
                      {item.hasSummary && (
                        <button onClick={() => onNavigate("p-summaries")} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-indigo-50 hover:text-indigo-600 text-muted-foreground transition-colors" style={{ fontSize: "11px" }}>
                          ✨ AI Summary
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {/* Upcoming appointments */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Upcoming</p>
              <button onClick={() => onNavigate("p-appointments")} className="text-primary" style={{ fontSize: "12px" }}>View all</button>
            </div>
            <div className="divide-y divide-border/50">
              {[
                { consultant: "Dr. Arjun Rajan", date: "Jun 18", time: "10:30 AM", type: "Therapy", mode: "Video" },
                { consultant: "Dr. Sunita Patel", date: "Jun 25", time: "2:00 PM", type: "Follow-up", mode: "In-person" },
              ].map((a, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{a.consultant}</p>
                    {a.mode === "Video" && (
                      <button className="px-2.5 py-1 rounded-lg bg-violet-600 text-white" style={{ fontSize: "10px", fontWeight: 500 }}>Join</button>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: "11px" }}>{a.date} · {a.time} · {a.type} · {a.mode}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent documents */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Recent Documents</p>
            </div>
            <div className="divide-y divide-border/50">
              {recentDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                  <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0" style={{ fontSize: "9px", fontWeight: 700, color: "#dc2626" }}>PDF</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate" style={{ fontSize: "12px", fontWeight: 500 }}>{doc.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{doc.from} · {doc.date}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

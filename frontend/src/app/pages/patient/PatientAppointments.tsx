import { useState } from "react";
import { Calendar, Video, MapPin, Clock, RefreshCw, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { getAppointmentsForPatient } from "../../services/appointmentService";
const upcoming = [
  { id: "A-0024", consultant: "Dr. Arjun Rajan", specialty: "Clinical Psychology", type: "Therapy Session", date: "Jun 18, 2026", time: "10:30 AM", duration: "60 min", mode: "Video", status: "confirmed" },
  { id: "A-0025", consultant: "Dr. Sunita Patel", specialty: "General Medicine", type: "Follow-up Consultation", date: "Jun 25, 2026", time: "2:00 PM", duration: "30 min", mode: "In-person", status: "confirmed" },
  { id: "A-0026", consultant: "Dr. Arjun Rajan", specialty: "Clinical Psychology", type: "Therapy Session", date: "Jul 2, 2026", time: "11:00 AM", duration: "60 min", mode: "Video", status: "tentative" },
];

const past = [
  { id: "A-0023", consultant: "Dr. Arjun Rajan", type: "Therapy Session", date: "Jun 11, 2026", time: "10:30 AM", mode: "Video", status: "completed" },
  { id: "A-0022", consultant: "Dr. Riya Sharma", type: "Medical Check-up", date: "May 28, 2026", time: "3:00 PM", mode: "In-person", status: "completed" },
  { id: "A-0021", consultant: "Dr. Arjun Rajan", type: "Therapy Session", date: "May 14, 2026", time: "10:30 AM", mode: "Video", status: "completed" },
  { id: "A-0020", consultant: "Dr. Karan Mehta", type: "Advisory", date: "Apr 30, 2026", time: "4:00 PM", mode: "In-person", status: "cancelled" },
];

export function PatientAppointments() {

  const [appointments, setAppointments] = useState<any[]>([]);
  console.log("appointments state =", appointments);

useEffect(() => {
  getAppointmentsForPatient(
    "ce894a38-9b92-4727-9a4e-e27cdf880b2c"
  )
    .then((data) => {
      console.log("Appointments:", data);
      setAppointments(data || []);
    })
    .catch(console.error);
}, []);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-5">
      {/* Reschedule modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-border p-6 w-80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-foreground" style={{ fontWeight: 600 }}>Reschedule Request</h3>
              <button onClick={() => setRescheduleId(null)}><X size={16} className="text-muted-foreground" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Choose a preferred date and time for your appointment <strong>{rescheduleId}</strong>.</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>Preferred Date</label>
                <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>Preferred Time</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none">
                  {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>Reason (optional)</label>
                <textarea rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none resize-none" placeholder="Brief reason..." />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRescheduleId(null)} className="flex-1 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => setRescheduleId(null)} className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700" style={{ fontWeight: 500 }}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["upcoming", "past"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`} style={{ fontWeight: tab === t ? 500 : 400 }}>
            {t === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {tab === "upcoming" && (
  <div className="space-y-3">
    {appointments.map((a) => (
      <div key={a.id} className="p-4 border rounded">
        <p>ID: {a.id}</p>
        <p>Date: {a.scheduled_at}</p>
        <p>Status: {a.status}</p>
      </div>
    ))}
  </div>
)}
      {tab === "past" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {["ID", "Consultant", "Type", "Date & Time", "Mode", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {past.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{a.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground" style={{ fontWeight: 500 }}>{a.consultant}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{a.type}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">{a.date}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.mode === "Video" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`} style={{ fontWeight: 500 }}>{a.mode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${a.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`} style={{ fontWeight: 500 }}>
                      {a.status === "completed" ? <CheckCircle2 size={10} /> : <X size={10} />}
                      {a.status === "completed" ? "Completed" : "Cancelled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { FileText, Mic, TrendingUp, Users, ArrowRight, Upload, Plus, BarChart2, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const monthlyData = [
  { month: "Jan", uploads: 14, consultations: 18 },
  { month: "Feb", uploads: 19, consultations: 24 },
  { month: "Mar", uploads: 16, consultations: 21 },
  { month: "Apr", uploads: 22, consultations: 28 },
  { month: "May", uploads: 26, consultations: 34 },
  { month: "Jun", uploads: 24, consultations: 31 },
];

const activityData = [
  { day: "Mon", sessions: 8 },
  { day: "Tue", sessions: 11 },
  { day: "Wed", sessions: 7 },
  { day: "Thu", sessions: 14 },
  { day: "Fri", sessions: 16 },
  { day: "Sat", sessions: 4 },
  { day: "Sun", sessions: 2 },
];

const recentConsultations = [
  { id: "C-1048", patient: "Priya Mehta", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Jun 11", duration: "52 min", status: "completed" },
  { id: "C-1047", patient: "Rohit Verma", consultant: "Dr. Sunita Patel", type: "Medical", date: "Jun 11", duration: "38 min", status: "processing" },
  { id: "C-1046", patient: "Anita Singh", consultant: "Dr. Karan Mehta", type: "Astrology", date: "Jun 10", duration: "65 min", status: "completed" },
  { id: "C-1045", patient: "Suresh Kumar", consultant: "Dr. Arjun Rajan", type: "Advisory", date: "Jun 10", duration: "44 min", status: "pending" },
  { id: "C-1044", patient: "Deepa Nair", consultant: "Dr. Riya Sharma", type: "Therapy", date: "Jun 9", duration: "58 min", status: "completed" },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  completed: { label: "Completed", color: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-500" },
  processing: { label: "Processing", color: "text-amber-700 bg-amber-50", dot: "bg-amber-400" },
  pending: { label: "Pending", color: "text-slate-500 bg-slate-100", dot: "bg-slate-300" },
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="p-5 space-y-4">

      {/* Stats row — compact 4-col */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total Consultations", value: "128", sub: "+6 this week", icon: FileText, accent: "text-blue-600 bg-blue-50" },
          { label: "Recordings Stored", value: "96", sub: "24 this month", icon: Mic, accent: "text-violet-600 bg-violet-50" },
          { label: "Active Consultants", value: "8", sub: "3 online now", icon: Users, accent: "text-emerald-600 bg-emerald-50" },
          { label: "Avg Session Length", value: "48 min", sub: "↑ 3 min vs last mo.", icon: TrendingUp, accent: "text-amber-600 bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase" }}>{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.accent} flex items-center justify-center`}><s.icon size={13} /></div>
            </div>
            <p className="text-foreground" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Upload Trends</p>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Recordings vs sessions · last 6 months</p>
            </div>
            <select className="border border-border rounded-md px-2 py-1 bg-white text-muted-foreground focus:outline-none" style={{ fontSize: "11px" }}>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="ciq-uploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ciq-sessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "12px", padding: "6px 10px" }} />
              <Area type="monotone" dataKey="uploads" name="Uploads" stroke="#4f46e5" strokeWidth={1.5} fill="url(#ciq-uploads)" />
              <Area type="monotone" dataKey="consultations" name="Sessions" stroke="#06b6d4" strokeWidth={1.5} fill="url(#ciq-sessions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly bar + actions */}
        <div className="flex flex-col gap-3">
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>This week</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={activityData} barSize={8}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "11px" }} />
                <Bar dataKey="sessions" name="Sessions" fill="#4f46e5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-border rounded-xl p-3 space-y-1.5">
            <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick actions</p>
            {[
              { label: "Upload recording", icon: Upload, page: "upload", color: "text-primary" },
              { label: "New consultation", icon: Plus, page: "upload", color: "text-emerald-600" },
              { label: "View analytics", icon: BarChart2, page: "analytics", color: "text-amber-600" },
            ].map(a => (
              <button key={a.label} onClick={() => onNavigate(a.page)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors group">
                <a.icon size={14} className={a.color} />
                <span className="text-foreground" style={{ fontSize: "13px" }}>{a.label}</span>
                <ArrowRight size={12} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent consultations */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Recent Consultations</p>
          <button onClick={() => onNavigate("consultations")} className="flex items-center gap-1 text-primary" style={{ fontSize: "12px" }}>
            View all <ArrowRight size={11} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Patient", "Consultant", "Type", "Date", "Duration", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-2 text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentConsultations.map(c => {
              const s = statusConfig[c.status];
              return (
                <tr key={c.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0" style={{ fontSize: "9px", fontWeight: 700 }}>
                        {c.patient.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{c.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-foreground" style={{ fontSize: "13px" }}>{c.consultant}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{c.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground" style={{ fontSize: "12px" }}>{c.date}</td>
                  <td className="px-4 py-2.5 text-muted-foreground" style={{ fontSize: "12px" }}>{c.duration}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.color}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => onNavigate("detail", c.id)} className="flex items-center gap-1 text-primary" style={{ fontSize: "12px" }}>
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

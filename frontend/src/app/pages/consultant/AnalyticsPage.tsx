import { useState } from "react";
import { Search, TrendingUp, Users, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyTrend = [
  { month: "Jan", sessions: 18, recordings: 14 },
  { month: "Feb", sessions: 24, recordings: 19 },
  { month: "Mar", sessions: 21, recordings: 16 },
  { month: "Apr", sessions: 28, recordings: 22 },
  { month: "May", sessions: 34, recordings: 26 },
  { month: "Jun", sessions: 31, recordings: 24 },
];

const consultantActivity = [
  { name: "Dr. Arjun Rajan", sessions: 38 },
  { name: "Dr. Sunita Patel", sessions: 29 },
  { name: "Dr. Karan Mehta", sessions: 22 },
  { name: "Dr. Riya Sharma", sessions: 18 },
  { name: "Dr. Neha Iyer", sessions: 12 },
  { name: "Prof. Anand Kumar", sessions: 9 },
];

const typeDistribution = [
  { name: "Therapy", value: 41, color: "#4f46e5" },
  { name: "Medical", value: 31, color: "#06b6d4" },
  { name: "Advisory", value: 17, color: "#10b981" },
  { name: "Astrology", value: 11, color: "#f59e0b" },
];

const searchResults = [
  { id: "C-1048", patient: "Priya Mehta", consultant: "Dr. Arjun Rajan", date: "Jun 11", type: "Therapy", status: "completed" },
  { id: "C-1043", patient: "Vikram Bose", consultant: "Dr. Arjun Rajan", date: "Jun 9", type: "Medical", status: "completed" },
  { id: "C-1038", patient: "Pooja Sharma", consultant: "Dr. Sunita Patel", date: "Jun 6", type: "Therapy", status: "completed" },
];

export function AnalyticsPage() {
  const [query, setQuery] = useState("");
  const [patientQ, setPatientQ] = useState("");
  const [consultantQ, setConsultantQ] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-11");
  const [searched, setSearched] = useState(false);

  const filteredResults = searchResults.filter(r => {
    const q = query.toLowerCase();
    return (!q || r.patient.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      && (!patientQ || r.patient.toLowerCase().includes(patientQ.toLowerCase()))
      && (!consultantQ || r.consultant.toLowerCase().includes(consultantQ.toLowerCase()));
  });

  return (
    <div className="p-5 space-y-4">
      {/* Summary stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Sessions", value: "156", sub: "6-month total", icon: FileText, color: "text-blue-600 bg-blue-50" },
          { label: "Avg Duration", value: "48 min", sub: "↑ 3 min vs Jan", icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
          { label: "Active Consultants", value: "8", sub: "2 onboarded this month", icon: Users, color: "text-emerald-600 bg-emerald-50" },
          { label: "Storage Used", value: "46 GB", sub: "of 100 GB · 46%", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em" }}>{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={13} /></div>
            </div>
            <p className="text-foreground" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-4">
          <p className="text-foreground mb-1" style={{ fontSize: "13px", fontWeight: 600 }}>Session Trends</p>
          <p className="text-muted-foreground mb-3" style={{ fontSize: "11px" }}>Sessions and recordings uploaded · Jan–Jun 2026</p>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#4f46e5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="recordings" name="Recordings" stroke="#06b6d4" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>By Type</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {typeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {typeDistribution.map(t => (
              <div key={t.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{t.name}</span>
                </div>
                <span className="text-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultant activity */}
      <div className="bg-white border border-border rounded-xl p-4">
        <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Consultant Activity</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={consultantActivity} layout="vertical" barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "12px" }} />
            <Bar dataKey="sessions" name="Sessions" fill="#4f46e5" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search */}
      <div className="bg-white border border-border rounded-xl p-4">
        <p className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Search Consultations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
          <div className="relative sm:col-span-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Patient name or consultation ID…"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-1 focus:ring-primary/30" style={{ fontSize: "13px" }} />
          </div>
          <input value={patientQ} onChange={e => setPatientQ(e.target.value)} placeholder="Filter by patient"
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none" style={{ fontSize: "13px" }} />
          <input value={consultantQ} onChange={e => setConsultantQ(e.target.value)} placeholder="Filter by consultant"
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none" style={{ fontSize: "13px" }} />
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white focus:outline-none" style={{ fontSize: "12px" }} />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white focus:outline-none" style={{ fontSize: "12px" }} />
          <button onClick={() => setSearched(true)} className="px-4 py-2 rounded-lg bg-primary text-white" style={{ fontSize: "13px", fontWeight: 500 }}>Search</button>
        </div>

        {searched && (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>{["ID", "Patient", "Consultant", "Date", "Type", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filteredResults.map(r => (
                  <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-muted-foreground" style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}>{r.id}</td>
                    <td className="px-4 py-2.5 text-foreground" style={{ fontSize: "13px", fontWeight: 500 }}>{r.patient}</td>
                    <td className="px-4 py-2.5 text-foreground" style={{ fontSize: "13px" }}>{r.consultant}</td>
                    <td className="px-4 py-2.5 text-muted-foreground" style={{ fontSize: "12px" }}>{r.date}</td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded-full bg-primary/8 text-primary" style={{ fontSize: "11px", fontWeight: 500, backgroundColor: "rgba(79,70,229,0.07)" }}>{r.type}</span></td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: "11px", fontWeight: 500 }}>Completed</span></td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground" style={{ fontSize: "13px" }}>No results found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

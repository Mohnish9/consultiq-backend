import { useState } from "react";
import { Search, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PatientConsultationsProps {
  onNavigate: (page: string, id?: string) => void;
}

const consultations = [
  { id: "C-1048", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Jun 11, 2026", duration: "52 min", status: "completed" },
  { id: "C-1040", consultant: "Dr. Riya Sharma", type: "Medical", date: "May 28, 2026", duration: "38 min", status: "completed" },
  { id: "C-1032", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "May 14, 2026", duration: "60 min", status: "completed" },
  { id: "C-1025", consultant: "Dr. Karan Mehta", type: "Advisory", date: "Apr 30, 2026", duration: "45 min", status: "completed" },
  { id: "C-1018", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Apr 16, 2026", duration: "55 min", status: "completed" },
  { id: "C-1011", consultant: "Dr. Sunita Patel", type: "Follow-up", date: "Apr 2, 2026", duration: "30 min", status: "completed" },
  { id: "C-1004", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Mar 19, 2026", duration: "58 min", status: "completed" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "text-emerald-600 bg-emerald-50" },
  scheduled: { label: "Scheduled", color: "text-blue-600 bg-blue-50" },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-50" },
};

const typeColors: Record<string, string> = {
  Therapy: "text-violet-600 bg-violet-50",
  Medical: "text-blue-600 bg-blue-50",
  Advisory: "text-teal-600 bg-teal-50",
  "Follow-up": "text-amber-600 bg-amber-50",
};

type SortKey = "id" | "consultant" | "type" | "date" | "duration";

export function PatientConsultations({ onNavigate }: PatientConsultationsProps) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = consultations.filter(c => {
    const q = search.toLowerCase();
    return !q || c.consultant.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={9} className={sortKey === k && sortDir === "asc" ? "text-violet-600" : "text-border"} />
      <ChevronDown size={9} className={sortKey === k && sortDir === "desc" ? "text-violet-600" : "text-border"} style={{ marginTop: "-2px" }} />
    </span>
  );

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by consultant or type..." className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">From</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} records</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {[{ k: "id", label: "ID" }, { k: "consultant", label: "Consultant" }, { k: "type", label: "Type" }, { k: "date", label: "Date" }, { k: "duration", label: "Duration" }].map(col => (
                  <th key={col.k} onClick={() => toggleSort(col.k as SortKey)} className="text-left px-4 py-3 text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none" style={{ fontWeight: 500 }}>
                    {col.label}<SortIcon k={col.k as SortKey} />
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground" style={{ fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => {
                const s = statusConfig[c.status];
                const t = typeColors[c.type] || "text-gray-600 bg-gray-50";
                return (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{c.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0" style={{ fontSize: "10px", fontWeight: 600 }}>
                          {c.consultant.split(" ").slice(-1)[0][0]}
                        </div>
                        <span className="text-sm text-foreground" style={{ fontWeight: 500 }}>{c.consultant}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${t}`} style={{ fontWeight: 500 }}>{c.type}</span></td>
                    <td className="px-4 py-3 text-sm text-foreground">{c.date}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.duration}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.color}`} style={{ fontWeight: 500 }}>{s.label}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => onNavigate("p-detail", c.id)} className="flex items-center gap-1 text-xs text-violet-600 hover:underline">
                        <Eye size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No consultations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"><ChevronLeft size={14} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs transition-colors ${p === page ? "bg-violet-600 text-white" : "hover:bg-muted text-muted-foreground"}`} style={{ fontWeight: p === page ? 500 : 400 }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

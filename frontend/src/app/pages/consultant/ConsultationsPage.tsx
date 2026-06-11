import { useState } from "react";
import { Search, ChevronUp, ChevronDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useConsultations } from "../../hooks/useConsultations";
import { PageState } from "../../components/shared/PageState";
import type { Consultation } from "../../types/consultation";

interface ConsultationsPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "text-emerald-600 bg-emerald-50" },
  processing: { label: "Processing", color: "text-amber-600 bg-amber-50" },
  pending:    { label: "Pending",    color: "text-slate-500 bg-slate-100" },
};

const typeColors: Record<string, string> = {
  Therapy:  "text-violet-600 bg-violet-50",
  Medical:  "text-blue-600 bg-blue-50",
  Astrology:"text-amber-600 bg-amber-50",
  Advisory: "text-teal-600 bg-teal-50",
};

type SortField = keyof Pick<Consultation, "id" | "patient" | "consultant" | "date" | "duration" | "type" | "status">;

export function ConsultationsPage({ onNavigate }: ConsultationsPageProps) {
  const {
    filtered,
    search,
    statusFilter,
    typeFilter,
    isLoading,
    isError,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    deleteConsultation,
    refetch,
  } = useConsultations();

  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");
  const [page, setPage]           = useState(1);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const perPage = 8;

  const sorted = [...filtered].sort((a, b) => {
    const av = String(a[sortField]);
    const bv = String(b[sortField]);
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated  = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  };

  const SortIcon = ({ f }: { f: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp  size={9} className={sortField === f && sortDir === "asc"  ? "text-primary" : "text-border"} />
      <ChevronDown size={9} className={sortField === f && sortDir === "desc" ? "text-primary" : "text-border"} style={{ marginTop: "-2px" }} />
    </span>
  );

  const confirmDelete = (id: string) => {
    deleteConsultation(id);
    setDeleteId(null);
  };

  return (
    <div className="p-6">
      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Delete confirmation">
          <div className="bg-white rounded-xl border border-border p-6 w-80 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <Trash2 size={18} className="text-red-500" aria-hidden="true" />
            </div>
            <h3 className="text-foreground mb-1" style={{ fontWeight: 600 }}>Delete Consultation</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to delete <strong>{deleteId}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => confirmDelete(deleteId)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search patient, consultant, or ID..."
              aria-label="Search consultations"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            aria-label="Filter by status"
            className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none text-foreground"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            aria-label="Filter by type"
            className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none text-foreground"
          >
            <option value="all">All Types</option>
            <option>Therapy</option>
            <option>Medical</option>
            <option>Astrology</option>
            <option>Advisory</option>
          </select>
          <span className="text-xs text-muted-foreground ml-auto" aria-live="polite">{filtered.length} results</span>
        </div>
      </div>

      {/* Loading / Error */}
      {(isLoading || isError) && (
        <PageState isLoading={isLoading} isError={isError} onRetry={refetch} />
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {(["id","patient","consultant","date","duration","type","status"] as SortField[]).map((key) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="text-left px-4 py-3 text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none capitalize"
                      style={{ fontWeight: 500 }}
                      scope="col"
                    >
                      {key}<SortIcon f={key} />
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground" style={{ fontWeight: 500 }} scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c => {
                  const s = statusConfig[c.status] ?? { label: c.status, color: "text-gray-600 bg-gray-50" };
                  const t = typeColors[c.type] ?? "text-gray-600 bg-gray-50";
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{c.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"
                            style={{ fontSize: "10px", fontWeight: 600 }}
                            aria-hidden="true"
                          >
                            {c.patient.split(" ").map((w: string) => w[0]).join("")}
                          </div>
                          <span className="text-sm text-foreground" style={{ fontWeight: 500 }}>{c.patient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.consultant}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.date}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.duration}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${t}`} style={{ fontWeight: 500 }}>{c.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${s.color}`} style={{ fontWeight: 500 }}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" role="group" aria-label={`Actions for ${c.id}`}>
                          <button onClick={() => onNavigate("detail", c.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors" aria-label={`View ${c.id}`}>
                            <Eye size={14} aria-hidden="true" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-amber-50 text-muted-foreground hover:text-amber-600 transition-colors" aria-label={`Edit ${c.id}`}>
                            <Edit2 size={14} aria-hidden="true" />
                          </button>
                          <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" aria-label={`Delete ${c.id}`}>
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600 transition-colors" aria-label={`Download ${c.id}`}>
                            <Download size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No consultations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing {sorted.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`w-7 h-7 rounded-lg text-xs transition-colors ${p === page ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"}`}
                  style={{ fontWeight: p === page ? 500 : 400 }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                aria-label="Next page"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

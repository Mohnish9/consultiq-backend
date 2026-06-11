// supabase/functions/analytics/index.ts
import {
  Router, ok, Errors,
  requireRole, getServiceClient,
} from "../_shared/utils.ts";

const router = new Router();

// ── GET /v1/analytics/summary ────────────────────────────────

router.get("/v1/analytics/summary", async (req) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");

  let consultFilter = "";
  if (profile.role === "consultant") {
    consultFilter = `consultant_id.eq.${profile.id}`;
  }

  // Total sessions
  const { count: totalSessions } = await svc
    .from("consultations")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null)
    ...(profile.role === "consultant" ? [["eq", "consultant_id", profile.id]] : []);

  // Use raw SQL via RPC for complex aggregates
  const { data: stats } = await svc.rpc("get_analytics_summary", {
    p_consultant_id: profile.role === "consultant" ? profile.id : null,
  });

  if (!stats) {
    // Fallback: compute individually
    const [sessionsRes, consultantsRes, storageRes] = await Promise.all([
      svc
        .from("consultations")
        .select("id, duration_minutes, status", { count: "exact" })
        .is("deleted_at", null)
        ...(profile.role === "consultant"
          ? [["eq", "consultant_id", profile.id]]
          : []),
      profile.role === "admin"
        ? svc.from("consultants").select("id", { count: "exact" })
        : Promise.resolve({ count: 1 }),
      profile.role === "admin"
        ? svc.from("consultants").select("storage_used_bytes, storage_limit_bytes")
        : svc
            .from("consultants")
            .select("storage_used_bytes, storage_limit_bytes")
            .eq("id", profile.id),
    ]);

    const sessions = sessionsRes.data ?? [];
    const completed = sessions.filter((s) => s.status === "completed").length;
    const avgDuration =
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0) /
              sessions.length
          )
        : 0;

    const storageRows = storageRes.data ?? [];
    const storageUsedGB =
      storageRows.reduce((s, r) => s + (r.storage_used_bytes ?? 0), 0) /
      1073741824;
    const storageTotalGB =
      storageRows.reduce((s, r) => s + (r.storage_limit_bytes ?? 107374182400), 0) /
      1073741824;

    return ok({
      totalSessions: sessionsRes.count ?? 0,
      avgDurationMinutes: avgDuration,
      activeConsultants: consultantsRes.count ?? 0,
      storageUsedGB: Math.round(storageUsedGB * 10) / 10,
      storageTotalGB: Math.round(storageTotalGB),
      completionRatePct:
        sessions.length > 0 ? Math.round((completed / sessions.length) * 100) : 0,
    });
  }

  return ok(stats);
});

// ── GET /v1/analytics/monthly-trend ─────────────────────────

router.get("/v1/analytics/monthly-trend", async (req) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");
  const url = new URL(req.url);
  const months = Math.min(24, parseInt(url.searchParams.get("months") ?? "6"));

  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - months + 1);
  fromDate.setDate(1);

  let query = svc
    .from("consultations")
    .select("date, recording_status")
    .is("deleted_at", null)
    .gte("date", fromDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (profile.role === "consultant") {
    query = query.eq("consultant_id", profile.id);
  }

  const { data: rows, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);

  // Group by month
  const monthMap = new Map<string, { sessions: number; recordings: number }>();

  for (let i = 0; i < months; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - months + 1 + i);
    const key = d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear();
    monthMap.set(key, { sessions: 0, recordings: 0 });
  }

  for (const row of rows ?? []) {
    const d = new Date(row.date);
    const key = d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear();
    const existing = monthMap.get(key);
    if (existing) {
      existing.sessions++;
      if (row.recording_status === "uploaded") existing.recordings++;
    }
  }

  const result = Array.from(monthMap.entries()).map(([month, v]) => ({
    month: month.split(" ")[0], // just "Jan", "Feb" etc.
    ...v,
  }));

  return ok(result);
});

// ── GET /v1/analytics/consultant-activity ───────────────────

router.get("/v1/analytics/consultant-activity", async (req) => {
  await requireRole(req, "admin");
  const svc = getServiceClient();

  const { data, error: dbErr } = await svc
    .from("consultations")
    .select("consultant_id, consultants!inner ( users!inner ( name ) )")
    .is("deleted_at", null);

  if (dbErr) return Errors.internal(dbErr.message);

  // Aggregate
  const countMap = new Map<string, { name: string; sessions: number }>();
  for (const row of data ?? []) {
    const cid = row.consultant_id;
    const name = (row as any).consultants?.users?.name ?? "Unknown";
    const existing = countMap.get(cid);
    if (existing) {
      existing.sessions++;
    } else {
      countMap.set(cid, { name, sessions: 1 });
    }
  }

  const result = Array.from(countMap.values())
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 20);

  return ok(result);
});

// ── GET /v1/analytics/type-distribution ─────────────────────

router.get("/v1/analytics/type-distribution", async (req) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");

  const COLORS: Record<string, string> = {
    Therapy: "#4f46e5",
    Medical: "#0ea5e9",
    Advisory: "#10b981",
    "Follow-up": "#f59e0b",
    Other: "#6b7280",
  };

  let query = svc
    .from("consultations")
    .select("type")
    .is("deleted_at", null);

  if (profile.role === "consultant") {
    query = query.eq("consultant_id", profile.id);
  }

  const { data, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);

  const countMap = new Map<string, number>();
  for (const row of data ?? []) {
    const t = row.type ?? "Other";
    countMap.set(t, (countMap.get(t) ?? 0) + 1);
  }

  const result = Array.from(countMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name] ?? "#6b7280",
  }));

  return ok(result);
});

Deno.serve((req) => router.dispatch(req));

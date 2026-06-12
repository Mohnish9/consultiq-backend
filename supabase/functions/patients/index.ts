 
import {
  Router, ok, created, noContent, Errors,
  requireAuth, requireRole,
  parsePagination, paginatedResponse,
} from "../_shared/utils.ts";
 
const router = new Router();
 
// ═══════════════════════════════════════════════════
// PATIENTS
// ═══════════════════════════════════════════════════
 
router.get("/v1/patients/me", async (req) => {
  const { profile, svc } = await requireAuth(req);
  if (profile.role !== "patient" && profile.role !== "admin") return Errors.forbidden();
 
  const { data, error: dbErr } = await svc
    .from("patients")
    .select("*, users!inner ( name, email, avatar_initials, created_at )")
    .eq("id", profile.id)
    .single();
 
  if (dbErr || !data) return Errors.notFound("Patient");
  return ok(data);
});
 
router.put("/v1/patients/me", async (req) => {
  const { profile, svc } = await requireAuth(req);
  if (profile.role !== "patient") return Errors.forbidden();
 
  const body = await req.json();
  const allowed = [
    "date_of_birth", "gender", "blood_group", "allergies",
    "address", "city", "state", "phone",
    "emergency_contact_name", "emergency_contact_relationship", "emergency_contact_phone",
  ];
 
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];
 
  const { data, error: dbErr } = await svc
    .from("patients")
    .update(update)
    .eq("id", profile.id)
    .select()
    .single();
 
  if (dbErr || !data) return Errors.notFound("Patient");
  return ok(data);
});
 
router.get("/v1/patients/:id", async (req, { id }) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");
 
  const { data, error: dbErr } = await svc
    .from("patients")
    .select("*, users!inner ( name, email, avatar_initials )")
    .eq("id", id)
    .single();
 
  if (dbErr || !data) return Errors.notFound("Patient");
  return ok(data);
});
 
// ═══════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════
 
router.get("/v1/appointments", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
  const pg = parsePagination(url, "scheduled_at");
 
  let query = svc
    .from("appointments")
    .select(
      `*, 
       patients!inner ( id, users!inner ( name, email, avatar_initials ) ),
       consultants!inner ( id, users!inner ( name, email, avatar_initials ) )`,
      { count: "exact" }
    )
    .is("deleted_at", null);
 
  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);
 
  const status = url.searchParams.get("status");
  const patientId = url.searchParams.get("patientId");
  const consultantId = url.searchParams.get("consultantId");
 
  if (status) query = query.eq("status", status);
  if (patientId && profile.role !== "patient") query = query.eq("patient_id", patientId);
  if (consultantId && profile.role === "admin") query = query.eq("consultant_id", consultantId);
 
  // Auto-expire check (best effort)
  await svc.rpc("expire_past_appointments").catch(() => {});
 
  query = query
    .order(pg.sortBy, { ascending: pg.sortDir === "asc" })
    .range(pg.offset, pg.offset + pg.pageSize - 1);
 
  const { data, count, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);
 
  return ok(paginatedResponse(data ?? [], count ?? 0, pg.page, pg.pageSize));
});
 
router.post("/v1/appointments", async (req) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");

  const body = await req.json();
  const patientId = body.patientId ?? body.patient_id;
  const requestedConsultantId = body.consultantId ?? body.consultant_id;
  const consultantId = profile.role === "admin"
    ? requestedConsultantId ?? profile.id
    : profile.id;
  const scheduledAt = body.scheduledAt ?? body.scheduled_at;
  const durationMinutes = body.durationMinutes ?? body.duration_minutes ?? 60;
  const { type, mode, notes } = body;

  if (!patientId || !scheduledAt) {
    return Errors.validation("patientId and scheduledAt are required.");
  }

  if (profile.role !== "admin" && requestedConsultantId && requestedConsultantId !== profile.id) {
    return Errors.forbidden();
  }

  const { data: patient, error: patientErr } = await svc
    .from("patients")
    .select("id, users!inner(is_active, deleted_at)")
    .eq("id", patientId)
    .eq("users.is_active", true)
    .is("users.deleted_at", null)
    .maybeSingle();

  if (patientErr) return Errors.internal(patientErr.message);
  if (!patient) return Errors.notFound("Patient");

  const { data: consultant, error: consultantErr } = await svc
    .from("consultants")
    .select("id, users!inner(is_active, deleted_at)")
    .eq("id", consultantId)
    .eq("users.is_active", true)
    .is("users.deleted_at", null)
    .maybeSingle();

  if (consultantErr) return Errors.internal(consultantErr.message);
  if (!consultant) return Errors.notFound("Consultant");

  const { data, error: dbErr } = await svc
    .from("appointments")
    .insert({
      patient_id: patientId,
      consultant_id: consultantId,
      scheduled_at: scheduledAt,
      duration_minutes: durationMinutes,
      type,
      mode: mode ?? "Video",
      notes,
      status: "upcoming",
    })
    .select()
    .single();

  if (dbErr) return Errors.internal(dbErr.message);

  // Reminder notification
  await svc.from("notifications").insert({
    user_id: patientId,
    type: "appointment.reminder",
    payload: { appointmentId: data.id, scheduledAt },
  });

  return created(data);
});
 
router.get("/v1/appointments/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);
  let query = svc
    .from("appointments")
    .select("*, patients!inner ( id, users!inner ( name, email, avatar_initials ) ), consultants!inner ( id, users!inner ( name, email, avatar_initials ) )")
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);

  const { data, error: dbErr } = await query.single();
  if (dbErr || !data) return Errors.notFound("Appointment");
  return ok(data);
});
 
router.put("/v1/appointments/:id", async (req, { id }) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");
  const body = await req.json();
  const allowed = ["scheduled_at", "duration_minutes", "type", "mode", "notes", "status"];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];
 
  let query = svc
    .from("appointments")
    .update(update)
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);

  const { data, error: dbErr } = await query
    .select()
    .single();
 
  if (dbErr || !data) return Errors.notFound("Appointment");
  return ok(data);
});
 
router.post("/v1/appointments/:id/cancel", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);
  const { reason } = await req.json();

  let query = svc
    .from("appointments")
    .update({ status: "cancelled", cancel_reason: reason ?? null })
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);

  const { data, error: dbErr } = await query
    .select()
    .single();
 
  if (dbErr || !data) return Errors.notFound("Appointment");
  return ok({ status: "cancelled", cancelReason: data.cancel_reason });
});
 
// ═══════════════════════════════════════════════════
// AI SUMMARIES
// ═══════════════════════════════════════════════════
 
router.get("/v1/ai-summaries", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
  const pg = parsePagination(url, "generated_at");
 
  let query = svc
    .from("ai_summaries")
    .select("*", { count: "exact" });
 
  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);
 
  const sentiment = url.searchParams.get("sentiment");
  const riskLevel = url.searchParams.get("riskLevel");
  const patientId = url.searchParams.get("patientId");
  const consultantId = url.searchParams.get("consultantId");
 
  if (sentiment) query = query.eq("sentiment", sentiment);
  if (riskLevel) query = query.eq("risk_level", riskLevel);
  if (patientId && profile.role !== "patient") query = query.eq("patient_id", patientId);
  if (consultantId && profile.role === "admin") query = query.eq("consultant_id", consultantId);
 
  query = query
    .order(pg.sortBy, { ascending: pg.sortDir === "asc" })
    .range(pg.offset, pg.offset + pg.pageSize - 1);
 
  const { data, count, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);
  return ok(paginatedResponse(data ?? [], count ?? 0, pg.page, pg.pageSize));
});
 
router.get("/v1/ai-summaries/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);
  let query = svc
    .from("ai_summaries")
    .select("*")
    .eq("id", id);

  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);

  const { data, error: dbErr } = await query.single();
  if (dbErr || !data) return Errors.notFound("AI Summary");
  return ok(data);
});
 
// ═══════════════════════════════════════════════════
// RECOMMENDATIONS
// ═══════════════════════════════════════════════════
 
router.get("/v1/recommendations", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
 
  let query = svc
    .from("recommendations")
    .select("*")
    .is("deleted_at", null);
 
  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") {
    const { data: consultations, error: consultErr } = await svc
      .from("consultations")
      .select("id")
      .eq("consultant_id", profile.id)
      .is("deleted_at", null);
    if (consultErr) return Errors.internal(consultErr.message);
    const ids = (consultations ?? []).map((row) => row.id);
    if (ids.length === 0) return ok([]);
    query = query.in("consultation_id", ids);
  }
 
  const patientId = url.searchParams.get("patientId");
  const consultationId = url.searchParams.get("consultationId");
  const category = url.searchParams.get("category");
  const completed = url.searchParams.get("completed");
  const priority = url.searchParams.get("priority");
 
  if (patientId && profile.role !== "patient") query = query.eq("patient_id", patientId);
  if (consultationId) query = query.eq("consultation_id", consultationId);
  if (category) query = query.eq("category", category);
  if (completed !== null && completed !== undefined) {
    query = query.eq("completed", completed === "true");
  }
  if (priority) query = query.eq("priority", priority);
 
  query = query.order("created_at", { ascending: false });
 
  const { data, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);
  return ok(data ?? []);
});
 
router.post("/v1/recommendations", async (req) => {
  const { profile, svc } = await requireRole(req, "consultant", "admin");
  const body = await req.json();
  const { patientId, consultationId, category, description, priority } = body;
 
  if (!patientId || !consultationId || !category || !description) {
    return Errors.validation("patientId, consultationId, category, and description are required.");
  }
 
  let consultQuery = svc
    .from("consultations")
    .select("id, patient_id, consultant_id")
    .eq("id", consultationId)
    .eq("patient_id", patientId)
    .is("deleted_at", null);

  if (profile.role === "consultant") consultQuery = consultQuery.eq("consultant_id", profile.id);

  const { data: consultation, error: consultationErr } = await consultQuery.maybeSingle();
  if (consultationErr) return Errors.internal(consultationErr.message);
  if (!consultation) return Errors.notFound("Consultation");

  const { data, error: dbErr } = await svc
    .from("recommendations")
    .insert({
      patient_id: patientId,
      consultation_id: consultationId,
      category,
      description,
      priority: priority ?? "Medium",
    })
    .select()
    .single();
 
  if (dbErr) return Errors.internal(dbErr.message);
  return created(data);
});
 
router.patch("/v1/recommendations/:id/complete", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  let query = svc
    .from("recommendations")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "patient") query = query.eq("patient_id", profile.id);
  else if (profile.role === "consultant") {
    const { data: consultations, error: consultErr } = await svc
      .from("consultations")
      .select("id")
      .eq("consultant_id", profile.id)
      .is("deleted_at", null);
    if (consultErr) return Errors.internal(consultErr.message);
    const ids = (consultations ?? []).map((row) => row.id);
    if (ids.length === 0) return Errors.notFound("Recommendation");
    query = query.in("consultation_id", ids);
  }

  const { data, error: dbErr } = await query
    .select()
    .single();
 
  if (dbErr || !data) return Errors.notFound("Recommendation");
  return ok({ id: data.id, completed: true, completedAt: data.completed_at });
});
 
// ═══════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════

router.get("/v1/notifications", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";

  let query = svc
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (profile.role !== "admin") query = query.eq("user_id", profile.id);
  if (unreadOnly) query = query.eq("read", false);

  const { data, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);
  return ok(data ?? []);
});

router.patch("/v1/notifications/:id/read", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  let query = svc
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (profile.role !== "admin") query = query.eq("user_id", profile.id);

  const { data, error: dbErr } = await query.select().single();
  if (dbErr || !data) return Errors.notFound("Notification");
  return ok(data);
});

Deno.serve((req) => router.dispatch(req));
 

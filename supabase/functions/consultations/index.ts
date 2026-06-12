// supabase/functions/consultations/index.ts
import {
  Router, ok, created, noContent, accepted, Errors,
  requireAuth, getServiceClient,
  parsePagination, paginatedResponse,
} from "../_shared/utils.ts";

const router = new Router();

const CONSULTATION_SELECT = `
  id, patient_id, consultant_id, date, duration_minutes,
  type, status, ai_status, recording_status, notes,
  created_by, created_at, updated_at,
  patients!inner ( id, users!inner ( name, email, avatar_initials ) ),
  consultants!inner ( id, users!inner ( name, email, avatar_initials ) )
`;

// ── GET /v1/consultations ────────────────────────────────────

router.get("/v1/consultations", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
  const pg = parsePagination(url, "date");

  let query = svc
    .from("consultations")
    .select(CONSULTATION_SELECT, { count: "exact" })
    .is("deleted_at", null);

  // Scope by role
  if (profile.role === "consultant") {
    query = query.eq("consultant_id", profile.id);
  } else if (profile.role === "patient") {
    query = query.eq("patient_id", profile.id);
  }

  // Filters
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");
  const consultantId = url.searchParams.get("consultantId");
  const patientId = url.searchParams.get("patientId");
  const search = url.searchParams.get("search");
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const aiStatus = url.searchParams.get("aiStatus");

  if (status) query = query.eq("status", status);
  if (type) query = query.eq("type", type);
  if (aiStatus) query = query.eq("ai_status", aiStatus);
  if (consultantId && profile.role === "admin") query = query.eq("consultant_id", consultantId);
  if (patientId && profile.role !== "patient") query = query.eq("patient_id", patientId);
  if (dateFrom) query = query.gte("date", dateFrom);
  if (dateTo) query = query.lte("date", dateTo);
  if (search) {
    query = query.textSearch("notes", search, { type: "websearch" });
  }

  query = query
    .order(pg.sortBy, { ascending: pg.sortDir === "asc" })
    .range(pg.offset, pg.offset + pg.pageSize - 1);

  const { data, count, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);

  return ok(paginatedResponse(data ?? [], count ?? 0, pg.page, pg.pageSize));
});

// ── POST /v1/consultations ───────────────────────────────────

router.post("/v1/consultations", async (req) => {
  const { profile, svc } = await requireAuth(req);

  if (!["consultant", "admin"].includes(profile.role)) {
    return Errors.forbidden();
  }

  const body = await req.json();
  const { patient_id, date, type, notes, duration_minutes } = body;
  const requestedConsultantId = body.consultant_id;
  const consultantId = profile.role === "admin" ? requestedConsultantId ?? profile.id : profile.id;

  if (!patient_id || !date) {
    return Errors.validation("patient_id and date are required.");
  }

  if (profile.role !== "admin" && requestedConsultantId && requestedConsultantId !== profile.id) {
    return Errors.forbidden();
  }

  const { data: patient, error: patientErr } = await svc
    .from("patients")
    .select("id, users!inner(is_active, deleted_at)")
    .eq("id", patient_id)
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
    .from("consultations")
    .insert({
      patient_id,
      consultant_id: consultantId,
      date,
      type,
      notes,
      duration_minutes,
      created_by: profile.id,
      status: "pending",
      ai_status: "pending",
      recording_status: "none",
    })
    .select(CONSULTATION_SELECT)
    .single();

  if (dbErr) return Errors.internal(dbErr.message);
  return created(data);
});

// ── GET /v1/consultations/:id ────────────────────────────────

router.get("/v1/consultations/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  let query = svc
    .from("consultations")
    .select(CONSULTATION_SELECT)
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);
  else if (profile.role === "patient") query = query.eq("patient_id", profile.id);

  const { data, error: dbErr } = await query.single();

  if (dbErr || !data) return Errors.notFound("Consultation");
  return ok(data);
});

// ── PUT /v1/consultations/:id ────────────────────────────────

router.put("/v1/consultations/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  if (!["consultant", "admin"].includes(profile.role)) {
    return Errors.forbidden();
  }

  const body = await req.json();
  const allowed = ["date", "type", "notes", "duration_minutes", "status"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  let query = svc
    .from("consultations")
    .update(update)
    .eq("id", id)
    .is("deleted_at", null);

  if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);

  const { data, error: dbErr } = await query
    .select(CONSULTATION_SELECT)
    .single();

  if (dbErr || !data) return Errors.notFound("Consultation");
  return ok(data);
});

// ── DELETE /v1/consultations/:id (soft) ─────────────────────

router.delete("/v1/consultations/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  if (profile.role !== "admin") return Errors.forbidden();

  const { error: dbErr } = await svc
    .from("consultations")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return Errors.internal(dbErr.message);
  return noContent();
});

// ── GET /v1/consultations/:id/recordings ────────────────────

router.get("/v1/consultations/:id/recordings", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  let consultQuery = svc.from("consultations").select("id").eq("id", id).is("deleted_at", null);
  if (profile.role === "consultant") consultQuery = consultQuery.eq("consultant_id", profile.id);
  else if (profile.role === "patient") consultQuery = consultQuery.eq("patient_id", profile.id);
  const { data: consult } = await consultQuery.maybeSingle();
  if (!consult) return Errors.notFound("Consultation");

  const { data, error: dbErr } = await svc
    .from("recordings")
    .select("*")
    .eq("consultation_id", id)
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false });

  if (dbErr) return Errors.internal(dbErr.message);
  return ok(data ?? []);
});

// ── GET /v1/consultations/:id/transcript ────────────────────

router.get("/v1/consultations/:id/transcript", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  let consultQuery = svc.from("consultations").select("id").eq("id", id).is("deleted_at", null);
  if (profile.role === "consultant") consultQuery = consultQuery.eq("consultant_id", profile.id);
  else if (profile.role === "patient") consultQuery = consultQuery.eq("patient_id", profile.id);
  const { data: consult } = await consultQuery.maybeSingle();
  if (!consult) return Errors.notFound("Consultation");

  const { data, error: dbErr } = await svc
    .from("transcripts")
    .select("id, consultation_id, content, language, word_count, generated_at, model")
    .eq("consultation_id", id)
    .single();

  if (dbErr || !data) return Errors.notFound("Transcript");

  return ok({
    consultationId: id,
    lines: data.content,
    wordCount: data.word_count,
    generatedAt: data.generated_at,
    language: data.language,
    model: data.model,
  });
});

// ── GET /v1/consultations/:id/ai-summary ────────────────────

router.get("/v1/consultations/:id/ai-summary", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  // Check consultation's ai_status first
  let consultQuery = svc
    .from("consultations")
    .select("ai_status")
    .eq("id", id);

  if (profile.role === "consultant") consultQuery = consultQuery.eq("consultant_id", profile.id);
  else if (profile.role === "patient") consultQuery = consultQuery.eq("patient_id", profile.id);

  const { data: consult } = await consultQuery.single();

  if (!consult) return Errors.notFound("Consultation");

  if (consult.ai_status === "processing") {
    return new Response(
      JSON.stringify({ aiStatus: "processing", progress: 0.5 }),
      {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { data, error: dbErr } = await svc
    .from("ai_summaries")
    .select("*")
    .eq("consultation_id", id)
    .single();

  if (dbErr || !data) return Errors.notFound("AI Summary");
  return ok(data);
});

// ── POST /v1/consultations/:id/ai-summary ───────────────────

router.post("/v1/consultations/:id/ai-summary", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  if (!["consultant", "admin"].includes(profile.role)) {
    return Errors.forbidden();
  }

  let consultQuery = svc.from("consultations").select("id").eq("id", id).is("deleted_at", null);
  if (profile.role === "consultant") consultQuery = consultQuery.eq("consultant_id", profile.id);
  const { data: consult } = await consultQuery.maybeSingle();
  if (!consult) return Errors.notFound("Consultation");

  // Mark as processing
  await svc
    .from("consultations")
    .update({ ai_status: "processing" })
    .eq("id", id);

  // Queue job by invoking the ai-pipeline function asynchronously
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Fire-and-forget the AI pipeline
  fetch(`${supabaseUrl}/functions/v1/ai-pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ consultationId: id, triggeredBy: profile.id }),
  }).catch((e) => console.error("Failed to invoke ai-pipeline:", e));

  return accepted({ message: "Generation started", aiStatus: "processing" });
});

Deno.serve((req) => router.dispatch(req));
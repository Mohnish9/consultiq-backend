// supabase/functions/recordings/index.ts
import {
  Router, ok, created, noContent, Errors,
  requireAuth, getServiceClient,
  parsePagination, paginatedResponse,
} from "../_shared/utils.ts";

const router = new Router();

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

const AUDIO_TYPES = new Set([
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg",
  "audio/webm", "audio/aac", "audio/flac",
]);
const VIDEO_TYPES = new Set([
  "video/mp4", "video/webm", "video/ogg", "video/quicktime",
  "video/x-msvideo", "video/x-matroska",
]);

function detectFileType(mimeType: string): "audio" | "video" | null {
  if (AUDIO_TYPES.has(mimeType)) return "audio";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  return null;
}

// ── GET /v1/recordings ───────────────────────────────────────

router.get("/v1/recordings", async (req) => {
  const { profile, svc } = await requireAuth(req);
  const url = new URL(req.url);
  const pg = parsePagination(url, "uploaded_at");

  let query = svc
    .from("recordings")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (profile.role === "consultant") query = query.eq("consultant_id", profile.id);
  else if (profile.role === "patient") query = query.eq("patient_id", profile.id);

  const consultationId = url.searchParams.get("consultationId");
  const patientId = url.searchParams.get("patientId");

  if (consultationId) query = query.eq("consultation_id", consultationId);
  if (patientId && profile.role !== "patient") query = query.eq("patient_id", patientId);

  query = query
    .order(pg.sortBy, { ascending: pg.sortDir === "asc" })
    .range(pg.offset, pg.offset + pg.pageSize - 1);

  const { data, count, error: dbErr } = await query;
  if (dbErr) return Errors.internal(dbErr.message);

  return ok(paginatedResponse(data ?? [], count ?? 0, pg.page, pg.pageSize));
});

// ── POST /v1/recordings/upload ───────────────────────────────

router.post("/v1/recordings/upload", async (req) => {
  const { profile, svc } = await requireAuth(req);

  if (!["consultant", "admin"].includes(profile.role)) {
    return Errors.forbidden();
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return Errors.validation("Request must be multipart/form-data.");
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Errors.validation("Invalid form data.");
  }

  const file = formData.get("file") as File | null;
  const consultationId = formData.get("consultationId") as string | null;

  if (!file || !consultationId) {
    return Errors.validation("file and consultationId are required.");
  }

  if (file.size > MAX_FILE_SIZE) return Errors.fileTooLarge();

  const fileType = detectFileType(file.type);
  if (!fileType) return Errors.unsupportedMedia();

  // Verify consultation exists and belongs to consultant
  const { data: consult, error: consultErr } = await svc
    .from("consultations")
    .select("id, patient_id, consultant_id")
    .eq("id", consultationId)
    .single();

  if (consultErr || !consult) return Errors.notFound("Consultation");

  if (profile.role === "consultant" && consult.consultant_id !== profile.id) {
    return Errors.forbidden();
  }

  // Build storage path: recordings/<consultationId>/<timestamp>-<filename>
  const ts = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${consultationId}/${ts}-${safeName}`;

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const { error: storageErr } = await svc.storage
    .from("recordings")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageErr) {
    console.error("Storage upload error:", storageErr);
    return Errors.internal("File upload failed.");
  }

  // Create recording record
  const { data: recording, error: dbErr } = await svc
    .from("recordings")
    .insert({
      consultation_id: consultationId,
      patient_id: consult.patient_id,
      consultant_id: consult.consultant_id,
      file_name: file.name,
      storage_path: storagePath,
      file_size_bytes: file.size,
      file_type: fileType,
      status: "processing",
    })
    .select()
    .single();

  if (dbErr) {
    console.error("DB insert error:", dbErr);
    return Errors.internal("Failed to save recording metadata.");
  }

  // Update consultation recording_status
  await svc
    .from("consultations")
    .update({ recording_status: "processing" })
    .eq("id", consultationId);

  // Trigger transcription pipeline asynchronously
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  fetch(`${supabaseUrl}/functions/v1/transcription-pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recordingId: recording.id,
      consultationId,
      storagePath,
    }),
  }).catch((e) => console.error("Transcription trigger failed:", e));

  return created(recording);
});

// ── GET /v1/recordings/:id ───────────────────────────────────

router.get("/v1/recordings/:id", async (req, { id }) => {
  const { svc } = await requireAuth(req);

  const { data, error: dbErr } = await svc
    .from("recordings")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (dbErr || !data) return Errors.notFound("Recording");
  return ok(data);
});

// ── GET /v1/recordings/:id/signed-url ────────────────────────

router.get("/v1/recordings/:id/signed-url", async (req, { id }) => {
  const { svc } = await requireAuth(req);

  const { data: recording } = await svc
    .from("recordings")
    .select("storage_path, status")
    .eq("id", id)
    .single();

  if (!recording) return Errors.notFound("Recording");
  if (recording.status !== "available") {
    return Errors.processing("Recording is still being processed.");
  }

  const expiresIn = 3600; // 1 hour
  const { data: signedUrl, error: signErr } = await svc.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, expiresIn);

  if (signErr || !signedUrl) return Errors.internal("Failed to generate signed URL.");

  return ok({ url: signedUrl.signedUrl, expiresIn });
});

// ── DELETE /v1/recordings/:id ────────────────────────────────

router.delete("/v1/recordings/:id", async (req, { id }) => {
  const { profile, svc } = await requireAuth(req);

  const { data: recording } = await svc
    .from("recordings")
    .select("storage_path, consultant_id")
    .eq("id", id)
    .single();

  if (!recording) return Errors.notFound("Recording");

  if (profile.role !== "admin" && recording.consultant_id !== profile.id) {
    return Errors.forbidden();
  }

  // Soft-delete DB record
  await svc
    .from("recordings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  // Remove from storage
  await svc.storage.from("recordings").remove([recording.storage_path]);

  return noContent();
});

// ── GET /v1/recordings/:id/transcript ────────────────────────

router.get("/v1/recordings/:id/transcript", async (req, { id }) => {
  const { svc } = await requireAuth(req);

  const { data, error: dbErr } = await svc
    .from("transcripts")
    .select("id, consultation_id, content, language, word_count, generated_at")
    .eq("recording_id", id)
    .single();

  if (dbErr || !data) return Errors.notFound("Transcript");

  return ok({
    consultationId: data.consultation_id,
    lines: data.content,
    wordCount: data.word_count,
    generatedAt: data.generated_at,
    language: data.language,
  });
});

Deno.serve((req) => router.dispatch(req));
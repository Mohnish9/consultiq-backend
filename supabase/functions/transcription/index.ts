// supabase/functions/transcription-pipeline/index.ts
// Handles audio → transcript conversion then triggers ai-pipeline

import { getServiceClient, corsHeaders } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const svc = getServiceClient();

  const { recordingId, consultationId, storagePath } = await req.json();

  console.log(`[Transcription] Starting: recording=${recordingId}`);

  try {
    // Simulate or perform transcription (Whisper via ai-pipeline)
    // Mark recording as available first
    await svc
      .from("recordings")
      .update({ status: "available", updated_at: new Date().toISOString() })
      .eq("id", recordingId);

    // Now trigger the full AI pipeline (transcription + summary)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const res = await fetch(`${supabaseUrl}/functions/v1/ai-pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consultationId }),
    });

    if (!res.ok) {
      console.error("[Transcription] ai-pipeline failed:", await res.text());
      await svc
        .from("recordings")
        .update({ status: "error" })
        .eq("id", recordingId);
    }

    // Notify consultant
    const { data: consult } = await svc
      .from("consultations")
      .select("consultant_id")
      .eq("id", consultationId)
      .single();

    if (consult) {
      await svc.from("notifications").insert({
        user_id: consult.consultant_id,
        type: "recording.transcriptReady",
        payload: { recordingId, consultationId },
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error("[Transcription] Error:", e);
    await svc
      .from("recordings")
      .update({ status: "error" })
      .eq("id", recordingId)
      .catch(() => {});

    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});

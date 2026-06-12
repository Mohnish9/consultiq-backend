// supabase/functions/ai-pipeline/index.ts
// Invoked internally after a recording is uploaded.
// 1. Fetches audio from storage
// 2. Sends to Whisper API for transcription
// 3. Sends transcript to GPT-4o for summary
// 4. Stores results and updates consultation status

import { getServiceClient, corsHeaders } from "../_shared/utils.ts";

interface PipelinePayload {
  consultationId: string;
  triggeredBy?: string;
}

async function generateTranscript(
  svc: ReturnType<typeof getServiceClient>,
  consultationId: string
): Promise<{ recordingId: string | null; lines: Array<{ ts: string; speaker: string; text: string }>; wordCount: number } | null> {
  // Get the recording for this consultation
  const { data: recording } = await svc
    .from("recordings")
    .select("id, storage_path, file_type")
    .eq("consultation_id", consultationId)
    .eq("status", "available")
    .single();

  if (!recording) {
    // Use transcript if already exists (manual trigger)
    const { data: existing } = await svc
      .from("transcripts")
      .select("content, word_count")
      .eq("consultation_id", consultationId)
      .single();
    if (existing) return { recordingId: null, lines: existing.content, wordCount: existing.word_count ?? 0 };
    return null;
  }

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    console.warn("OPENAI_API_KEY not set — using mock transcript");
    // Return mock for local dev
    return {
      recordingId: recording.id,
      lines: [
        { ts: "00:00", speaker: "Consultant", text: "Good morning. How are you feeling today?" },
        { ts: "00:08", speaker: "Patient", text: "A bit better, thank you. The exercises have been helping." },
        { ts: "00:18", speaker: "Consultant", text: "That's great to hear. Let's review your progress." },
      ],
      wordCount: 30,
    };
  }

  // Download the recording as a blob
  const { data: fileData, error: dlErr } = await svc.storage
    .from("recordings")
    .download(recording.storage_path);

  if (dlErr || !fileData) {
    console.error("Failed to download recording:", dlErr);
    return null;
  }

  // Call Whisper
  const formData = new FormData();
  formData.append("file", fileData, recording.storage_path.split("/").pop());
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "segment");

  const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}` },
    body: formData,
  });

  if (!whisperRes.ok) {
    console.error("Whisper error:", await whisperRes.text());
    return null;
  }

  const whisperData = await whisperRes.json();

  // Convert Whisper segments → our TranscriptLine format
  const lines = (whisperData.segments ?? []).map((seg: { start: number; text: string }) => ({
    ts: new Date(seg.start * 1000).toISOString().substring(14, 19), // MM:SS
    speaker: "Unknown",
    text: seg.text.trim(),
  }));

  const wordCount = whisperData.text?.split(/\s+/).length ?? 0;

  return { recordingId: recording.id, lines, wordCount };
}

async function generateAISummary(
  transcript: Array<{ ts: string; speaker: string; text: string }>,
  consultationType: string
): Promise<{
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  keywords: string[];
  sentiment: "positive" | "neutral" | "negative";
  riskLevel: "low" | "medium" | "high";
  followUpDate: string | null;
  confidenceScore: number;
} | null> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiKey) {
    // Mock for local dev
    return {
      summary: "The patient reported improvement in symptoms following the prescribed exercises. The consultant reviewed progress and adjusted recommendations.",
      keyTakeaways: [
        "Patient showing positive response to treatment",
        "Exercise routine to continue for 2 more weeks",
        "Follow-up scheduled in 14 days",
      ],
      actionItems: [
        "Continue daily stretching exercises",
        "Schedule follow-up appointment",
        "Track mood in journal",
      ],
      keywords: ["progress", "exercises", "improvement", "follow-up"],
      sentiment: "positive",
      riskLevel: "low",
      followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      confidenceScore: 0.92,
    };
  }

  const transcriptText = transcript
    .map((l) => `[${l.ts}] ${l.speaker}: ${l.text}`)
    .join("\n");

  const prompt = `You are a medical/clinical AI assistant. Analyze the following ${consultationType} consultation transcript and return a JSON object.

TRANSCRIPT:
${transcriptText}

Return ONLY valid JSON (no markdown) with this exact shape:
{
  "summary": "2-3 sentence overall summary",
  "keyTakeaways": ["string", ...],
  "actionItems": ["string", ...],
  "keywords": ["string", ...],
  "sentiment": "positive" | "neutral" | "negative",
  "riskLevel": "low" | "medium" | "high",
  "followUpDate": "YYYY-MM-DD" | null,
  "confidenceScore": 0.0 to 1.0
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    console.error("GPT-4o error:", await res.text());
    return null;
  }

  const gptData = await res.json();
  const content = gptData.choices?.[0]?.message?.content ?? "";

  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse GPT response:", e, content);
    return null;
  }
}

async function generateRecommendations(
  svc: ReturnType<typeof getServiceClient>,
  consultationId: string,
  patientId: string,
  aiSummaryId: string,
  actionItems: string[]
) {
  const recommendations = actionItems.map((item) => {
    // Classify based on keywords
    let category: string = "Tasks";
    const lower = item.toLowerCase();
    if (lower.includes("exercise") || lower.includes("stretch") || lower.includes("walk")) {
      category = "Exercises";
    } else if (lower.includes("diet") || lower.includes("sleep") || lower.includes("stress")) {
      category = "Lifestyle";
    } else if (lower.includes("medication") || lower.includes("medicine") || lower.includes("dose")) {
      category = "Medication";
    } else if (lower.includes("follow") || lower.includes("appointment") || lower.includes("schedule")) {
      category = "Follow-up";
    }

    return {
      patient_id: patientId,
      consultation_id: consultationId,
      ai_summary_id: aiSummaryId,
      category,
      description: item,
      priority: "Medium",
      completed: false,
    };
  });

  if (recommendations.length > 0) {
    await svc.from("recommendations").insert(recommendations);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const svc = getServiceClient();

  let payload: PipelinePayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { consultationId } = payload;
  if (!consultationId) {
    return new Response(JSON.stringify({ error: "consultationId required" }), { status: 400 });
  }

  console.log(`[AI Pipeline] Starting for consultation ${consultationId}`);

  try {
    // 1. Fetch consultation
    const { data: consult, error: consultErr } = await svc
      .from("consultations")
      .select("id, patient_id, consultant_id, type")
      .eq("id", consultationId)
      .single();

    if (consultErr || !consult) {
      console.error("Consultation not found:", consultErr);
      return new Response(JSON.stringify({ error: "Consultation not found" }), { status: 404 });
    }

    // 2. Generate transcript
    const transcriptResult = await generateTranscript(svc, consultationId);

    if (!transcriptResult) {
      await svc
        .from("consultations")
        .update({ ai_status: "failed" })
        .eq("id", consultationId);
      return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 500 });
    }

    // 3. Upsert transcript
    const { data: transcriptRow } = await svc
      .from("transcripts")
      .upsert(
        {
          consultation_id: consultationId,
          recording_id: transcriptResult.recordingId,
          content: transcriptResult.lines,
          word_count: transcriptResult.wordCount,
          language: "en",
          model: "whisper-1",
        },
        { onConflict: "consultation_id" }
      )
      .select()
      .single();

    // Update recording status
    await svc
      .from("consultations")
      .update({ recording_status: "uploaded", status: "processing" })
      .eq("id", consultationId);

    // 4. Generate AI summary
    const summaryResult = await generateAISummary(
      transcriptResult.lines,
      consult.type ?? "General"
    );

    if (!summaryResult) {
      await svc
        .from("consultations")
        .update({ ai_status: "failed" })
        .eq("id", consultationId);
      return new Response(JSON.stringify({ error: "Summary generation failed" }), { status: 500 });
    }

    // 5. Upsert AI summary
    const { data: summaryRow } = await svc
      .from("ai_summaries")
      .upsert(
        {
          consultation_id: consultationId,
          patient_id: consult.patient_id,
          consultant_id: consult.consultant_id,
          summary: summaryResult.summary,
          key_takeaways: summaryResult.keyTakeaways,
          action_items: summaryResult.actionItems,
          keywords: summaryResult.keywords,
          sentiment: summaryResult.sentiment,
          risk_level: summaryResult.riskLevel,
          follow_up_date: summaryResult.followUpDate,
          confidence_score: summaryResult.confidenceScore,
          model: "gpt-4o",
        },
        { onConflict: "consultation_id" }
      )
      .select()
      .single();

    // 6. Generate recommendations from action items
    if (summaryRow) {
      await generateRecommendations(
        svc,
        consultationId,
        consult.patient_id,
        summaryRow.id,
        summaryResult.actionItems
      );
    }

    // 7. Mark consultation as complete
    await svc
      .from("consultations")
      .update({ ai_status: "ready", status: "completed" })
      .eq("id", consultationId);

    // 8. Create notification for consultant and patient
    await svc.from("notifications").insert([
      {
        user_id: consult.consultant_id,
        type: "consultation.aiStatus",
        payload: { consultationId, aiStatus: "ready" },
      },
      {
        user_id: consult.patient_id,
        type: "consultation.aiStatus",
        payload: { consultationId, aiStatus: "ready" },
      },
    ]);

    console.log(`[AI Pipeline] Completed for consultation ${consultationId}`);

    return new Response(
      JSON.stringify({ success: true, consultationId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[AI Pipeline] Unexpected error:", e);

    await svc
      .from("consultations")
      .update({ ai_status: "failed" })
      .eq("id", consultationId);

    return new Response(
      JSON.stringify({ error: "Pipeline failed", details: String(e) }),
      { status: 500 }
    );
  }
});
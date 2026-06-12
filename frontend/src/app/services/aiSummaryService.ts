import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import type { AISummary } from "../types/consultation";

const MOCK_SUMMARIES: AISummary[] = [
  {
    id: "C-1048",
    patient: "Priya Mehta",
    consultant: "Dr. Arjun Rajan",
    type: "Therapy",
    date: "Jun 11, 2026",
    duration: "52 min",
    sentiment: "positive",
    riskLevel: "low",
    followUpDate: "Jun 25, 2026",
    summary: "Patient reported significant improvement with breathing exercises (~40% reduction in panic episodes). Primary stressors are workplace deadline pressure and disrupted sleep patterns linked to evening screen exposure. Social anxiety in team meetings identified as new focus area.",
    keyTakeaways: ["Stress at 4–5 PM deadline pressure", "Sleep disrupted — waking 3 AM (cortisol)", "Blue light suppressing melatonin", "CBT reframing introduced for meetings"],
    actionItems: ["Sleep before 11 PM, no screens 60 min prior", "Daily 10-min mindfulness", "PMR exercise nightly", "Follow-up in 14 days"],
    keywords: ["anxiety", "stress", "sleep hygiene", "CBT", "PMR", "mindfulness"],
  },
  {
    id: "C-1047",
    patient: "Rohit Verma",
    consultant: "Dr. Sunita Patel",
    type: "Medical",
    date: "Jun 11, 2026",
    duration: "38 min",
    sentiment: "neutral",
    riskLevel: "medium",
    followUpDate: "Jun 18, 2026",
    summary: "Patient presented with recurring headaches and mild hypertension (BP: 138/88). Sedentary lifestyle and high sodium diet identified as primary contributors. Referred for blood panel and cardiology consultation.",
    keyTakeaways: ["Hypertension at borderline level (138/88 mmHg)", "Sodium intake elevated", "No medications — lifestyle first", "Cardiology referral issued"],
    actionItems: ["Reduce sodium — max 2g/day", "30-min walk daily for 4 weeks", "Blood panel by Jun 14", "Re-check BP in 7 days"],
    keywords: ["hypertension", "headache", "sodium", "blood pressure", "cardiology"],
  },
  {
    id: "C-1046",
    patient: "Anita Singh",
    consultant: "Dr. Karan Mehta",
    type: "Advisory",
    date: "Jun 10, 2026",
    duration: "65 min",
    sentiment: "positive",
    riskLevel: "low",
    followUpDate: "Jul 10, 2026",
    summary: "Session focused on career transition anxiety following a role change. Strong self-awareness demonstrated. Identified imposter syndrome and peer validation concerns. Built a 90-day confidence roadmap.",
    keyTakeaways: ["Imposter syndrome in new role", "Confidence gap, not competence gap", "Peer comparison drives anxiety", "90-day roadmap created"],
    actionItems: ["Track 3 daily wins for 30 days", "Reduce social media comparison", "Weekly accountability check-in", "Read The First 90 Days Ch. 3–5"],
    keywords: ["career", "imposter syndrome", "confidence", "transition", "roadmap"],
  },
];

export async function getAISummaries(): Promise<AISummary[]> {
  if (!env.IS_MOCK) {
    const response = await apiClient.get<{ data: AISummary[] }>(API_ENDPOINTS.AI_SUMMARIES.LIST);
    return response.data;
  }
  await new Promise(r => setTimeout(r, 300));
  return MOCK_SUMMARIES;
}

export async function getAISummaryById(id: string): Promise<AISummary | null> {
  if (!env.IS_MOCK) {
    return apiClient.get<AISummary>(API_ENDPOINTS.AI_SUMMARIES.DETAIL(id));
  }
  await new Promise(r => setTimeout(r, 150));
  return MOCK_SUMMARIES.find(s => s.id === id) ?? null;
}

export async function generateSummary(consultationId: string): Promise<AISummary> {
  if (!env.IS_MOCK) {
    return apiClient.post<AISummary>(API_ENDPOINTS.AI_SUMMARIES.GENERATE(consultationId));
  }
  await new Promise(r => setTimeout(r, 3000));
  return MOCK_SUMMARIES[0];
}

export type ConsultationStatus = "completed" | "processing" | "pending";
export type AIStatus = "ready" | "processing" | "pending" | "failed";
export type RecordingStatus = "uploaded" | "processing" | "none";
export type RiskLevel = "low" | "medium" | "high";
export type SentimentLabel = "positive" | "neutral" | "negative";
export type ConsultationType = "Therapy" | "Medical" | "Advisory" | "Astrology" | "Legal" | "Financial";

export interface Consultation {
  id: string;
  patient: string;
  consultant: string;
  date: string;
  lastUpdated: string;
  duration: string;
  type: ConsultationType | string;
  status: ConsultationStatus;
  aiStatus: AIStatus;
  recordingStatus: RecordingStatus;
  createdBy: string;
  notes?: string;
}

export interface TranscriptLine {
  ts: string;
  speaker: "Consultant" | "Patient";
  text: string;
}

export interface AISummary {
  id: string;
  patient: string;
  consultant: string;
  type: string;
  date: string;
  duration: string;
  sentiment: SentimentLabel;
  riskLevel: RiskLevel;
  followUpDate: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  keywords: string[];
}

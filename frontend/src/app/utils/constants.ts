export const APP_NAME = "ConsultIQ";
export const APP_TAGLINE = "AI-Powered Consultation Platform";
export const APP_VERSION = "1.0.0";

export const CONSULTATION_TYPES = [
  "Medical Consultation",
  "Therapy Session",
  "Advisory Meeting",
  "Astrological Reading",
  "Legal Consultation",
  "Financial Advisory",
] as const;

export const CONSULTANTS = [
  "Dr. Arjun Rajan",
  "Dr. Sunita Patel",
  "Dr. Karan Mehta",
  "Dr. Riya Sharma",
  "Prof. Anand Kumar",
] as const;

export const MAX_UPLOAD_SIZE_MB = 500;
export const SUPPORTED_AUDIO_TYPES = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"];
export const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/mov", "video/avi"];

export const STATUS_LABELS = {
  completed: "Completed",
  processing: "Processing",
  pending: "Pending",
} as const;

export const AI_STATUS_LABELS = {
  ready: "Ready",
  processing: "Processing",
  pending: "Pending",
  failed: "Failed",
} as const;

export const RECORDING_STATUS_LABELS = {
  uploaded: "Uploaded",
  processing: "Processing",
  none: "None",
} as const;

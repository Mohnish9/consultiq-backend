export const AUTH_ROUTES = {
  LOGIN: "login",
} as const;

export const CONSULTANT_ROUTES = {
  DASHBOARD: "dashboard",
  UPLOAD: "upload",
  CONSULTATIONS: "consultations",
  DETAIL: "detail",
  ANALYTICS: "analytics",
  AI_INSIGHTS: "ai-insights",
  TRANSCRIPT: "transcript",
  SETTINGS: "settings",
} as const;

export const PATIENT_ROUTES = {
  DASHBOARD: "p-dashboard",
  CONSULTATIONS: "p-consultations",
  DETAIL: "p-detail",
  RECORDINGS: "p-recordings",
  TRANSCRIPT: "p-transcript",
  SUMMARIES: "p-summaries",
  RECOMMENDATIONS: "p-recommendations",
  APPOINTMENTS: "p-appointments",
  PROFILE: "p-profile",
} as const;

export type ConsultantRoute = (typeof CONSULTANT_ROUTES)[keyof typeof CONSULTANT_ROUTES];
export type PatientRoute = (typeof PATIENT_ROUTES)[keyof typeof PATIENT_ROUTES];

export const API_ENDPOINTS = {
  AUTH: {
  LOGIN: "/auth/v1/login",
  SIGNUP: "/auth/v1/signup",
  LOGOUT: "/auth/v1/logout",
  REFRESH: "/auth/v1/refresh",
  ME: "/auth/v1/me",
},
  CONSULTATIONS: {
    LIST: "/consultations",
    DETAIL: (id: string) => `/consultations/${id}`,
    CREATE: "/consultations",
    UPDATE: (id: string) => `/consultations/${id}`,
    DELETE: (id: string) => `/consultations/${id}`,
  },
  PATIENTS: {
    LIST: "/patients",
    DETAIL: (id: string) => `/patients/${id}`,
    PROFILE: "/patients/me",
    UPDATE_PROFILE: "/patients/me",
  },
  RECORDINGS: {
    LIST: "/recordings",
    DETAIL: (id: string) => `/recordings/${id}`,
    UPLOAD: "/recordings/upload",
    DELETE: (id: string) => `/recordings/${id}`,
    BY_CONSULTATION: (consultationId: string) => `/consultations/${consultationId}/recordings`,
  },
  TRANSCRIPTS: {
    BY_CONSULTATION: (consultationId: string) => `/consultations/${consultationId}/transcript`,
    BY_RECORDING: (recordingId: string) => `/recordings/${recordingId}/transcript`,
  },
  AI_SUMMARIES: {
    LIST: "/ai-summaries",
    DETAIL: (id: string) => `/ai-summaries/${id}`,
    GENERATE: (consultationId: string) => `/consultations/${consultationId}/ai-summary`,
    BY_CONSULTATION: (consultationId: string) => `/consultations/${consultationId}/ai-summary`,
  },
  ANALYTICS: {
    SUMMARY: "/analytics/summary",
    MONTHLY_TREND: "/analytics/monthly-trend",
    CONSULTANT_ACTIVITY: "/analytics/consultant-activity",
    TYPE_DISTRIBUTION: "/analytics/type-distribution",
  },
  APPOINTMENTS: {
    LIST: "/appointments",
    DETAIL: (id: string) => `/appointments/${id}`,
    CREATE: "/appointments",
    UPDATE: (id: string) => `/appointments/${id}`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
  },
} as const;

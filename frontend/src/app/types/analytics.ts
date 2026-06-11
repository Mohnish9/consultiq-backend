export interface MonthlyTrendPoint {
  month: string;
  sessions: number;
  recordings: number;
}

export interface ConsultantActivityPoint {
  name: string;
  sessions: number;
}

export interface TypeDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  avgDurationMinutes: number;
  activeConsultants: number;
  storageUsedGB: number;
  storageTotalGB: number;
  completionRatePct: number;
}

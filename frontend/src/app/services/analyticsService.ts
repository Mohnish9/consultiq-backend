import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import type { MonthlyTrendPoint, ConsultantActivityPoint, TypeDistributionPoint, AnalyticsSummary } from "../types/analytics";

const MOCK_SUMMARY: AnalyticsSummary = {
  totalSessions: 156,
  avgDurationMinutes: 48,
  activeConsultants: 8,
  storageUsedGB: 46,
  storageTotalGB: 100,
  completionRatePct: 78,
};

const MOCK_MONTHLY_TREND: MonthlyTrendPoint[] = [
  { month: "Jan", sessions: 18, recordings: 14 },
  { month: "Feb", sessions: 24, recordings: 19 },
  { month: "Mar", sessions: 21, recordings: 16 },
  { month: "Apr", sessions: 28, recordings: 22 },
  { month: "May", sessions: 34, recordings: 26 },
  { month: "Jun", sessions: 31, recordings: 24 },
];

const MOCK_CONSULTANT_ACTIVITY: ConsultantActivityPoint[] = [
  { name: "Dr. Arjun Rajan", sessions: 38 },
  { name: "Dr. Sunita Patel", sessions: 29 },
  { name: "Dr. Karan Mehta", sessions: 22 },
  { name: "Dr. Riya Sharma", sessions: 18 },
  { name: "Dr. Neha Iyer", sessions: 12 },
  { name: "Prof. Anand Kumar", sessions: 9 },
];

const MOCK_TYPE_DISTRIBUTION: TypeDistributionPoint[] = [
  { name: "Therapy", value: 41, color: "#4f46e5" },
  { name: "Medical", value: 31, color: "#06b6d4" },
  { name: "Advisory", value: 17, color: "#10b981" },
  { name: "Astrology", value: 11, color: "#f59e0b" },
];

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!env.IS_MOCK) {
    return apiClient.get<AnalyticsSummary>(API_ENDPOINTS.ANALYTICS.SUMMARY);
  }
  await new Promise(r => setTimeout(r, 300));
  return MOCK_SUMMARY;
}

export async function getMonthlyTrend(): Promise<MonthlyTrendPoint[]> {
  if (!env.IS_MOCK) {
    return apiClient.get<MonthlyTrendPoint[]>(API_ENDPOINTS.ANALYTICS.MONTHLY_TREND);
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_MONTHLY_TREND;
}

export async function getConsultantActivity(): Promise<ConsultantActivityPoint[]> {
  if (!env.IS_MOCK) {
    return apiClient.get<ConsultantActivityPoint[]>(API_ENDPOINTS.ANALYTICS.CONSULTANT_ACTIVITY);
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_CONSULTANT_ACTIVITY;
}

export async function getTypeDistribution(): Promise<TypeDistributionPoint[]> {
  if (!env.IS_MOCK) {
    return apiClient.get<TypeDistributionPoint[]>(API_ENDPOINTS.ANALYTICS.TYPE_DISTRIBUTION);
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_TYPE_DISTRIBUTION;
}

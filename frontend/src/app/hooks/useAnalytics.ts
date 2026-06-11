import { useState, useEffect, useCallback } from "react";
import {
  getAnalyticsSummary,
  getMonthlyTrend,
  getConsultantActivity,
  getTypeDistribution,
} from "../services/analyticsService";
import type { MonthlyTrendPoint, ConsultantActivityPoint, TypeDistributionPoint, AnalyticsSummary } from "../types/analytics";

interface UseAnalyticsReturn {
  summary: AnalyticsSummary | null;
  monthlyTrend: MonthlyTrendPoint[];
  consultantActivity: ConsultantActivityPoint[];
  typeDistribution: TypeDistributionPoint[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>([]);
  const [consultantActivity, setConsultantActivity] = useState<ConsultantActivityPoint[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistributionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [s, mt, ca, td] = await Promise.all([
        getAnalyticsSummary(),
        getMonthlyTrend(),
        getConsultantActivity(),
        getTypeDistribution(),
      ]);
      setSummary(s);
      setMonthlyTrend(mt);
      setConsultantActivity(ca);
      setTypeDistribution(td);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return {
    summary,
    monthlyTrend,
    consultantActivity,
    typeDistribution,
    isLoading,
    isError,
    refetch: fetch,
  };
}

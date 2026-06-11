import { useState, useMemo, useCallback, useEffect } from "react";
import { getConsultations, deleteConsultation as deleteConsultationService } from "../services/consultationService";
import type { Consultation } from "../types/consultation";

interface UseConsultationsReturn {
  consultations: Consultation[];
  filtered: Consultation[];
  search: string;
  statusFilter: string;
  typeFilter: string;
  isLoading: boolean;
  isError: boolean;
  setSearch: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  deleteConsultation: (id: string) => void;
  totalCount: number;
  refetch: () => void;
}

export function useConsultations(): UseConsultationsReturn {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getConsultations();
      setConsultations(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return consultations.filter(c => {
      const matchQ = !q || c.patient.toLowerCase().includes(q) || c.consultant.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || c.status === statusFilter;
      const matchT = typeFilter === "all" || c.type === typeFilter;
      return matchQ && matchS && matchT;
    });
  }, [consultations, search, statusFilter, typeFilter]);

  const deleteConsultation = useCallback(async (id: string) => {
    setConsultations(prev => prev.filter(c => c.id !== id));
    try {
      await deleteConsultationService(id);
    } catch {
      fetch();
    }
  }, [fetch]);

  return {
    consultations,
    filtered,
    search,
    statusFilter,
    typeFilter,
    isLoading,
    isError,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    deleteConsultation,
    totalCount: consultations.length,
    refetch: fetch,
  };
}

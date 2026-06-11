import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import { MOCK_CONSULTATIONS } from "../utils/mockData";
import type { Consultation } from "../types/consultation";

export async function getConsultations(): Promise<Consultation[]> {
  if (!env.IS_MOCK) {
    return apiClient.get<Consultation[]>(API_ENDPOINTS.CONSULTATIONS.LIST);
  }
  await new Promise(r => setTimeout(r, 300));
  return MOCK_CONSULTATIONS;
}

export async function getConsultationById(id: string): Promise<Consultation | null> {
  if (!env.IS_MOCK) {
    return apiClient.get<Consultation>(API_ENDPOINTS.CONSULTATIONS.DETAIL(id));
  }
  await new Promise(r => setTimeout(r, 150));
  return MOCK_CONSULTATIONS.find(c => c.id === id) ?? null;
}

export async function createConsultation(
  data: Omit<Consultation, "id" | "lastUpdated" | "aiStatus" | "recordingStatus">,
): Promise<Consultation> {
  if (!env.IS_MOCK) {
    return apiClient.post<Consultation>(API_ENDPOINTS.CONSULTATIONS.CREATE, data);
  }
  await new Promise(r => setTimeout(r, 500));
  return {
    ...data,
    id: `C-${1049 + Math.floor(Math.random() * 100)}`,
    lastUpdated: new Date().toLocaleString(),
    aiStatus: "pending",
    recordingStatus: "uploaded",
  };
}

export async function updateConsultation(id: string, data: Partial<Consultation>): Promise<Consultation> {
  if (!env.IS_MOCK) {
    return apiClient.put<Consultation>(API_ENDPOINTS.CONSULTATIONS.UPDATE(id), data);
  }
  await new Promise(r => setTimeout(r, 300));
  const existing = MOCK_CONSULTATIONS.find(c => c.id === id);
  return { ...existing!, ...data };
}

export async function deleteConsultation(id: string): Promise<void> {
  if (!env.IS_MOCK) {
    return apiClient.delete(API_ENDPOINTS.CONSULTATIONS.DELETE(id));
  }
  await new Promise(r => setTimeout(r, 200));
}

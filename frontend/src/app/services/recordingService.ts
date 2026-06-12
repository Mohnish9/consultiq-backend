import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import { MOCK_RECORDINGS } from "../utils/mockData";
import type { Recording } from "../types/recording";

export async function getRecordings(patientId?: string): Promise<Recording[]> {
  if (!env.IS_MOCK) {
    const path = patientId
      ? `${API_ENDPOINTS.RECORDINGS.LIST}?patientId=${patientId}`
      : API_ENDPOINTS.RECORDINGS.LIST;
    const response = await apiClient.get<{ data: Recording[] }>(path);
    return response.data;
  }
  await new Promise(r => setTimeout(r, 300));
  return MOCK_RECORDINGS;
}

export async function getRecordingById(id: string): Promise<Recording | null> {
  if (!env.IS_MOCK) {
    return apiClient.get<Recording>(API_ENDPOINTS.RECORDINGS.DETAIL(id));
  }
  await new Promise(r => setTimeout(r, 150));
  return MOCK_RECORDINGS.find(r => r.id === id) ?? null;
}

export async function uploadRecording(file: File, consultationId: string): Promise<Recording> {
  if (!env.IS_MOCK) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("consultationId", consultationId);
    return apiClient.upload<Recording>(API_ENDPOINTS.RECORDINGS.UPLOAD, formData);
  }
  await new Promise(r => setTimeout(r, 2000));
  return {
    id: `R-${Date.now()}`,
    name: file.name,
    patient: "Unknown",
    consultant: "Unknown",
    date: new Date().toLocaleDateString(),
    duration: "Unknown",
    fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    fileType: file.type.startsWith("audio") ? "audio" : "video",
    status: "available",
    consultationId,
  };
}

export async function deleteRecording(id: string): Promise<void> {
  if (!env.IS_MOCK) {
    return apiClient.delete(API_ENDPOINTS.RECORDINGS.DELETE(id));
  }
  await new Promise(r => setTimeout(r, 200));
}

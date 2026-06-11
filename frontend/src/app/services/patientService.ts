import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import type { Patient } from "../types/patient";

const MOCK_PATIENT: Patient = {
  id: "P-001",
  name: "Priya Mehta",
  email: "priya.mehta@email.com",
  phone: "+91 98765 43210",
  dateOfBirth: "1992-03-14",
  gender: "Female",
  bloodGroup: "B+",
  allergies: "Penicillin",
  address: "42, Lotus Colony",
  city: "Mumbai",
  state: "Maharashtra",
  emergencyContact: {
    name: "Ravi Mehta",
    relationship: "Spouse",
    phone: "+91 98765 43211",
  },
};

export async function getPatientProfile(): Promise<Patient> {
  if (!env.IS_MOCK) {
    return apiClient.get<Patient>(API_ENDPOINTS.PATIENTS.PROFILE);
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_PATIENT;
}

export async function updatePatientProfile(data: Partial<Patient>): Promise<Patient> {
  if (!env.IS_MOCK) {
    return apiClient.put<Patient>(API_ENDPOINTS.PATIENTS.UPDATE_PROFILE, data);
  }
  await new Promise(r => setTimeout(r, 400));
  return { ...MOCK_PATIENT, ...data };
}

export async function getPatientById(id: string): Promise<Patient | null> {
  if (!env.IS_MOCK) {
    return apiClient.get<Patient>(API_ENDPOINTS.PATIENTS.DETAIL(id));
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_PATIENT;
}

import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

export interface Appointment {
  id: string;
  patient_id: string;
  consultant_id: string;
  consultation_id?: string | null;
  scheduled_at: string;
  duration_minutes: number;
  type?: string | null;
  mode: "Video" | "In-Person" | "Phone";
  status: "upcoming" | "past" | "cancelled";
  cancel_reason?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

interface AppointmentListResponse {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

export async function createAppointment(
  patientId: string,
  scheduledAt: string,
  options: {
    durationMinutes?: number;
    type?: string;
    mode?: Appointment["mode"];
    notes?: string;
  } = {}
) {
  return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, {
    patientId,
    scheduledAt,
    ...options,
  });
}

export async function getAppointmentsForPatient(patientId: string) {
  const params = new URLSearchParams({ patientId });
  const response = await apiClient.get<AppointmentListResponse>(
    `${API_ENDPOINTS.APPOINTMENTS.LIST}?${params.toString()}`
  );

  return response.data;
}

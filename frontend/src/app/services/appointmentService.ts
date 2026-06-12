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
  patients?: { id: string; users?: { name: string; email: string; avatar_initials?: string | null } };
  consultants?: { id: string; users?: { name: string; email: string; avatar_initials?: string | null } };
}

interface AppointmentListResponse {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

function listPath(params: Record<string, string | undefined> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `${API_ENDPOINTS.APPOINTMENTS.LIST}?${qs}` : API_ENDPOINTS.APPOINTMENTS.LIST;
}

export async function listAppointments(params: { status?: Appointment["status"]; patientId?: string; consultantId?: string } = {}) {
  const response = await apiClient.get<AppointmentListResponse>(listPath(params));
  return response.data;
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

export async function updateAppointment(
  id: string,
  data: Partial<Pick<Appointment, "scheduled_at" | "duration_minutes" | "type" | "mode" | "notes" | "status">>
) {
  return apiClient.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), data);
}

export async function cancelAppointment(id: string, reason?: string) {
  return apiClient.post<{ status: string; cancelReason?: string | null }>(
    API_ENDPOINTS.APPOINTMENTS.CANCEL(id),
    { reason }
  );
}

export async function getAppointmentsForPatient(patientId?: string) {
  return listAppointments(patientId ? { patientId } : {});
}

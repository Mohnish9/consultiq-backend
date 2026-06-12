import { supabase } from "./supabase";

export async function createAppointment(
  patientId: string,
  consultantId: string,
  scheduledAt: string
) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: patientId,
      consultant_id: consultantId,
      scheduled_at: scheduledAt,
      status: "upcoming",
    })
    .select();

  if (error) throw error;

  return data;
}

export async function getAppointmentsForPatient(
  patientId: string
) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;

  return data;
}
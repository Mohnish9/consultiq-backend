import { useEffect, useMemo, useState } from "react";
import {
  Appointment,
  cancelAppointment,
  createAppointment,
  listAppointments,
  updateAppointment,
} from "../../services/appointmentService";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function ConsultantAppointments() {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Follow-up Consultation");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const upcoming = useMemo(
    () => appointments.filter((appointment) => appointment.status === "upcoming"),
    [appointments]
  );
  const past = useMemo(
    () => appointments.filter((appointment) => appointment.status !== "upcoming"),
    [appointments]
  );

  async function refreshAppointments() {
    setIsLoading(true);
    try {
      setAppointments(await listAppointments());
    } catch (err: any) {
      setError(err?.message ?? "Failed to load appointments.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshAppointments();
  }, []);

  const handleCreate = async () => {
    setMessage(null);
    setError(null);

    if (!patientId.trim() || !date || !time) {
      setError("Patient ID, date, and time are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const appointment = await createAppointment(patientId.trim(), `${date}T${time}:00`, {
        durationMinutes,
        type,
      });

      setMessage(`Appointment created for ${formatDate(appointment.scheduled_at)}.`);
      setPatientId("");
      setDate("");
      setTime("");
      await refreshAppointments();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    setError(null);
    setMessage(null);
    try {
      await cancelAppointment(id, "Cancelled by consultant");
      setMessage("Appointment cancelled.");
      await refreshAppointments();
    } catch (err: any) {
      setError(err?.message ?? "Failed to cancel appointment.");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) return;
    setError(null);
    setMessage(null);
    try {
      await updateAppointment(rescheduleId, { scheduled_at: `${rescheduleDate}T${rescheduleTime}:00` });
      setMessage("Appointment rescheduled.");
      setRescheduleId(null);
      setRescheduleDate("");
      setRescheduleTime("");
      await refreshAppointments();
    } catch (err: any) {
      setError(err?.message ?? "Failed to reschedule appointment.");
    }
  };

  const renderAppointment = (appointment: Appointment) => {
    const patientName = appointment.patients?.users?.name ?? appointment.patient_id;
    return (
      <div key={appointment.id} className="rounded-xl border border-border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{patientName}</p>
            <p className="text-xs text-muted-foreground">{appointment.type ?? "Appointment"} · {appointment.mode} · {appointment.duration_minutes} min</p>
            <p className="mt-1 text-sm text-foreground">{formatDate(appointment.scheduled_at)}</p>
            <p className="text-xs capitalize text-muted-foreground">Status: {appointment.status}</p>
          </div>
          {appointment.status === "upcoming" && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRescheduleId(appointment.id);
                  setRescheduleDate(appointment.scheduled_at.slice(0, 10));
                  setRescheduleTime(appointment.scheduled_at.slice(11, 16));
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                Reschedule
              </button>
              <button
                onClick={() => handleCancel(appointment.id)}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {rescheduleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-xl border border-border bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Reschedule appointment</h2>
            <div className="space-y-3">
              <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full rounded border p-2 text-sm" />
              <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full rounded border p-2 text-sm" />
              <div className="flex gap-2">
                <button onClick={() => setRescheduleId(null)} className="flex-1 rounded border p-2 text-sm">Close</button>
                <button onClick={handleReschedule} className="flex-1 rounded bg-violet-600 p-2 text-sm text-white">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-5">
        <h1 className="mb-4 text-xl font-semibold">Create Appointment</h1>
        {message && <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="grid gap-3 md:grid-cols-5">
          <input type="text" placeholder="Patient public profile ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="rounded border p-2 text-sm md:col-span-2" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded border p-2 text-sm" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded border p-2 text-sm" />
          <input type="number" min={15} step={15} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} className="rounded border p-2 text-sm" />
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="rounded border p-2 text-sm md:col-span-4" />
          <button onClick={handleCreate} disabled={isSubmitting} className="rounded bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Upcoming Appointments ({upcoming.length})</h2>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading appointments...</p> : upcoming.length ? <div className="space-y-3">{upcoming.map(renderAppointment)}</div> : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Past / Cancelled Appointments ({past.length})</h2>
        {past.length ? <div className="space-y-3">{past.map(renderAppointment)}</div> : <p className="text-sm text-muted-foreground">No past appointments.</p>}
      </div>
    </div>
  );
}

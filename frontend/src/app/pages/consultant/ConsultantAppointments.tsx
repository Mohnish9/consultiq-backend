import { useState } from "react";
import { createAppointment } from "../../services/appointmentService";

export default function ConsultantAppointments() {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setMessage(null);
    setError(null);

    if (!patientId.trim() || !date || !time) {
      setError("Patient ID, date, and time are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const appointment = await createAppointment(
        patientId.trim(),
        `${date}T${time}:00`
      );

      setMessage(`Appointment created for ${new Date(appointment.scheduled_at).toLocaleString()}.`);
      setPatientId("");
      setDate("");
      setTime("");
    } catch (err: any) {
      console.error("Failed to create appointment", err);
      setError(err?.message ?? "Failed to create appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Appointment</h1>

      <div className="space-y-4 max-w-md">
        {message && (
          <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Patient public profile ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Appointment"}
        </button>
      </div>
    </div>
  );
}

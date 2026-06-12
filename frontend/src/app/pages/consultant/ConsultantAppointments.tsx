import { useState } from "react";
import { createAppointment } from "../../services/appointmentService";
import { supabase } from "../../services/supabase";
export default function ConsultantAppointments() {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleCreate = async () => {
  try {
    const payload = {
      patient_id: patientId,
      consultant_id: "826d0a1a-756f-47fe-bcee-f33bec52a74a",
      scheduled_at: `${date}T${time}:00`,
      status: "upcoming",
    };

    console.log("PAYLOAD", payload);

    const result = await supabase
      .from("appointments")
      .insert(payload)
      .select();

    console.log("RESULT", result);

    if (result.error) {
      console.error("ERROR", result.error);
      alert(JSON.stringify(result.error, null, 2));
      return;
    }

    alert("Appointment Created");
  } catch (err) {
    console.error("CATCH ERROR", err);
  }
};
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Appointment
      </h1>

      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Patient ID"
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
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Create Appointment
        </button>
      </div>
    </div>
  );
}
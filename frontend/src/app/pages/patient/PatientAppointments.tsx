import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, RefreshCw, Video } from "lucide-react";
import { Appointment, listAppointments } from "../../services/appointmentService";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const upcoming = useMemo(
    () => appointments.filter((appointment) => appointment.status === "upcoming"),
    [appointments]
  );
  const past = useMemo(
    () => appointments.filter((appointment) => appointment.status !== "upcoming"),
    [appointments]
  );

  useEffect(() => {
    setIsLoading(true);
    listAppointments()
      .then(setAppointments)
      .catch((err: any) => setError(err?.message ?? "Failed to load appointments."))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = tab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-5 p-6">
      <div className="flex w-fit gap-1 rounded-lg bg-muted p-1">
        {(["upcoming", "past"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-md px-4 py-1.5 text-sm capitalize transition-all ${tab === item ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading appointments...</p>}

      {!isLoading && visible.length === 0 && (
        <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
          No {tab} appointments found.
        </div>
      )}

      <div className="grid gap-3">
        {visible.map((appointment) => {
          const consultantName = appointment.consultants?.users?.name ?? appointment.consultant_id;
          return (
            <div key={appointment.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{consultantName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.type ?? "Appointment"}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(appointment.scheduled_at)}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {appointment.duration_minutes} min</span>
                    <span className="flex items-center gap-1">{appointment.mode === "Video" ? <Video size={13} /> : <MapPin size={13} />} {appointment.mode}</span>
                    <span className="flex items-center gap-1"><RefreshCw size={13} /> {appointment.status}</span>
                  </div>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium capitalize text-violet-700">
                  {appointment.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { BarChart2, ShieldCheck, Stethoscope, User, Users } from "lucide-react";

const adminCards = [
  { label: "User management", description: "Review public user profiles and role assignments.", icon: Users },
  { label: "Consultant management", description: "Audit consultant accounts, capacity, and storage usage.", icon: Stethoscope },
  { label: "Patient management", description: "Review patient profiles and access boundaries.", icon: User },
  { label: "System analytics", description: "Monitor consultations, uploads, summaries, and platform health.", icon: BarChart2 },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-5">
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Role-gated administrative workspace for system oversight.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {adminCards.map(({ label, description, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <h2 className="text-sm font-semibold text-foreground">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

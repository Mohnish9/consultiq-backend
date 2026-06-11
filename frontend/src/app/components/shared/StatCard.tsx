import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ElementType;
  accent: string;
}

export function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-4" role="region" aria-label={label}>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-muted-foreground"
          style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase" }}
        >
          {label}
        </span>
        <div className={`w-7 h-7 rounded-lg ${accent} flex items-center justify-center`} aria-hidden="true">
          <Icon size={13} />
        </div>
      </div>
      <p className="text-foreground" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>{sub}</p>}
    </div>
  );
}

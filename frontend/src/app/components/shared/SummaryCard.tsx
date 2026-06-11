import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SummaryCard({ title, subtitle, children, actions, className = "" }: SummaryCardProps) {
  return (
    <div className={`bg-white border border-border rounded-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <p className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>{title}</p>
          {subtitle && <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

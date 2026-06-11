import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-foreground mb-2" style={{ fontSize: "15px", fontWeight: 600 }}>{title}</h3>
      <p className="text-muted-foreground max-w-xs" style={{ fontSize: "13px", lineHeight: 1.6 }}>{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

import { AlertCircle, RefreshCw, InboxIcon } from "lucide-react";

interface PageStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
}

export function PageState({
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  emptyTitle = "No data",
  emptyMessage = "Nothing to show here yet.",
  onRetry,
}: PageStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3" aria-busy="true" aria-label="Loading">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" role="status" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3" role="alert" aria-live="assertive">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle size={20} className="text-red-500" aria-hidden="true" />
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>Failed to load</p>
          {errorMessage && <p className="text-xs text-muted-foreground mt-0.5">{errorMessage}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <InboxIcon size={20} className="text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{emptyTitle}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return null;
}

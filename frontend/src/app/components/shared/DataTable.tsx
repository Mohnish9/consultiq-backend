import type { ReactNode } from "react";
import { PageState } from "./PageState";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  isError,
  errorMessage,
  emptyTitle = "No results",
  emptyMessage = "Nothing to show here yet.",
  onRetry,
  className = "",
}: DataTableProps<T>) {
  if (isLoading || isError || data.length === 0) {
    return (
      <div className={`bg-white border border-border rounded-xl overflow-hidden ${className}`}>
        <table className="w-full">
          <thead>
            <TableHead columns={columns} />
          </thead>
        </table>
        <PageState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && data.length === 0}
          errorMessage={errorMessage}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-border rounded-xl overflow-hidden ${className}`}>
      <table className="w-full" role="table">
        <thead>
          <TableHead columns={columns} />
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-border/40 hover:bg-muted/20 transition-colors"
              role="row"
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2.5" style={{ width: col.width }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead<T>({ columns }: { columns: ColumnDef<T>[] }) {
  return (
    <tr className="border-b border-border bg-muted/20" role="row">
      {columns.map(col => (
        <th
          key={col.key}
          scope="col"
          className="text-left px-4 py-2 text-muted-foreground"
          style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.03em", width: col.width }}
        >
          {col.header}
        </th>
      ))}
    </tr>
  );
}

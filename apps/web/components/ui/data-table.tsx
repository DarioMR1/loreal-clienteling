import { cn } from "@/lib/utils"
import { EmptyState } from "./empty-state"

// ── Types ──────────────────────────────────────────────────────────

export interface Column<T> {
  key: string
  label: string
  className?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ReactNode
  emptyAction?: React.ReactNode
  onRowClick?: (row: T) => void
  className?: string
}

// ── Skeleton row ───────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2.5">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  )
}

// ── Component ──────────────────────────────────────────────────────

/**
 * DataTable — L'Oréal Clienteling
 *
 * Simple styled table. Stripe principle: subtle dividers, no heavy borders.
 * Each page defines its own columns and passes data — no magic.
 */
function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "Sin datos",
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <div
      data-slot="data-table"
      className={cn("w-full overflow-x-auto", className)}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2 text-left text-xs font-medium text-muted-foreground",
                  col.className,
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            : data.map((row, rowIndex) => {
                const record = row as Record<string, unknown>
                return (
                <tr
                  key={record.id as string ?? rowIndex}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-muted/50",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-3 py-2.5", col.className)}
                    >
                      {col.render
                        ? col.render(record[col.key], row)
                        : (record[col.key] as React.ReactNode) ?? "—"}
                    </td>
                  ))}
                </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }

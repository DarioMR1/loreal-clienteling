import { cn } from "@/lib/utils"
import { EmptyState } from "./empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

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
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  )
}

// ── Component ──────────────────────────────────────────────────────

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
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                "text-xs font-medium text-muted-foreground",
                col.className,
              )}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          : data.map((row, rowIndex) => {
              const record = row as Record<string, unknown>
              return (
                <TableRow
                  key={(record.id as string) ?? rowIndex}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(record[col.key], row)
                        : (record[col.key] as React.ReactNode) ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
      </TableBody>
    </Table>
  )
}

export { DataTable }

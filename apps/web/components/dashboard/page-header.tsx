import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * PageHeader — consistent header for every dashboard page.
 * Title on the left, optional action button on the right.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div data-slot="page-header" className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

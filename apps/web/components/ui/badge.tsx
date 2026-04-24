import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge — L'Oréal Clienteling
 *
 * Inline status indicator. Use for tier, chain, role, status, segment, channel.
 * Stripe principle: subtle tinted backgrounds, no heavy borders.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md px-1.5 font-medium whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border bg-background text-foreground",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning-foreground",
        destructive: "bg-destructive/10 text-destructive",
        info: "bg-info/10 text-info",
      },
      size: {
        default: "h-5 text-xs",
        sm: "h-4 text-[11px] px-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

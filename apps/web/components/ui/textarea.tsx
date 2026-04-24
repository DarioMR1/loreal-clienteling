import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea — L'Oréal Clienteling
 *
 * Mirrors Input styling: same border, shadow, focus ring, transitions.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-base shadow-[var(--shadow-xs)] transition-all duration-150 ease-[cubic-bezier(0,0.09,0.4,1)] outline-none placeholder:text-muted-foreground hover:border-muted-foreground/30 focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

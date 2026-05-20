'use client'

import { toothStatuses } from '@/lib/tooth-data'
import { cn } from '@/lib/utils'

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start px-5 py-4 bg-muted/40 dark:bg-muted/10 rounded-2xl border border-border/80 shadow-2xs">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none pr-2 border-r border-border shrink-0">
        Tedavi Renk Kodları
      </span>
      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {toothStatuses.map((status) => (
          <div key={status.value} className="flex items-center gap-2 group select-none">
            <span 
              className={cn(
                "h-3.5 w-3.5 rounded-full border shadow-2xs transition-transform duration-200 group-hover:scale-115 shrink-0"
              )}
              style={{ 
                backgroundColor: status.value === 'healthy' ? 'transparent' : status.color,
                borderColor: status.value === 'healthy' ? '#CBD5E1' : status.color
              }}
            />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {status.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

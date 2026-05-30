import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

export const Select = forwardRef(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

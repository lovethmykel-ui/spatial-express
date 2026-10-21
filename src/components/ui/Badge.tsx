import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
        {
          'border-transparent bg-primary text-white': variant === 'default',
          'border-transparent bg-success/15 text-emerald-700': variant === 'success',
          'border-transparent bg-warning/15 text-amber-800': variant === 'warning',
          'border-transparent bg-danger/15 text-rose-700': variant === 'danger',
          'border-slate-200 bg-slate-50 text-slate-700': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

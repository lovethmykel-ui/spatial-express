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
          'border-transparent bg-primary text-black': variant === 'default',
          'border-transparent bg-success/10 text-success': variant === 'success',
          'border-transparent bg-warning/10 text-warning': variant === 'warning',
          'border-transparent bg-danger/10 text-danger': variant === 'danger',
          'border-white/20 text-white': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

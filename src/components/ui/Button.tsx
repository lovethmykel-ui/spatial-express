import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const buttonClasses = (
  variant: ButtonProps['variant'] = 'default',
  size: ButtonProps['size'] = 'default',
  className?: string
) =>
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-display font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95',
    {
      // Primary button: Vibrant emerald with crisp white text
      'bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow transition-all':
        variant === 'default',
      // Outline: Clean border with slate-800 text
      'border border-slate-300 bg-white text-slate-800 hover:text-primary hover:border-primary/50 hover:bg-slate-50 shadow-sm': variant === 'outline',
      // Ghost: Text slate-600 fading to slate-900 on hover
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100': variant === 'ghost',
      // Glass: Clean light card button style
      'glass-button text-slate-800 hover:bg-slate-100 border border-slate-200': variant === 'glass',
      
      // Sizes
      'h-10 px-5 py-2 text-sm': size === 'default',
      'h-8 rounded-md px-3 text-xs': size === 'sm',
      'h-12 rounded-lg px-8 text-base': size === 'lg',
      'h-10 w-10 p-0': size === 'icon',
    },
    className
  )

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        ...child.props,
        className: buttonClasses(variant, size, cn(child.props.className, className)),
      })
    }

    return (
      <button
        ref={ref}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }

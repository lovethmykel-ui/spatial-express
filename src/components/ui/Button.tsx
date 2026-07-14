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
      // Primary button: Neon Green to Forest Green with black text (high contrast)
      'bg-gradient-to-r from-primary to-secondary text-black shadow-glow hover:shadow-strong hover:scale-[1.02] border-none':
        variant === 'default',
      // Outline: Thin border with neon-green text on hover
      'border border-white/10 bg-transparent text-white hover:text-primary hover:border-primary/40 hover:bg-white/5': variant === 'outline',
      // Ghost: Text secondary fading to primary on hover
      'text-text-secondary hover:text-white hover:bg-white/5': variant === 'ghost',
      // Glass: Glassmorphic panel style with green hover glow
      'glass-panel text-white hover:bg-white/10 border border-white/10 hover:border-primary/20': variant === 'glass',
      
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

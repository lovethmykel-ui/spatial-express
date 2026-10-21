import React from 'react'
import { cn } from '../../lib/utils'

export type CourierBrand = 'dhl' | 'fedex' | 'ups' | 'aramex' | 'ems' | string

interface CourierLogoProps {
  brand: CourierBrand
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withGlassContainer?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1',
  md: 'w-12 h-12 p-2',
  lg: 'w-16 h-16 p-3',
  xl: 'w-24 h-24 p-4',
}

export function CourierLogo({ brand, className, size = 'md', withGlassContainer = true }: CourierLogoProps) {
  const normalizedBrand = brand.toLowerCase()
  // Ensure the image src points to the public folder where the badges are stored
  const imgSrc = `/courier badges/${normalizedBrand}.png`

  const image = (
    <img 
      src={imgSrc} 
      alt={`${brand} logo`} 
      className="w-full h-full object-contain"
      onError={(e) => {
        // Fallback if image not found
        (e.target as HTMLImageElement).src = '/logo.png'
      }}
    />
  )

  if (withGlassContainer) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 shadow-sm",
          sizeClasses[size],
          className
        )}
      >
        {image}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      {image}
    </div>
  )
}

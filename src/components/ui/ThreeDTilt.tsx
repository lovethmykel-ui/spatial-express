import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ThreeDTiltProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number // maximum rotation degrees
  scale?: number // scale on hover
  onClick?: () => void
}

export function ThreeDTilt({
  children,
  className,
  maxTilt = 15,
  scale = 1.02,
  onClick,
}: ThreeDTiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Motion values to track absolute mouse coordinates within the element
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring configuration for silky smooth 3D tilting
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
  const tiltScale = useSpring(hovering ? scale : 1, springConfig)

  // Dynamic shine/glare effect tracking the cursor location
  const opacity = useSpring(hovering ? 0.4 : 0, springConfig)
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], ['0%', '100%']), springConfig)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], ['0%', '100%']), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    // Normalize coordinates: center is (0,0), bounds are [-0.5, 0.5]
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5

    x.set(relativeX)
    y.set(relativeY)
  }

  const handleMouseEnter = () => {
    setHovering(true)
  }

  const handleMouseLeave = () => {
    setHovering(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale: tiltScale,
      }}
      className={cn(
        'relative rounded-2xl overflow-hidden transition-shadow duration-300 select-none cursor-pointer',
        hovering ? 'shadow-[0_20px_50px_rgba(57,255,20,0.12)] border-white/20' : 'border-white/5',
        className
      )}
    >
      {/* Glare/Shine layer */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 250px at ${glareX} ${glareY}, rgba(255,255,255,0.06), transparent 80%)`,
          opacity,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* 3D Depth Content container */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}

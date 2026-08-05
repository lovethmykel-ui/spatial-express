import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface FloatingElementProps {
  className?: string
  yRange?: [number, number]
  rotateRange?: [number, number]
  scaleRange?: [number, number]
  children?: React.ReactNode
}

export function ParallaxLayer({
  className,
  yRange = [-100, 100],
  rotateRange = [-15, 15],
  scaleRange = [0.9, 1.1],
  children,
}: FloatingElementProps) {
  const { scrollYProgress } = useScroll()

  // Transforms driven by scroll position
  const y = useTransform(scrollYProgress, [0, 1], yRange)
  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange)
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange)

  return (
    <motion.div
      style={{ y, rotate, scale, transformStyle: 'preserve-3d' }}
      className={cn('absolute pointer-events-none select-none z-0', className)}
    >
      {children}
    </motion.div>
  )
}

// Predefined stylish 3D background shapes to scatter around the sections
export function Floating3DDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* 1. Neon wireframe glowing cube or torus-like floating card near Hero */}
      <ParallaxLayer
        className="top-[15%] left-[5%] w-24 h-24 opacity-30 hidden md:block"
        yRange={[-50, 120]}
        rotateRange={[-20, 30]}
      >
        <div className="w-full h-full border border-primary/30 rounded-2xl bg-gradient-to-tr from-primary/5 to-transparent backdrop-blur-[2px] shadow-[0_0_20px_rgba(57,255,20,0.1)] flex items-center justify-center">
          <div className="w-12 h-12 border border-primary/20 rounded-lg rotate-45 animate-pulse" />
        </div>
      </ParallaxLayer>

      {/* 2. Frosted Glass sphere / bubble near stats */}
      <ParallaxLayer
        className="top-[30%] right-[10%] w-32 h-32 opacity-25 hidden md:block"
        yRange={[100, -150]}
        rotateRange={[30, -30]}
      >
        <div className="w-full h-full rounded-full bg-white/[0.03] backdrop-blur-[6px] border border-white/10 shadow-[inset_0_4px_12px_rgba(255,255,255,0.15)] relative">
          <div className="absolute top-2 left-4 w-4 h-2 rounded-full bg-white/30 rotate-12" />
        </div>
      </ParallaxLayer>

      {/* 3. Isometric glowing shipping crate/box wireframe near How it Works */}
      <ParallaxLayer
        className="top-[45%] left-[8%] w-20 h-20 opacity-20"
        yRange={[-80, 80]}
        rotateRange={[-10, 45]}
      >
        <div className="w-full h-full border border-white/20 rounded-xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-[1px] relative flex items-center justify-center">
          {/* Crate design */}
          <div className="absolute inset-2 border border-white/10" />
          <div className="absolute h-[2px] w-[90%] bg-white/10 rotate-45" />
          <div className="absolute h-[2px] w-[90%] bg-white/10 -rotate-45" />
        </div>
      </ParallaxLayer>

      {/* 4. Glowing green trajectory orb near Bento grid */}
      <ParallaxLayer
        className="top-[60%] right-[5%] w-16 h-16 opacity-30"
        yRange={[120, -120]}
        rotateRange={[0, 90]}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/20 to-secondary/10 blur-[2px] relative flex items-center justify-center border border-primary/20">
          <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
        </div>
      </ParallaxLayer>

      {/* 5. Isometric holographic card near Testimonials */}
      <ParallaxLayer
        className="top-[78%] left-[12%] w-28 h-36 opacity-15 hidden md:block"
        yRange={[-150, 150]}
        rotateRange={[45, -15]}
      >
        <div className="w-full h-full rounded-xl bg-gradient-to-b from-primary/10 via-transparent to-white/[0.02] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between p-4">
          <div className="w-8 h-2 rounded-full bg-white/20" />
          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-primary/20" />
            <div className="w-5/6 h-1.5 rounded-full bg-white/10" />
          </div>
        </div>
      </ParallaxLayer>

      {/* 6. Glowing neon delivery route indicator near FAQs */}
      <ParallaxLayer
        className="top-[90%] right-[15%] w-40 h-2 opacity-40 hidden md:block"
        yRange={[-50, 50]}
        rotateRange={[-5, 5]}
      >
        <div className="w-full h-full bg-gradient-to-r from-primary/5 via-primary to-transparent rounded-full shadow-[0_0_15px_#39FF14]" />
      </ParallaxLayer>

    </div>
  )
}

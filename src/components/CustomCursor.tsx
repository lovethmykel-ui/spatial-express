import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLogistics } from '../context/LogisticsContext'

export default function CustomCursor() {
  const { customCursorActive } = useLogistics()
  const [isMobile, setIsMobile] = useState(true)
  const [isMoving, setIsMoving] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring settings for premium, organic movement lag
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const lastCoords = useRef({ x: 0, y: 0 })
  const moveTimeout = useRef<number | null>(null)
  const trailId = useRef(0)

  useEffect(() => {
    // Detect mobile touch devices
    const checkDevice = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)

    if (isMobile || !customCursorActive) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      
      mouseX.set(clientX)
      mouseY.set(clientY)

      // Calculate speed/movement to trigger wheel rotation
      const diffX = Math.abs(clientX - lastCoords.current.x)
      const diffY = Math.abs(clientY - lastCoords.current.y)
      
      if (diffX > 1 || diffY > 1) {
        setIsMoving(true)
        
        // Add coordinates to trail history
        trailId.current += 1
        const newPoint = { x: clientX, y: clientY, id: trailId.current }
        setTrail(prev => [...prev.slice(-6), newPoint]) // Keep last 6 dots

        if (moveTimeout.current) window.clearTimeout(moveTimeout.current)
        moveTimeout.current = window.setTimeout(() => {
          setIsMoving(false)
        }, 150)
      }

      lastCoords.current = { x: clientX, y: clientY }
    }

    // Add active body class to hide default cursor
    document.documentElement.classList.add('custom-cursor-active')
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkDevice)
      if (moveTimeout.current) window.clearTimeout(moveTimeout.current)
    }
  }, [isMobile, customCursorActive, mouseX, mouseY])

  if (isMobile || !customCursorActive) return null

  return (
    <>
      {/* Neon Trail Particles */}
      {trail.map((point, index) => {
        // Calculate opacity and scale based on age
        const opacity = (index + 1) / trail.length * 0.3
        const scale = (index + 1) / trail.length * 0.7
        return (
          <div
            key={point.id}
            className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9998] bg-primary/40 blur-[1px]"
            style={{
              transform: `translate3d(${point.x - 5}px, ${point.y - 5}px, 0) scale(${scale})`,
              opacity,
              transition: 'opacity 150ms ease-out',
            }}
          />
        )
      })}

      {/* Main Cursor (Emerald Green Truck Vector) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: -16, // offset to center
          translateY: -12,
        }}
      >
        <svg 
          width="32" 
          height="24" 
          viewBox="0 0 32 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        >
          {/* Truck Body */}
          <path 
            d="M2 4C2 2.89543 2.89543 2 4 2H18C19.1046 2 20 2.89543 20 4V16H2V4Z" 
            fill="#FFFFFF" 
            stroke="#16a34a" 
            strokeWidth="1.5"
          />
          {/* Cab */}
          <path 
            d="M20 7H26.5858C27.1162 7 27.6249 7.21071 28 7.58579L30.4142 10C30.7893 10.3751 31 10.8838 31 11.4142V16H20V7Z" 
            fill="#FFFFFF" 
            stroke="#16a34a" 
            strokeWidth="1.5"
          />
          {/* Window */}
          <path 
            d="M22 9H25.5L28 11.5V13.5H22V9Z" 
            fill="rgba(22, 163, 74, 0.2)" 
            stroke="#16a34a" 
            strokeWidth="1"
          />
          
          {/* Front Wheel */}
          <circle 
            cx="25.5" 
            cy="18.5" 
            r="3.5" 
            fill="#F8FAFC" 
            stroke="#16a34a" 
            strokeWidth="1.5" 
            className={isMoving ? 'animate-[truckRoll_0.5s_linear_infinite]' : ''}
          />
          {/* Front Wheel Hub lines */}
          <line x1="25.5" y1="15" x2="25.5" y2="22" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[25.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />
          <line x1="22" y1="18.5" x2="29" y2="18.5" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[25.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />

          {/* Rear Wheel */}
          <circle 
            cx="7.5" 
            cy="18.5" 
            r="3.5" 
            fill="#F8FAFC" 
            stroke="#16a34a" 
            strokeWidth="1.5" 
            className={isMoving ? 'animate-[truckRoll_0.5s_linear_infinite]' : ''}
          />
          {/* Rear Wheel Hub lines */}
          <line x1="7.5" y1="15" x2="7.5" y2="22" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[7.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />
          <line x1="4" y1="18.5" x2="11" y2="18.5" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[7.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />
          
          {/* Rear Wheel 2 */}
          <circle 
            cx="14.5" 
            cy="18.5" 
            r="3.5" 
            fill="#F8FAFC" 
            stroke="#16a34a" 
            strokeWidth="1.5" 
            className={isMoving ? 'animate-[truckRoll_0.5s_linear_infinite]' : ''}
          />
          <line x1="14.5" y1="15" x2="14.5" y2="22" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[14.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />
          <line x1="11" y1="18.5" x2="18" y2="18.5" stroke="#16a34a" strokeWidth="1" className={isMoving ? 'origin-[14.5px_18.5px] animate-[truckRoll_0.5s_linear_infinite]' : ''} />
        </svg>
      </motion.div>
    </>
  )
}

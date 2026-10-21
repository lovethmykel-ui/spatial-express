import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, RotateCcwIcon, XIcon, ShieldCheckIcon } from './ui/CustomIcons'
import { cn } from '../lib/utils'

interface SliderPuzzleProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function SliderPuzzle({ onSuccess, onCancel }: SliderPuzzleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [puzzleY, setPuzzleY] = useState(50)
  const [targetX, setTargetX] = useState(200)

  const width = 340
  const height = 190
  const pieceSize = 64

  const generatePuzzle = () => {
    // Randomize Y between 20 and height - pieceSize - 20
    const newY = Math.floor(Math.random() * (height - pieceSize - 40)) + 20
    // Randomize X between 120 and width - pieceSize - 20
    const newX = Math.floor(Math.random() * (width - 120 - pieceSize - 20)) + 120
    setPuzzleY(newY)
    setTargetX(newX)
    setPosition(0)
    setIsSuccess(false)
  }

  useEffect(() => {
    generatePuzzle()
  }, [])

  const handleDrag = (event: any, info: any) => {
    if (isSuccess) return
    setIsDragging(true)
    let newX = info.offset.x
    
    // Limits
    const maxDrag = width - pieceSize
    if (newX < 0) newX = 0
    if (newX > maxDrag) newX = maxDrag
    
    setPosition(newX)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (isSuccess) return

    // Tolerance of 6px
    if (Math.abs(position - targetX) < 6) {
      setPosition(targetX)
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 800)
    } else {
      // Snap back
      setPosition(0)
    }
  }

  // Interlocking puzzle piece shape
  const puzzleClipPath = "path('M 16 0 L 48 0 L 48 20 C 64 20 64 44 48 44 L 48 64 L 16 64 L 16 44 C 32 44 32 20 16 20 Z')"

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-[17px] font-bold text-slate-900 mb-1">Slide to complete the puzzle</h3>
        <p className="text-xs text-slate-500">This helps us verify you're human and keep your account secure.</p>
      </div>

      {/* Main Puzzle Container */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md"
        style={{ width, height }}
      >
        {/* Background Image */}
        <img src="/puzzle-bg-green.png" alt="Spatial Express Security" className="w-full h-full object-cover" draggable={false} />

        {/* Target Hole */}
        <div 
          className="absolute bg-black/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
          style={{
            width: pieceSize,
            height: pieceSize,
            left: targetX,
            top: puzzleY,
            clipPath: puzzleClipPath,
          }}
        >
          {/* Inner stroke for hole */}
          <div className="absolute inset-0 border-[2px] border-black/50" style={{ clipPath: puzzleClipPath }} />
        </div>

        {/* Sliding Piece */}
        <motion.div
          animate={{ x: position }}
          transition={{ type: isDragging ? "tween" : "spring", duration: isDragging ? 0 : 0.4 }}
          className={cn(
            "absolute shadow-[0_0_20px_rgba(22,163,74,0.3)] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]",
            isSuccess && "shadow-[0_0_30px_rgba(22,163,74,0.8)] filter-none"
          )}
          style={{
            width: pieceSize,
            height: pieceSize,
            top: puzzleY,
            clipPath: puzzleClipPath,
            backgroundImage: "url('/puzzle-bg-green.png')",
            backgroundSize: `${width}px ${height}px`,
            backgroundPosition: `-${targetX}px -${puzzleY}px`,
            zIndex: 10
          }}
        >
           {/* Inner stroke for piece */}
           <div className={cn("absolute inset-0 border-[2px]", isSuccess ? "border-primary" : "border-white/80")} style={{ clipPath: puzzleClipPath }} />
        </motion.div>
        
        {/* Success Flash Overlay */}
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center z-20"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Slider Track */}
      <div className="mt-6 w-full relative h-[48px] bg-slate-100 rounded-full border border-slate-200 overflow-hidden shadow-inner flex items-center px-2">
        {/* Active track fill */}
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-primary/20 border-r border-primary/50"
          animate={{ width: position + 30 }}
          transition={{ type: isDragging ? "tween" : "spring", duration: isDragging ? 0 : 0.4 }}
        />

        {/* Hint text arrows inside track */}
        <div className="absolute inset-0 flex items-center ml-[90px] pointer-events-none select-none opacity-40 text-primary font-black tracking-widest text-lg">
          {isSuccess ? '' : '>>>'}
        </div>

        {/* Thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: width - 80 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={{ x: position }}
          transition={{ type: isDragging ? "tween" : "spring", duration: isDragging ? 0 : 0.4 }}
          className={cn(
            "absolute top-1 bottom-1 w-[70px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-md transition-colors border border-white/50",
            isSuccess ? "bg-primary" : "bg-gradient-to-b from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
          )}
        >
          {isSuccess ? (
            <CheckIcon className="w-6 h-6 text-white" />
          ) : (
            <span className="font-black text-xl italic text-white filter drop-shadow-sm">S</span>
          )}
        </motion.div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 flex items-center justify-between w-full px-2">
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors shadow-xs">
              <XIcon className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900 transition-colors">Cancel</span>
          </button>
          
          <button onClick={generatePuzzle} disabled={isSuccess} className="flex flex-col items-center gap-1 group disabled:opacity-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors shadow-xs">
              <RotateCcwIcon className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-900 transition-colors">Refresh</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
          <ShieldCheckIcon className="w-3.5 h-3.5" />
          <span>Security verification by Spatial Express</span>
        </div>
      </div>
    </div>
  )
}

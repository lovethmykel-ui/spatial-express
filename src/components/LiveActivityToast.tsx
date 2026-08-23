import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountryFlag } from './ui/CountryFlag'
import { CourierLogo, CourierBrand } from './ui/CourierLogo'
import { XIcon, ShieldCheckIcon } from './ui/CustomIcons'

interface ActivityItem {
  id: string
  courier: CourierBrand
  originCode: string
  originCity: string
  destCode: string
  destCity: string
  action: string
  timeAgo: string
  weight: string
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    courier: 'dhl',
    originCode: 'NG',
    originCity: 'Lagos',
    destCode: 'GB',
    destCity: 'London',
    action: 'Pickup dispatched',
    timeAgo: '2m ago',
    weight: '3.5 kg'
  },
  {
    id: 'act-2',
    courier: 'fedex',
    originCode: 'NG',
    originCity: 'Port Harcourt',
    destCode: 'US',
    destCity: 'New York',
    action: 'Customs cleared',
    timeAgo: '5m ago',
    weight: '8.0 kg'
  },
  {
    id: 'act-3',
    courier: 'ups',
    originCode: 'NG',
    originCity: 'Abuja',
    destCode: 'CA',
    destCity: 'Toronto',
    action: 'Flight cargo departed',
    timeAgo: '9m ago',
    weight: '12.4 kg'
  },
  {
    id: 'act-4',
    courier: 'aramex',
    originCode: 'NG',
    originCity: 'Lagos',
    destCode: 'AE',
    destCity: 'Dubai',
    action: 'Delivered to consignee',
    timeAgo: '14m ago',
    weight: '1.2 kg'
  }
]

export default function LiveActivityToast() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isVisible || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % mockActivities.length)
    }, 7500)

    return () => clearInterval(interval)
  }, [isVisible, isPaused])

  if (!isVisible) return null

  const current = mockActivities[currentIndex]

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hidden sm:block fixed bottom-6 left-6 z-40 max-w-sm pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="glass-card p-3.5 flex items-center gap-3 border border-white/10 dark:border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.5)] rounded-2xl relative overflow-hidden group"
        >
          {/* Subtle glowing beacon */}
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />

          {/* Courier Logo */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-black/40 dark:bg-black/40 light:bg-slate-100 flex items-center justify-center p-1.5 border border-white/5">
            <CourierLogo brand={current.courier} size="sm" withGlassContainer={false} />
          </div>

          {/* Activity Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">Live Activity</span>
              <span className="text-[9px] text-muted ml-auto font-mono">{current.timeAgo}</span>
            </div>
            
            <p className="text-xs font-semibold text-text truncate">
              {current.originCity} → {current.destCity}
            </p>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-text-secondary flex items-center gap-1">
                <CountryFlag countryCode={current.originCode} size="sm" />
                <span>→</span>
                <CountryFlag countryCode={current.destCode} size="sm" />
              </span>
              <span className="text-[10px] text-muted">({current.action} • {current.weight})</span>
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="w-5 h-5 rounded-full flex items-center justify-center text-muted hover:text-text hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

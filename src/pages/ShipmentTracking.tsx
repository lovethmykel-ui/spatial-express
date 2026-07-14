import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon, MapPinIcon, PackageIcon, ClockIcon, ShieldCheckIcon, AlertTriangleIcon, InfoIcon, TruckIcon } from '../components/ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CourierLogo, CourierBrand } from '../components/ui/CourierLogo'
import { cn } from '../lib/utils'
import { ExternalLinkIcon } from 'lucide-react'

// Official tracking base URLs (placeholders or real where applicable)
const courierTrackingUrls: Record<CourierBrand, string> = {
  dhl: 'https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  ups: 'https://www.ups.com/track?tracknum=',
  aramex: 'https://www.aramex.com/us/en/track/shipments?ShipmentNumber=',
  ems: 'https://www.ems.post/en/global-network/tracking?tracking=',
}

const officialCouriers: CourierBrand[] = ['dhl', 'fedex', 'ups', 'aramex', 'ems']

export default function ShipmentTracking() {
  const { 
    selectedTrackingId, 
    setSelectedTrackingId,
    selectedShipmentDetail,
    shipments
  } = useLogistics()

  const [inputVal, setInputVal] = useState(selectedTrackingId)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'courier' | 'internal'>('courier')

  const handleInternalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const found = shipments.find(s => s.id.toLowerCase() === inputVal.trim().toLowerCase())
    if (found) {
      setSelectedTrackingId(found.id)
      setErrorMsg('')
    } else {
      setErrorMsg('Invalid internal SPX tracking ID. Try searching "SPX-8294-0921".')
    }
  }

  // Fallback map logic for internal tracking ONLY
  const getMapCoordinates = () => {
    const origin = { x: 190, y: 120, name: 'Nigeria' }
    let destination = { x: 178, y: 65, name: 'London, UK' }

    if (selectedShipmentDetail) {
      const dest = selectedShipmentDetail.destination.toLowerCase()
      if (dest.includes('london') || dest.includes('uk')) destination = { x: 178, y: 65, name: 'London, UK' }
      else if (dest.includes('toronto') || dest.includes('canada')) destination = { x: 95, y: 70, name: 'Toronto, Canada' }
      else if (dest.includes('new york') || dest.includes('usa')) destination = { x: 100, y: 80, name: 'New York, USA' }
      else if (dest.includes('dubai') || dest.includes('ae')) destination = { x: 232, y: 100, name: 'Dubai, UAE' }
    }
    return { origin, destination }
  }

  const { origin, destination } = getMapCoordinates()
  const getArcPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const dr = Math.sqrt(dx * dx + dy * dy) * 1.2
    return `M ${x1} ${y1} A ${dr} ${dr} 0 0 1 ${x2} ${y2}`
  }
  const arcPath = getArcPath(origin.x, origin.y, destination.x, destination.y)

  return (
    <div className="space-y-10 select-none text-left pb-20">
      
      {/* Header & Tabs */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
        >
          Track Your <span className="text-gradient">Shipment</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          Your tracking ID belongs to the courier assigned during checkout. 
          Select your courier to track directly via their official portal, or use our internal ledger.
        </motion.p>

        {/* Custom Tab Switcher */}
        <div className="inline-flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 mt-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <button
            onClick={() => setActiveTab('courier')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300",
              activeTab === 'courier' ? "bg-white/10 text-white shadow-sm" : "text-muted hover:text-white"
            )}
          >
            Track via Courier
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300",
              activeTab === 'internal' ? "bg-white/10 text-white shadow-sm" : "text-muted hover:text-white"
            )}
          >
            Internal SPX Ledger
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'courier' && (
          <motion.div
            key="courier"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officialCouriers.map((courier, idx) => (
                <motion.a
                  key={courier}
                  href={courierTrackingUrls[courier]}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card glass-card-hover p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer"
                >
                  <CourierLogo brand={courier} size="lg" />
                  <div className="space-y-1">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                      Track via {courier}
                      <ExternalLinkIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>
                    <p className="text-[10px] text-muted">Redirects to official portal</p>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-8 text-center text-xs text-muted/60 max-w-lg mx-auto">
              You will be redirected to the official courier's website where you can enter the tracking ID provided on your Spatial Express receipt.
            </div>
          </motion.div>
        )}

        {activeTab === 'internal' && (
          <motion.div
            key="internal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Search Tracker Input */}
            <div className="glass-panel p-8 max-w-2xl mx-auto rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 text-center">
                <TruckIcon className="w-8 h-8 text-primary/50 mx-auto mb-4" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Search Internal Ledger</h2>
                <form onSubmit={handleInternalSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-3.5 w-4 h-4 text-muted" />
                    <Input
                      type="text"
                      placeholder="e.g. SPX-8294-0921"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="pl-11 bg-[#050608]/80 text-sm font-bold h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="px-8 text-xs uppercase font-extrabold cursor-pointer h-12 rounded-xl">Locate</Button>
                </form>
                {errorMsg && (
                  <p className="text-[11px] text-red-400 font-semibold mt-3 flex items-center justify-center gap-1.5">
                    <AlertTriangleIcon className="w-4 h-4" />
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>

            {selectedShipmentDetail ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT/MID: Visual tracking Map Deck */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass-card p-6 relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                      <div>
                        <span className="text-[10px] text-muted uppercase font-bold tracking-widest block mb-1">Operational Route Map</span>
                        <span className="text-sm font-bold text-white leading-none">
                          {selectedShipmentDetail.origin} → {selectedShipmentDetail.destination}
                        </span>
                      </div>
                      <span className="text-[10px] text-primary font-bold uppercase bg-primary/10 px-3 py-1 rounded-md border border-primary/20 shadow-[inset_0_1px_1px_rgba(57,255,20,0.2)]">
                        {selectedShipmentDetail.courier.toUpperCase()} Asssigned
                      </span>
                    </div>

                    {/* Dark World Map SVG Visualizer */}
                    <div className="h-96 rounded-2xl border border-white/5 bg-[#050608] relative overflow-hidden flex items-center justify-center grid-bg shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
                      <svg className="absolute w-full h-full p-4" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5">
                          <path d="M40 30 L80 30 L110 50 L100 80 L70 90 L30 70 Z" />
                          <path d="M80 95 L110 110 L100 160 L85 180 L75 140 Z" />
                          <path d="M150 90 Q170 80 190 90 L210 120 L195 170 L180 170 L170 140 L145 110 Z" />
                          <path d="M140 40 L180 30 L200 50 L190 75 L150 70 L140 55 Z" />
                          <path d="M210 40 L310 35 L330 70 L310 110 L260 115 L215 80 Z" />
                          <path d="M300 140 L330 135 L340 160 L310 170 Z" />
                        </g>
                        <motion.path
                          d={arcPath}
                          stroke="#39FF14"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: 'easeInOut' }}
                        />
                        <circle cx={origin.x} cy={origin.y} r="4" fill="#39FF14" className="animate-pulse-glow" />
                        <circle cx={destination.x} cy={destination.y} r="4" fill="#39FF14" className="animate-pulse-glow" />
                        <motion.circle r="4" fill="#39FF14" filter="drop-shadow(0 0 4px #39FF14)">
                          <animateMotion path={arcPath} dur="5s" repeatCount="indefinite" />
                        </motion.circle>
                      </svg>

                      <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-left shadow-xl">
                        <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Origin</p>
                        <p className="text-white font-bold leading-none mt-1 text-xs">{origin.name}</p>
                      </div>
                      <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-right shadow-xl">
                        <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Destination</p>
                        <p className="text-white font-bold leading-none mt-1 text-xs">{destination.name}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Quick courier details card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[inset_0_1px_1px_rgba(57,255,20,0.1)]">
                        <PackageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Weight</span>
                        <span className="text-sm font-bold text-white">{selectedShipmentDetail.weight} kg</span>
                      </div>
                    </Card>

                    <Card className="glass-card p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[inset_0_1px_1px_rgba(57,255,20,0.1)]">
                        <ClockIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Est. Delivery</span>
                        <span className="text-sm font-bold text-white">{selectedShipmentDetail.estimatedDelivery}</span>
                      </div>
                    </Card>

                    <Card className="glass-card p-5 flex items-center gap-4">
                      <CourierLogo brand={selectedShipmentDetail.courier} size="sm" withGlassContainer={false} />
                      <div>
                        <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Carrier</span>
                        <span className="text-sm font-bold text-white capitalize">{selectedShipmentDetail.courier}</span>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* RIGHT: Shipment Checkpoints Timeline */}
                <div>
                  <Card className="glass-card p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <span className="text-[10px] text-muted uppercase font-bold tracking-widest block mb-1">Status Ledger</span>
                        <h3 className="text-sm font-bold text-white">{selectedShipmentDetail.id}</h3>
                      </div>

                      {/* Timeline steps */}
                      <div className="relative pl-7 space-y-8 text-left">
                        <div className="absolute left-3 top-3 bottom-3 w-[2px] bg-white/5 rounded-full" />
                        {selectedShipmentDetail.history.map((step, idx) => {
                          const isCurrentActive = step.completed && (idx === selectedShipmentDetail.history.length - 1 || !selectedShipmentDetail.history[idx + 1].completed)
                          return (
                            <div key={idx} className="relative">
                              <span 
                                className={cn(
                                  "absolute -left-7 top-1 w-2.5 h-2.5 rounded-full border border-black z-10 transition-all duration-500",
                                  step.completed ? "bg-primary scale-110 shadow-[0_0_12px_#39FF14]" : "bg-white/10"
                                )}
                              />
                              <div>
                                <p 
                                  className={cn(
                                    "text-sm font-bold leading-none mb-1.5 transition-colors",
                                    step.completed ? "text-white" : "text-muted"
                                  )}
                                >
                                  {step.status}
                                </p>
                                <p className="text-[11px] text-muted leading-relaxed">{step.location}</p>
                                <span className="text-[10px] text-muted/40 mt-1.5 block font-mono">{step.time}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-5 mt-8 flex justify-between items-center text-[11px] text-muted font-medium">
                      <span className="flex items-center gap-1.5"><InfoIcon className="w-4 h-4 text-primary/70" /> Internal Record</span>
                      <span className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">Help Desk</span>
                    </div>
                  </Card>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

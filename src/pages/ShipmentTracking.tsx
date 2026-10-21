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
import { ShipmentProgressTracker } from '../components/ShipmentProgressTracker'

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
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
        >
          Track Your <span className="text-gradient">Shipment</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          Your tracking ID belongs to the courier assigned during checkout. 
          Select your courier to track directly via their official portal, or use our internal ledger.
        </motion.p>

        {/* Custom Tab Switcher */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mt-4 shadow-xs">
          <button
            onClick={() => setActiveTab('courier')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
              activeTab === 'courier' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Track via Courier
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
              activeTab === 'internal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
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
                  className="glass-card glass-card-hover p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer border border-slate-200/90 shadow-sm"
                >
                  <CourierLogo brand={courier} size="lg" />
                  <div className="space-y-1">
                    <h3 className="text-slate-900 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                      Track via {courier}
                      <ExternalLinkIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>
                    <p className="text-[10px] text-slate-500">Redirects to official portal</p>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-8 text-center text-xs text-slate-500 max-w-lg mx-auto">
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
            <div className="glass-panel p-8 max-w-2xl mx-auto rounded-3xl relative overflow-hidden group border border-slate-200/90 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative z-10 text-center">
                <TruckIcon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Search Internal Ledger</h2>
                <form onSubmit={handleInternalSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="e.g. SPX-8294-0921"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="pl-11 bg-slate-50 text-slate-900 border-slate-200 text-sm font-bold h-12 rounded-xl focus:bg-white focus:border-primary/50"
                    />
                  </div>
                  <Button type="submit" className="px-8 text-xs uppercase font-extrabold cursor-pointer h-12 rounded-xl text-white bg-primary hover:bg-primary/90 shadow-sm">Locate</Button>
                </form>
                {errorMsg && (
                  <p className="text-[11px] text-red-600 font-semibold mt-3 flex items-center justify-center gap-1.5">
                    <AlertTriangleIcon className="w-4 h-4" />
                    {errorMsg}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
                  <span>Quick Test Identifiers:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('SPX-8294-0921')
                      setSelectedTrackingId('SPX-8294-0921')
                      setErrorMsg('')
                    }}
                    className="font-mono text-primary hover:underline cursor-pointer"
                  >
                    SPX-8294-0921 (In Transit to London)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('SPX-5021-3910')
                      setSelectedTrackingId('SPX-5021-3910')
                      setErrorMsg('')
                    }}
                    className="font-mono text-primary hover:underline cursor-pointer"
                  >
                    SPX-5021-3910 (Toronto Customs)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('SPX-1942-8874')
                      setSelectedTrackingId('SPX-1942-8874')
                      setErrorMsg('')
                    }}
                    className="font-mono text-primary hover:underline cursor-pointer"
                  >
                    SPX-1942-8874 (Delivered NY)
                  </button>
                </div>
              </div>
            </div>

            {selectedShipmentDetail ? (
              <div className="space-y-8">
                {/* Visual Step-Indicator Progress Tracker */}
                <ShipmentProgressTracker
                  status={selectedShipmentDetail.status}
                  history={selectedShipmentDetail.history}
                  trackingId={selectedShipmentDetail.id}
                  courier={selectedShipmentDetail.courier}
                  origin={selectedShipmentDetail.origin}
                  destination={selectedShipmentDetail.destination}
                  estimatedDelivery={selectedShipmentDetail.estimatedDelivery}
                  currentLocation={
                    selectedShipmentDetail.history.filter(h => h.completed).slice(-1)[0]?.location
                  }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT/MID: Visual tracking Map Deck */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass-card p-6 relative border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Operational Route Map</span>
                        <span className="text-sm font-bold text-slate-900 leading-none">
                          {selectedShipmentDetail.origin} → {selectedShipmentDetail.destination}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                        Carrier: {selectedShipmentDetail.courier.toUpperCase()}
                      </span>
                    </div>

                    {/* Light World Map SVG Visualizer */}
                    <div className="h-96 rounded-2xl border border-slate-200 bg-slate-50/80 relative overflow-hidden flex items-center justify-center grid-bg shadow-inner">
                      <svg className="absolute w-full h-full p-4" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g fill="rgba(15,23,42,0.06)" stroke="rgba(15,23,42,0.12)" strokeWidth="0.5">
                          <path d="M40 30 L80 30 L110 50 L100 80 L70 90 L30 70 Z" />
                          <path d="M80 95 L110 110 L100 160 L85 180 L75 140 Z" />
                          <path d="M150 90 Q170 80 190 90 L210 120 L195 170 L180 170 L170 140 L145 110 Z" />
                          <path d="M140 40 L180 30 L200 50 L190 75 L150 70 L140 55 Z" />
                          <path d="M210 40 L310 35 L330 70 L310 110 L260 115 L215 80 Z" />
                          <path d="M300 140 L330 135 L340 160 L310 170 Z" />
                        </g>
                        <motion.path
                          d={arcPath}
                          stroke="#16a34a"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: 'easeInOut' }}
                        />
                        <circle cx={origin.x} cy={origin.y} r="4" fill="#16a34a" className="animate-pulse-glow" />
                        <circle cx={destination.x} cy={destination.y} r="4" fill="#16a34a" className="animate-pulse-glow" />
                        <motion.circle r="4" fill="#16a34a" filter="drop-shadow(0 0 3px #16a34a)">
                          <animateMotion path={arcPath} dur="5s" repeatCount="indefinite" />
                        </motion.circle>
                      </svg>

                      <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-xl text-left shadow-md">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Origin</p>
                        <p className="text-slate-900 font-bold leading-none mt-1 text-xs">{origin.name}</p>
                      </div>
                      <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-xl text-right shadow-md">
                        <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Destination</p>
                        <p className="text-slate-900 font-bold leading-none mt-1 text-xs">{destination.name}</p>
                      </div>
                    </div>

                    {/* Geodesic Corridor Telemetry */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Flight Corridor</span>
                        <span className="text-xs font-bold text-slate-900 font-mono">LOS → {selectedShipmentDetail.destination.includes('London') ? 'LHR' : selectedShipmentDetail.destination.includes('Toronto') ? 'YYZ' : selectedShipmentDetail.destination.includes('New York') ? 'JFK' : 'DXB'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Great-Circle Dist.</span>
                        <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                          {selectedShipmentDetail.destination.includes('London') ? '2,750 NM' : selectedShipmentDetail.destination.includes('Toronto') ? '4,820 NM' : selectedShipmentDetail.destination.includes('New York') ? '4,560 NM' : '3,210 NM'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Freighter Linehaul</span>
                        <span className="text-xs font-bold text-slate-900 font-mono">B777F Direct Cargo</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Customs Pre-filing</span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">Electronic Form M / AWB</span>
                      </div>
                    </div>
                  </Card>

                  {/* Quick courier details card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card p-5 flex items-center gap-4 border border-slate-200/90 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
                        <PackageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Weight</span>
                        <span className="text-sm font-bold text-slate-900">{selectedShipmentDetail.weight} kg</span>
                      </div>
                    </Card>

                    <Card className="glass-card p-5 flex items-center gap-4 border border-slate-200/90 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
                        <ClockIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Est. Delivery</span>
                        <span className="text-sm font-bold text-slate-900">{selectedShipmentDetail.estimatedDelivery}</span>
                      </div>
                    </Card>

                    <Card className="glass-card p-5 flex items-center gap-4 border border-slate-200/90 shadow-sm">
                      <CourierLogo brand={selectedShipmentDetail.courier} size="sm" withGlassContainer={false} />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Carrier</span>
                        <span className="text-sm font-bold text-slate-900 capitalize">{selectedShipmentDetail.courier}</span>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* RIGHT: Shipment Checkpoints Timeline */}
                <div>
                  <Card className="glass-card p-6 h-full flex flex-col justify-between border border-slate-200/90 shadow-sm">
                    <div>
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Status Ledger</span>
                        <h3 className="text-sm font-bold text-slate-900">{selectedShipmentDetail.id}</h3>
                      </div>

                      {/* Timeline steps */}
                      <div className="relative pl-7 space-y-8 text-left">
                        <div className="absolute left-3 top-3 bottom-3 w-[2px] bg-slate-200 rounded-full" />
                        {selectedShipmentDetail.history.map((step, idx) => {
                          const isCurrentActive = step.completed && (idx === selectedShipmentDetail.history.length - 1 || !selectedShipmentDetail.history[idx + 1].completed)
                          return (
                            <div key={idx} className="relative">
                              <span 
                                className={cn(
                                  "absolute -left-7 top-1 w-2.5 h-2.5 rounded-full border border-white z-10 transition-all duration-500",
                                  step.completed ? "bg-primary scale-110 shadow-[0_0_8px_rgba(22,163,74,0.6)]" : "bg-slate-200"
                                )}
                              />
                              <div>
                                <p 
                                  className={cn(
                                    "text-sm font-bold leading-none mb-1.5 transition-colors",
                                    step.completed ? "text-slate-900" : "text-slate-400"
                                  )}
                                >
                                  {step.status}
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{step.location}</p>
                                <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">{step.time}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 mt-8 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><InfoIcon className="w-4 h-4 text-primary" /> Internal Record</span>
                      <span className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">Help Desk</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

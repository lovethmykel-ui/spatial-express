import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  MessageCircleIcon, 
  MapPinIcon, 
  CalculatorIcon, 
  CalendarIcon, 
  SearchIcon, 
  Globe2Icon, 
  TruckIcon, 
  PackageIcon,
  ChevronDownIcon
} from '../components/ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CountryFlag } from '../components/ui/CountryFlag'
import { CourierLogo } from '../components/ui/CourierLogo'
import { InteractiveMap } from '../components/InteractiveMap'
import { ShipmentProgressTracker } from '../components/ShipmentProgressTracker'
import { cn } from '../lib/utils'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
}

export default function LandingPage() {
  const { 
    setActiveView, 
    setActivePortal,
    calculatorForm, 
    setCalculatorForm,
    setCalculatorResults,
    priceMatrix,
    shipments,
    setSelectedTrackingId,
    bookPickupBooking
  } = useLogistics()

  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  
  // Hero tabs state: quote vs pickup vs track
  const [activeHeroTab, setActiveHeroTab] = useState<'quote' | 'pickup' | 'track'>('quote')
  const [heroTrackId, setHeroTrackId] = useState('')
  const [heroTrackError, setHeroTrackError] = useState('')
  const [isVolumetricOpen, setIsVolumetricOpen] = useState(false)
  const [dimensions, setDimensions] = useState({ length: 30, width: 25, height: 20 })
  const [heroPickup, setHeroPickup] = useState({
    address: '4 Victory Street, off Police Post, Eliozu, Port Harcourt',
    date: '2026-07-25',
    time: '10:00 AM - 01:00 PM',
    courier: 'dhl',
  })

  // Calculated volumetric weight: (L * W * H) / 5000
  const volumetricWeight = Math.max(0.5, Number(((dimensions.length * dimensions.width * dimensions.height) / 5000).toFixed(1)))
  const chargeableWeight = isVolumetricOpen 
    ? Math.max(calculatorForm.weight, volumetricWeight) 
    : calculatorForm.weight

  // Carrier rate estimates computed on the fly
  const getCarrierEstimates = () => {
    const w = chargeableWeight
    return [
      {
        id: 'dhl',
        name: 'DHL Express Worldwide',
        speed: '1–3 Business Days',
        badge: 'Fastest Transit',
        price: priceMatrix['dhl']?.[w] || Math.round(18500 * (w / 1.5)),
        logo: 'dhl'
      },
      {
        id: 'fedex',
        name: 'FedEx International Priority',
        speed: '2–4 Business Days',
        badge: 'Recommended',
        price: priceMatrix['fedex']?.[w] || Math.round(17200 * (w / 1.5)),
        logo: 'fedex'
      },
      {
        id: 'ups',
        name: 'UPS Worldwide Express Saver',
        speed: '2–5 Business Days',
        badge: 'Lowest Rate',
        price: priceMatrix['ups']?.[w] || Math.round(16400 * (w / 1.5)),
        logo: 'ups'
      },
      {
        id: 'aramex',
        name: 'Aramex International Parcel',
        speed: '3–6 Business Days',
        badge: 'Standard Economy',
        price: priceMatrix['aramex']?.[w] || Math.round(14900 * (w / 1.5)),
        logo: 'aramex'
      }
    ]
  }

  const carrierEstimates = getCarrierEstimates()

  // Real institutional logistics proof metrics
  const institutionalStats = [
    { value: '5,000+', unit: 'Deliveries Completed', context: '99.4% on-time SLA adherence across UK, US, and EU' },
    { value: '194', unit: 'Countries Connected', context: 'Direct airline customs brokerage with Form M filing' },
    { value: '24–72h', unit: 'Direct Express Transit', context: 'Daily scheduled freighter departures from Lagos (LOS)' },
    { value: '55%', unit: 'Tariff Savings vs Retail', context: 'Wholesale aggregate carrier contract margins passed to clients' }
  ]

  const faqs = [
    { 
      q: 'How does Spatial Express calculate and discount international shipping rates?', 
      a: 'We aggregate multi-carrier volume contract tariffs from DHL, FedEx, UPS, and Aramex. Based on your destination country and either actual deadweight or volumetric weight ((L × W × H) / 5000), our engine returns wholesale discount tariffs up to 55% lower than retail carrier counter prices.' 
    },
    { 
      q: 'Do you handle customs documentation, Form M, and import duties in Nigeria and destination ports?', 
      a: 'Yes. Our licensed brokerage team prepares all commercial invoices, air waybill manifests, and export declarations. For inbound imports, we manage duty clearance with Nigeria Customs Service; for international exports, we provide pre-paid DDP (Delivered Duty Paid) or recipient DDU options.' 
    },
    { 
      q: 'How does doorstep pickup work across Port Harcourt, Lagos, and other Nigerian cities?', 
      a: 'Once booked online, our dispatch operations team sends an insured courier van directly to your registered home, warehouse, or commercial office. Packages are weighed, barcode-labeled on-site, and transferred to our airport sorting hub within 4 hours.' 
    },
    { 
      q: 'What compensation or insurance coverage is provided for high-value cargo?', 
      a: 'All shipments include standard carrier liability up to $100. For electronics, machinery, and luxury inventory, we offer 100% comprehensive declared-value cargo transit insurance covering loss, damage, and transit delays for a 1.5% premium.' 
    }
  ]

  const handleQuickQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCalculatorResults(carrierEstimates)
    setActiveView('calculator')
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = heroTrackId.trim().toUpperCase()
    const found = shipments.find(s => s.id.toUpperCase() === query)
    if (found) {
      setSelectedTrackingId(found.id)
      setActiveView('tracking')
    } else {
      setHeroTrackError('Tracking number not found. Try sample: SPX-8294-0921')
    }
  }

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bookPickupBooking({
      pickupAddress: heroPickup.address,
      preferredDate: heroPickup.date,
      preferredTime: heroPickup.time,
      courierPreference: heroPickup.courier,
      packageDescription: `${calculatorForm.packageType} (${chargeableWeight} kg)`,
      insurance: calculatorForm.insurance
    })
    setActivePortal('customer')
    setActiveView('dashboard')
  }

  return (
    <div className="space-y-24 pb-16 select-none overflow-x-hidden text-left">
      
      {/* 1. HERO SECTION: DOMINANT FOCAL CARRIER WITH OPERATIONAL COCKPIT */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-sm p-6 sm:p-10 lg:p-14">
        
        {/* Ambient backdrop grid & soft freight gradient */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-teal-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl space-y-6">
          
          {/* Metadata Kicker without Pill Enclosures */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-primary font-bold">Spatial Express OS</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Direct Air Cargo & Ocean Freight</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>194 Destination Countries</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>IATA & ISO 9001 Compliant</span>
          </div>

          {/* Authority Headline with balanced wrapping */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-3xl font-display text-balance">
            Cross-Border Freight Logistics. <br />
            <span className="text-primary">Engineered for Speed.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-body">
            Direct courier tariff aggregation, automated customs manifests, and scheduled doorstep pickups connecting Nigerian businesses to London, New York, Toronto, Frankfurt, and Dubai.
          </p>

          {/* Operational Cockpit: Multi-Modal Booking & Tracking Widget */}
          <div className="mt-8 pt-4">
            
            {/* Functional Segmented Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-6">
              {[
                { id: 'quote', label: '01. Instant Rate Quote', icon: CalculatorIcon },
                { id: 'pickup', label: '02. Book Doorstep Pickup', icon: CalendarIcon },
                { id: 'track', label: '03. Live Radar Tracking', icon: SearchIcon }
              ].map(tab => {
                const Icon = tab.icon
                const isActive = activeHeroTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveHeroTab(tab.id as any)
                      setHeroTrackError('')
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-2.5",
                      isActive 
                        ? "border-primary text-slate-900 font-bold" 
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-slate-400")} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB 1: QUICK RATE CALCULATOR */}
            <AnimatePresence mode="wait">
              {activeHeroTab === 'quote' && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleQuickQuoteSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
                    
                    {/* Origin */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Origin Port / City
                      </label>
                      <div className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                        <CountryFlag countryCode="NG" size="md" />
                        <span className="text-xs font-semibold text-slate-900 truncate">Nigeria (LOS / PHC)</span>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Destination Country
                      </label>
                      <div className="h-11 px-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                        <CountryFlag 
                          countryCode={
                            calculatorForm.destination === 'United Kingdom' ? 'GB' :
                            calculatorForm.destination === 'United States' ? 'US' :
                            calculatorForm.destination === 'Canada' ? 'CA' :
                            calculatorForm.destination === 'Germany' ? 'DE' :
                            calculatorForm.destination === 'United Arab Emirates' ? 'AE' : 'CN'
                          } 
                          size="md" 
                          className="shrink-0"
                        />
                        <select
                          value={calculatorForm.destination}
                          onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, destination: e.target.value }))}
                          className="w-full bg-transparent text-xs font-semibold text-slate-900 border-none outline-none cursor-pointer pr-1"
                        >
                          <option value="United Kingdom">United Kingdom (LHR)</option>
                          <option value="United States">United States (JFK / IAH)</option>
                          <option value="Canada">Canada (YYZ / YVR)</option>
                          <option value="Germany">Germany (FRA)</option>
                          <option value="United Arab Emirates">United Arab Emirates (DXB)</option>
                          <option value="China">China (CAN / PVG)</option>
                        </select>
                      </div>
                    </div>

                    {/* Weight (kg) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Actual Weight
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsVolumetricOpen(!isVolumetricOpen)}
                          className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                        >
                          {isVolumetricOpen ? 'Hide CBM' : '+ Dim Weight'}
                        </button>
                      </div>
                      <div className="h-11 px-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                        <input
                          type="number"
                          step="0.5"
                          min="0.2"
                          max="500"
                          value={calculatorForm.weight}
                          onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, weight: parseFloat(e.target.value) || 1 }))}
                          className="w-full bg-transparent text-xs font-semibold text-slate-900 border-none outline-none font-mono"
                        />
                        <span className="text-[11px] font-bold text-slate-400 font-mono">KG</span>
                      </div>
                    </div>

                    {/* Cargo Classification */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Commodity Type
                      </label>
                      <select
                        value={calculatorForm.packageType}
                        onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, packageType: e.target.value }))}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 border-none outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="Parcel">Commercial Goods & Samples</option>
                        <option value="Documents">Legal & Bank Documents</option>
                        <option value="Electronics">Electronics & Hardware</option>
                        <option value="Apparel">Fashion & Textiles</option>
                        <option value="Freight Pallet">Heavy Pallet Cargo</option>
                      </select>
                    </div>

                    {/* Action Button */}
                    <div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <span>Compare Rates</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                  </form>

                  {/* Optional Volumetric Dim Calculator Dropdown */}
                  {isVolumetricOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center gap-4 text-xs"
                    >
                      <span className="font-bold text-slate-700">Dimensions (cm):</span>
                      <div className="flex items-center gap-2 font-mono">
                        <label className="text-slate-500">L</label>
                        <input
                          type="number"
                          value={dimensions.length}
                          onChange={(e) => setDimensions(d => ({ ...d, length: parseFloat(e.target.value) || 1 }))}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                        />
                        <span className="text-slate-400">×</span>
                        <label className="text-slate-500">W</label>
                        <input
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => setDimensions(d => ({ ...d, width: parseFloat(e.target.value) || 1 }))}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                        />
                        <span className="text-slate-400">×</span>
                        <label className="text-slate-500">H</label>
                        <input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => setDimensions(d => ({ ...d, height: parseFloat(e.target.value) || 1 }))}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 text-xs"
                        />
                      </div>
                      <div className="text-slate-600 font-mono">
                        Volumetric: <strong className="text-slate-900">{volumetricWeight} kg</strong> · Chargeable: <strong className="text-primary">{chargeableWeight} kg</strong>
                      </div>
                    </motion.div>
                  )}

                  {/* Live Carrier Rates Matrix Preview */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Negotiated Carrier Rates for {calculatorForm.destination} ({chargeableWeight} kg):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {carrierEstimates.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setCalculatorResults(carrierEstimates)
                            setActiveView('calculator')
                          }}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{c.name.split(' ')[0]}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{c.speed}</span>
                          </div>
                          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="text-xs text-slate-500 font-medium">{c.badge}</span>
                            <span className="text-sm font-extrabold text-slate-900 font-mono">
                              ₦{c.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: SCHEDULE DOORSTEP PICKUP */}
              {activeHeroTab === 'pickup' && (
                <motion.div
                  key="pickup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handlePickupSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
                    
                    <div className="space-y-1.5 lg:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Collection Address in Nigeria
                      </label>
                      <input
                        type="text"
                        required
                        value={heroPickup.address}
                        onChange={(e) => setHeroPickup(p => ({ ...p, address: e.target.value }))}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Preferred Pickup Date
                      </label>
                      <input
                        type="date"
                        required
                        value={heroPickup.date}
                        onChange={(e) => setHeroPickup(p => ({ ...p, date: e.target.value }))}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <TruckIcon className="w-4 h-4 text-white" />
                        <span>Dispatch Courier</span>
                      </Button>
                    </div>

                  </form>
                </motion.div>
              )}

              {/* TAB 3: LIVE PARCEL RADAR */}
              {activeHeroTab === 'track' && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
                    <div className="flex-1 w-full space-y-1">
                      <input
                        type="text"
                        required
                        placeholder="Enter tracking number (e.g. SPX-8294-0921)"
                        value={heroTrackId}
                        onChange={(e) => {
                          setHeroTrackId(e.target.value)
                          setHeroTrackError('')
                        }}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-primary font-mono placeholder:text-slate-400"
                      />
                      {heroTrackError && (
                        <p className="text-[11px] text-rose-600 font-medium pl-1">{heroTrackError}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                    >
                      <SearchIcon className="w-3.5 h-3.5 mr-1.5" />
                      Track Waybill
                    </Button>
                  </form>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>Quick Test Identifiers:</span>
                    <button type="button" onClick={() => setHeroTrackId('SPX-8294-0921')} className="font-mono text-primary hover:underline cursor-pointer">SPX-8294-0921 (In Transit)</button>
                    <span>·</span>
                    <button type="button" onClick={() => setHeroTrackId('SPX-5021-3910')} className="font-mono text-primary hover:underline cursor-pointer">SPX-5021-3910 (Customs)</button>
                    <span>·</span>
                    <button type="button" onClick={() => setHeroTrackId('SPX-1942-8874')} className="font-mono text-primary hover:underline cursor-pointer">SPX-1942-8874 (Delivered)</button>
                  </div>

                  {/* Instant Telemetry Stage Preview */}
                  {(() => {
                    const matchedShipment = shipments.find(s => s.id.toLowerCase() === heroTrackId.trim().toLowerCase())
                    if (!matchedShipment) return null
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 max-w-3xl"
                      >
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Instant Telemetry Snapshot
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTrackingId(matchedShipment.id)
                              setActiveView('tracking')
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Open Full Flight Corridor →
                          </button>
                        </div>
                        <ShipmentProgressTracker
                          status={matchedShipment.status}
                          history={matchedShipment.history}
                          trackingId={matchedShipment.id}
                          courier={matchedShipment.courier}
                          origin={matchedShipment.origin}
                          destination={matchedShipment.destination}
                          estimatedDelivery={matchedShipment.estimatedDelivery}
                          currentLocation={
                            matchedShipment.history.filter(h => h.completed).slice(-1)[0]?.location
                          }
                          onStageClick={() => {
                            setSelectedTrackingId(matchedShipment.id)
                            setActiveView('tracking')
                          }}
                        />
                      </motion.div>
                    )
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </section>

      {/* 2. INSTITUTIONAL METRICS BAR */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {institutionalStats.map(s => (
          <div 
            key={s.unit} 
            className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight font-mono tabular-nums">
                {s.value}
              </p>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1">
                {s.unit}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-4 pt-3 border-t border-slate-100">
              {s.context}
            </p>
          </div>
        ))}
      </section>

      {/* 2.5 INTEGRATED CARRIER NETWORK */}
      <section className="p-8 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Aggregated Global Carrier Network
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated API routing across tier-1 international freight handlers with real-time customs brokerage.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 font-mono">
            5 Integrated Operators Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'dhl', name: 'DHL Express', speed: '24–72h Delivery', badge: 'Air Express' },
            { id: 'fedex', name: 'FedEx Priority', speed: '48–96h Delivery', badge: 'Cargo Priority' },
            { id: 'ups', name: 'UPS Worldwide', speed: '2–5 Days', badge: 'Economy Saver' },
            { id: 'aramex', name: 'Aramex Cargo', speed: '3–6 Days', badge: 'Middle East & Asia' },
            { id: 'ems', name: 'EMS International', speed: '5–8 Days', badge: 'Postal Network' },
          ].map(carrier => (
            <div 
              key={carrier.id} 
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              <div className="h-10 flex items-center mb-3">
                <img 
                  src={`/courier badges/${carrier.id}.png`} 
                  alt={carrier.name} 
                  className="max-h-8 max-w-full object-contain" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">{carrier.name}</p>
                <p className="text-[10px] text-slate-500 font-medium font-mono">{carrier.speed}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CAPABILITIES BENTO GRID (WITH HUMAN EDITORIAL NUMBERING) */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Enterprise Freight Infrastructure
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
            Operational Capabilities
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            From scheduled pallet cargo flights to on-demand driver dispatch, every stage of transit is monitored in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Capability 01: Air Freight (Spans 2 cols) */}
          <div className="md:col-span-2 p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 font-mono">01. Scheduled Air Cargo Freight</span>
              <h3 className="text-2xl font-bold text-slate-900 font-display">
                Dedicated Cargo Hold Allocations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Daily belly-cargo and dedicated freighter space on British Airways, Emirates SkyCargo, Qatar Airways, and Delta Air Lines departing Murtala Muhammed Airport (LOS) and Port Harcourt (PHC). Guaranteed airport dispatch within 24 hours of sorting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-900">Heathrow (LHR)</p>
                <p className="text-slate-500 font-mono text-[11px]">Daily 14:00 Dep · 24h Transit</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">New York (JFK)</p>
                <p className="text-slate-500 font-mono text-[11px]">Daily 18:30 Dep · 48h Transit</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Dubai (DXB)</p>
                <p className="text-slate-500 font-mono text-[11px]">Daily 21:00 Dep · 36h Transit</p>
              </div>
            </div>
          </div>

          {/* Capability 02: Customs Brokerage */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 font-mono">02. Customs Clearance Brokerage</span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Automated Tariff & Form M Filing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full compliance with Nigeria Customs Service, UK HMRC, and US CBP. Pre-clearance manifests prevent terminal dwell times and unexpected detention penalties.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-900">✓ Electronic HS Code Matching</p>
              <p className="font-semibold text-slate-900">✓ Pre-Calculated VAT & Duties</p>
            </div>
          </div>

          {/* Capability 03: Door-to-Door Pickup */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 font-mono">03. First & Last-Mile Road Freight</span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                On-Demand Dispatch Fleet
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Licensed driver network in Lagos, Port Harcourt, Abuja, and Kano. Collection vans equipped with digital scales, barcode printers, and insured cargo lockboxes.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              Average collection arrival: <strong>120 mins</strong>
            </div>
          </div>

          {/* Capability 04: Ocean Freight Consolidation (Spans 2 cols) */}
          <div className="md:col-span-2 p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 font-mono">04. Ocean LCL & Full Container Loads</span>
              <h3 className="text-2xl font-bold text-slate-900 font-display">
                Maritime Freight Forwarding
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Weekly container consolidation runs from Lagos Apapa port to Rotterdam, Felixstowe, Houston, and Antwerp. Tailored for commercial machinery, raw materials, and high-volume retail pallets.
              </p>
            </div>
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600 font-mono">
              <span>Standard 20ft / 40ft FCL</span>
              <span>·</span>
              <span>LCL Shared Consolidation</span>
              <span>·</span>
              <span>Port-to-Port Bills of Lading</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE GLOBAL FREIGHT LANES RADAR */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Live Route Telemetry</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
              Active Intercontinental Freight Lanes
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Primary Hub: Lagos, NG (LOS / 6.5244° N, 3.3792° E)
          </div>
        </div>

        <div className="h-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm relative">
          <InteractiveMap 
            markers={[
              { name: "Lagos Hub (LOS)", coordinates: [3.3792, 6.5244], id: "los" },
              { name: "Port Harcourt (PHC)", coordinates: [7.0498, 4.8156], id: "phc" },
              { name: "London Heathrow (LHR)", coordinates: [-0.4543, 51.4700], id: "lhr" },
              { name: "New York (JFK)", coordinates: [-73.7781, 40.6413], id: "jfk" },
              { name: "Houston Cargo (IAH)", coordinates: [-95.3414, 29.9844], id: "iah" },
              { name: "Dubai Cargo (DXB)", coordinates: [55.3644, 25.2532], id: "dxb" },
              { name: "Toronto (YYZ)", coordinates: [-79.6248, 43.6777], id: "yyz" }
            ]}
          />
        </div>
      </section>

      {/* 5. VERIFIED CLIENT PROOF & CASE STUDY */}
      <section className="p-8 sm:p-12 rounded-3xl border border-slate-200 bg-white shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Verified Case Study · Port Harcourt to London
          </span>
          <blockquote className="text-lg sm:text-xl font-medium text-slate-900 font-display leading-relaxed">
            "Spatial Express handles our wholesale shipments to salons in London and Manchester. What used to take days of phone calls and uncertain customs hold-ups is now automated: one rate comparison, on-demand courier pickup at our Port Harcourt facility, and door-to-door delivery within 48 hours."
          </blockquote>
          
          <div className="pt-2 text-xs text-slate-600">
            <strong className="text-slate-900 block text-sm">Chloe Okafor</strong>
            <span>Founder & Managing Director, Velvet Essence Cosmetics</span>
            <div className="mt-3 flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>420+ Shipments Managed</span>
              <span>·</span>
              <span>0 Customs Delays in 2026</span>
              <span>·</span>
              <span>Avg Transit: 41 hours</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Operational Snapshot</h4>
          <div className="space-y-2.5 font-mono">
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Routing Lane:</span>
              <span className="font-bold text-slate-900">PHC → LOS → LHR</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Carrier Partner:</span>
              <span className="font-bold text-slate-900">DHL Express Air</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Volume Savings:</span>
              <span className="font-bold text-emerald-600">42% vs Counter Rates</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customs Clearance:</span>
              <span className="font-bold text-slate-900">Automated UK DDP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMMON OBJECTIONS & QUESTIONS (FAQ) */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Clear Answers for Cross-Border Shippers
          </h2>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <div 
                key={index} 
                className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-sm font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <span>{faq.q}</span>
                  <span className="text-primary font-mono text-base shrink-0 ml-4">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100"
                    >
                      <p className="pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* 7. FINAL CONVERSION BLOCK */}
      <section className="p-10 sm:p-14 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 text-left">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Ready to Dispatch Your Next Consignment?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Lock in negotiated carrier volume tariffs in seconds. Automated commercial invoices, door collection, and continuous tracking included.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => {
              setActiveView('calculator')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="h-12 px-6 bg-primary hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Calculate Shipping Cost
          </Button>
        </div>
      </section>

    </div>
  )
}

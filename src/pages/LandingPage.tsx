import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, CheckCircle2Icon, ChevronRightIcon, MessageCircleIcon, MapPinIcon, CalculatorIcon, HelpCircleIcon, CalendarIcon, SearchIcon, AlertTriangleIcon, Globe2Icon, TruckIcon, PackageIcon } from '../components/ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CountryFlag } from '../components/ui/CountryFlag'
import { useState } from 'react'
import { InteractiveMap } from '../components/InteractiveMap'
import { cn } from '../lib/utils'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
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
  
  // Hero tabs state
  const [activeHeroTab, setActiveHeroTab] = useState<'quote' | 'pickup' | 'track'>('quote')
  const [heroTrackId, setHeroTrackId] = useState('')
  const [heroTrackError, setHeroTrackError] = useState('')
  const [heroPickup, setHeroPickup] = useState({
    address: '4 Victory Street, Port Harcourt',
    date: '2026-07-14',
    time: '10:00 AM - 01:00 PM',
  })

  // Live updates feed ticker
  const liveUpdates = [
    { text: 'Package delivered to Toronto, Canada', time: '2 mins ago', code: 'CA' },
    { text: 'Shipment picked up in Lagos, Nigeria', time: '8 mins ago', code: 'NG' },
    { text: 'Parcel arrived at London Hub, UK', time: '15 mins ago', code: 'GB' },
    { text: 'Package cleared customs in New York, USA', time: '22 mins ago', code: 'US' }
  ]

  const stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '5,000+', label: 'Successful Deliveries' },
    { value: '200+', label: 'Countries Serviced' },
    { value: '99%', label: 'Customer Satisfaction' }
  ]

  const faqs = [
    { q: 'How does Spatial Express calculate prices?', a: 'We aggregate shipping rates from top carriers like DHL, FedEx, and UPS. Based on your parcel destination and weight, we display negotiated discount rates automatically.' },
    { q: 'Do you handle customs clearance in Nigeria and abroad?', a: 'Yes! We handle all customs documentation brokerage. Import duties and VAT options can be pre-calculated or billed directly to recipients.' },
    { q: 'How do I book a courier pickup?', a: 'You can book a pickup directly from your Client Dashboard. Select your date, preferred pickup time window, address, and courier preference, and a driver will be dispatched.' }
  ]

  const handleQuickQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weightVal = calculatorForm.weight
    const results = [
      { id: 'dhl', name: 'DHL Express', price: priceMatrix['dhl']?.[weightVal] || 16500, time: '1-3 Business Days', logo: '/courier badges/dhl.png', badge: 'Fastest' },
      { id: 'fedex', name: 'FedEx Express', price: priceMatrix['fedex']?.[weightVal] || 15800, time: '2-4 Business Days', logo: '/courier badges/fedex.png', badge: 'Recommended' },
      { id: 'ups', name: 'UPS Worldwide', price: priceMatrix['ups']?.[weightVal] || 15300, time: '2-5 Business Days', logo: '/courier badges/ups.png', badge: 'Cheapest' },
      { id: 'aramex', name: 'Aramex International', price: priceMatrix['aramex']?.[weightVal] || 14300, time: '3-6 Business Days', logo: '/courier badges/aramex.png' }
    ]

    setCalculatorResults(results)
    setActiveView('calculator')
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = shipments.find(s => s.id.toLowerCase() === heroTrackId.trim().toLowerCase())
    if (found) {
      setSelectedTrackingId(found.id)
      setActiveView('tracking')
    } else {
      setHeroTrackError('Invalid tracking ID. Try "SPX-8294-0921".')
    }
  }

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bookPickupBooking({
      pickupAddress: heroPickup.address,
      preferredDate: heroPickup.date,
      preferredTime: heroPickup.time,
      courierPreference: 'dhl',
      packageDescription: 'Parcel Cargo',
      insurance: true
    })
    setActivePortal('customer')
    setActiveView('dashboard')
  }

  return (
    <div className="space-y-24 pb-12 select-none overflow-x-hidden">
      
      {/* 1. HERO COMMAND CENTER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden min-h-[750px] flex flex-col justify-between p-8 md:p-14 lg:p-20 gap-8 text-left border border-white/5 shadow-2xl"
      >
        {/* Deep Space Liquid Glass Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <img src="/hero.jpeg" alt="Hero Background" className="w-full h-full object-cover opacity-[0.25] mix-blend-screen scale-105 filter saturate-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        </div>

        {/* Top: Text Content */}
        <div className="relative z-10 max-w-3xl space-y-8 mt-12">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.05]"
          >
            International <br />
            Shipping <br />
            <span className="text-primary italic">Reimagined.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl font-body">
              Compare negotiated rates from top global carriers and ship your parcels with true peace of mind. Fast, secure, and fully tracked.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow" />
                Nigeria's Trusted Shipping Partner
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Liquid Glass Interactive Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          className="relative z-10 w-full max-w-5xl mt-auto"
        >
          {/* Tab Headers & SLA Trust Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-6 md:gap-8">
              {[
                { id: 'quote', label: 'Quick Quote' },
                { id: 'pickup', label: 'Book Pickup' },
                { id: 'track', label: 'Track Parcel' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveHeroTab(tab.id as any)
                    setHeroTrackError('')
                  }}
                  className="relative font-semibold text-sm pb-2 transition-colors cursor-pointer outline-none"
                >
                  <span className={cn("relative z-10", activeHeroTab === tab.id ? "text-text font-bold" : "text-text-secondary hover:text-text")}>
                    {tab.label}
                  </span>
                  {activeHeroTab === tab.id && (
                    <motion.div 
                      layoutId="heroTab"
                      className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* SLA Guarantee Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary self-start sm:self-auto font-mono">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>99.4% On-Time SLA Guarantee</span>
            </div>
          </div>
          
          {/* Form Area */}
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-end md:items-center gap-6 w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <AnimatePresence mode="wait">
              {activeHeroTab === 'quote' && (
                <motion.form 
                  key="quote"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleQuickQuoteSubmit} 
                  className="flex-1 w-full flex flex-col md:flex-row items-center gap-5"
                >
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Origin</label>
                    <div className="bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                      <CountryFlag countryCode="NG" size="md" />
                      <span className="text-sm text-white font-medium">Nigeria</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Destination</label>
                    <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 flex items-center gap-3 focus-within:border-primary/50 transition-colors overflow-hidden">
                      <CountryFlag 
                        countryCode={calculatorForm.destination === 'United Kingdom' ? 'GB' : calculatorForm.destination === 'United States' ? 'US' : calculatorForm.destination === 'Canada' ? 'CA' : 'DE'} 
                        size="md" 
                        className="flex-shrink-0"
                      />
                      <select 
                        value={calculatorForm.destination}
                        onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, destination: e.target.value }))}
                        className="w-full bg-transparent py-3.5 text-sm text-white font-medium appearance-none cursor-pointer outline-none border-none ring-0"
                      >
                        <option value="United Kingdom" className="bg-background text-white">United Kingdom</option>
                        <option value="United States" className="bg-background text-white">United States</option>
                        <option value="Canada" className="bg-background text-white">Canada</option>
                        <option value="Germany" className="bg-background text-white">Germany</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full md:w-32 space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Weight</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={calculatorForm.weight}
                        onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, weight: parseFloat(e.target.value) || 1 }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">kg</span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto mt-4 md:mt-0 pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.15)] cursor-pointer"
                    >
                      Get Quote <ArrowRightIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.form>
              )}
              
              {activeHeroTab === 'track' && (
                <motion.form 
                  key="track"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleTrackSubmit} 
                  className="flex-1 w-full flex flex-col md:flex-row items-center gap-5 pt-2"
                >
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Tracking Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SPX-8294-0921"
                      value={heroTrackId}
                      onChange={(e) => setHeroTrackId(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {heroTrackError && <p className="text-[10px] text-danger mt-1 absolute">{heroTrackError}</p>}
                  </div>
                  <div className="w-full md:w-auto mt-4 md:mt-0 pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm px-10 py-4 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.15)] cursor-pointer"
                    >
                      Track Parcel
                    </motion.button>
                  </div>
                </motion.form>
              )}
              
              {activeHeroTab === 'pickup' && (
                <motion.form 
                  key="pickup"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handlePickupSubmit} 
                  className="flex-1 w-full flex flex-col md:flex-row items-center gap-5 pt-2"
                >
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Pickup Address</label>
                    <input 
                      type="text" 
                      value={heroPickup.address}
                      onChange={e => setHeroPickup(p => ({...p, address: e.target.value}))}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="w-full md:w-48 space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase pl-1">Date</label>
                    <input 
                      type="date" 
                      value={heroPickup.date}
                      onChange={e => setHeroPickup(p => ({...p, date: e.target.value}))}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="w-full md:w-auto mt-4 md:mt-0 pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.15)] cursor-pointer"
                    >
                      Schedule Pickup
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. STATS OVERVIEW - LIQUID GLASS STYLE */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map(s => (
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -5 }}
            key={s.label} 
            className="p-8 text-center flex flex-col justify-center items-center bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-xl"
          >
            <h3 className="text-4xl md:text-5xl font-black text-white font-display mb-2">{s.value}</h3>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 2.5 TRUSTED PARTNERS */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-5xl mx-auto py-10 border-y border-white/5 bg-white/[0.01]"
      >
        <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Our Trusted Shipping Partners</p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-90 px-4">
          {[
            { id: 'dhl', src: '/courier badges/dhl.png', alt: 'DHL' },
            { id: 'fedex', src: '/courier badges/fedex.png', alt: 'FedEx' },
            { id: 'ups', src: '/courier badges/ups.png', alt: 'UPS' },
            { id: 'aramex', src: '/courier badges/aramex.png', alt: 'Aramex' },
            { id: 'ems', src: '/courier badges/ems.png', alt: 'EMS' }
          ].map(partner => (
            <div key={partner.id} className="w-24 h-16 md:w-32 md:h-20 flex items-center justify-center glass-panel rounded-2xl overflow-hidden p-3 hover:scale-105 transition-transform duration-300">
              <img src={partner.src} alt={partner.alt} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300 drop-shadow-md" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2.75 HOW IT WORKS */}
      <div className="space-y-10 mt-16 max-w-6xl mx-auto px-4 md:px-0">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border border-primary/20">
            Process
          </span>
          <h3 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight">How It <span className="text-primary italic">Works</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Ship internationally in 4 simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Calculate Price', desc: 'Enter your shipment details and get instant pricing from top carriers.' },
            { step: '2', title: 'Make Payment', desc: 'Pay securely via Paystack — cards, bank transfers and USSD accepted.' },
            { step: '3', title: 'We Pick Up', desc: 'We collect your package from your specified location across Nigeria.' },
            { step: '4', title: 'Ship & Track', desc: 'Package is shipped and tracked in real-time via the carrier website.' }
          ].map((s, i) => (
            <motion.div 
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-colors" />
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-black text-xl mb-6 shadow-glow">
                {s.step}
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-display">{s.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. BENTO GRID FEATURES (WHY US) */}
      <div className="space-y-10 mt-24 max-w-6xl mx-auto px-4 md:px-0">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border border-primary/20">
            Why Us
          </span>
          <h3 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight">Why Choose <span className="text-primary italic">Spatial Express?</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">We are committed to fast, reliable and affordable shipping worldwide.</p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
        >
          {/* Card 1: Spans 2 columns */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-[#0D1117] to-background border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 w-2/3 space-y-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mb-2 shadow-[0_0_20px_rgba(57,255,20,0.15)]">
                <Globe2Icon className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-white font-display">Global Network, Local Expertise</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Fast and reliable delivery worldwide. We reach over 190+ countries with our negotiated carrier rates. Whether it's London, New York, or Beijing, your package arrives safely.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-[400px] h-[300px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none">
              <InteractiveMap className="bg-transparent border-none shadow-none" markers={[{ name: "London", coordinates: [-0.12, 51.5], id: "lon" }, { name: "New York", coordinates: [-74.0, 40.7], id: "nyc" }, { name: "Beijing", coordinates: [116.4, 39.9], id: "pek" }]} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
              <CalculatorIcon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Transparent Pricing</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Transparent pricing, no hidden fees. Save up to 55% with our aggregate contract rates on premium couriers.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
              <TruckIcon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Door Pickup</h4>
            <p className="text-xs text-gray-400 leading-relaxed">We pick up from your doorstep anywhere in Nigeria within hours. Dedicated customer support team.</p>
          </motion.div>

          {/* Card 4: Spans 2 columns */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 hover:bg-white/[0.04] transition-colors overflow-hidden">
            <div className="flex-1 space-y-4 relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white mb-2">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-white font-display">Safe, Secure Handling</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Real-time tracking via official carriers. Secure handling of your packages. From fragile items to important documents, we treat every shipment with the utmost care.</p>
            </div>
            <div className="w-full md:w-5/12 -mr-8 -mb-16 max-h-56 md:max-h-none overflow-hidden flex items-center justify-center">
              <img src="/cartons.png.png" alt="Cartons" className="w-full h-auto max-h-64 object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] opacity-90 scale-110" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. LIVE UPDATES & TESTIMONIAL */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left items-stretch max-w-6xl mx-auto"
      >
        
        {/* Live shipments scroll (Spans 2/5) */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors">
          <div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-glow"></span>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Live Network Status</h3>
            </div>
            <div className="space-y-4">
              {liveUpdates.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-white/[0.02] pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <CountryFlag countryCode={item.code} size="sm" />
                    <span className="text-white/90 font-medium">{item.text}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer testimonial & Delivery Professional (Spans 3/5) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#0D1117] to-background border border-white/[0.05] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
          
          <div className="w-36 sm:w-48 shrink-0 flex items-center justify-center">
            <img src="/model1.png.png" alt="Delivery professional" className="w-full h-auto max-h-56 sm:max-h-72 object-contain rounded-2xl drop-shadow-2xl relative z-10 -mt-8 sm:-mt-16" />
          </div>
          
          <div className="flex-1 space-y-5 relative z-10">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Client Testimonial</h4>
            <p className="text-sm md:text-base text-gray-300 italic leading-relaxed font-display">
              "Spatial Express made my international shipping experience so easy. I was able to book DHL courier pickups from my salon in Port Harcourt, pay with Paystack, and track it straight to Heathrow. Truly seamless!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
              <div>
                <p className="text-sm font-bold text-white">Chloe Okafor</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Business Owner</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. FAQ SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="text-center mb-10">
          <h3 className="text-3xl font-black text-white font-display">Common Questions</h3>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <motion.div 
                key={index} 
                className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold text-white hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <span>{faq.q}</span>
                  <span className="text-primary text-xl font-light">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs text-gray-400 leading-relaxed border-t border-white/5"
                    >
                      <p className="pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 6. READY TO SHIP CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="max-w-5xl mx-auto bg-gradient-to-r from-[#0D1117] to-background border border-white/[0.05] rounded-[32px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 justify-between relative overflow-hidden mt-20 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent pointer-events-none" />
        
        <div className="flex-1 space-y-6 relative z-10 text-left">
          <h3 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-tight">Ready to Ship <br/><span className="text-primary italic">Today?</span></h3>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Get the best shipping rates in seconds. Book dispatch riders, calculate tariffs, and clear customs instantly.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveView('calculator')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="mt-4 bg-primary hover:bg-primary/90 text-black font-extrabold text-sm px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.2)] transition-all cursor-pointer border-none inline-flex items-center gap-2"
          >
            Calculate Shipping <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="w-full md:w-5/12 relative z-10 hidden md:block">
          <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(57,255,20,0.05)]">
            <img src="/Lady_with_gorgeous_smile_202607070210_2.jpeg" alt="Delivery scene" className="w-full h-auto object-cover scale-105 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050608]/90 to-transparent mix-blend-multiply" />
          </div>
        </div>
      </motion.div>

      {/* Floating WhatsApp Support Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/2347072644177"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-[0_8px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-40 transition-colors group cursor-pointer"
      >
        <MessageCircleIcon className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-[#0D1117] border border-white/10 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider select-none whitespace-nowrap shadow-xl">
          Chat Operations
        </span>
      </motion.a>

    </div>
  )
}

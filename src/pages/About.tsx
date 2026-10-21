import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldIcon, TargetIcon, CompassIcon, MapPinIcon, BuildingIcon, CalendarIcon } from '../components/ui/CustomIcons'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export default function About() {
  const [activeYear, setActiveYear] = useState('2026')

  const milestones = [
    { year: '2022', title: 'Operational Launch', desc: 'Spatial Express launched in Lagos with 5 initial domestic routes, offering freight forwarding brokerage services.' },
    { year: '2023', title: 'Carrier Integration Engine', desc: 'Released our proprietary pricing calculator integrating API feeds from DHL, FedEx, and UPS.' },
    { year: '2024', title: 'Global Network Expansion', desc: 'Opened regional processing centers in London Heathrow (LHR) and Houston Intercontinental (IAH).' },
    { year: '2025', title: 'Ocean & Land Consolidation', desc: 'Introduced LCL shipping aggregation and door-to-door road freight solutions.' },
    { year: '2026', title: 'Enterprise Logistics OS', desc: 'Rolled out Spatial Express OS, supporting automated zone matrices, price generators, and digital custom clearances.' }
  ]

  const leaders = [
    { name: 'Dr. James Adeniran', role: 'CEO & Co-Founder', img: '/improve_this_one_also_202607070210_3.jpeg', bio: 'Former freight forwarding chief with 15+ years managing sub-Saharan air cargo routes.' },
    { name: 'Sarah Bello', role: 'COO & Operations Lead', img: '/Lady_with_gorgeous_smile_202607070210_2.jpeg', bio: 'Logistics aggregation expert. Previously led routing optimizations at DHL West Africa.' }
  ]

  const locations = [
    { city: 'Lagos, Nigeria', address: '4 Victory Street, off Police Post, Eliozu, Port Harcourt', phone: '+234 707 264 4177', role: 'HQ Operations' },
    { city: 'London, UK', address: 'Heathrow Cargo Terminal 4, Hounslow TW6 3UA', phone: '+44 20 8745 3000', role: 'European Hub' },
    { city: 'Houston, USA', address: 'Intercontinental Cargo Center, Houston, TX 77032', phone: '+1 281 230 3100', role: 'North American Hub' },
    { city: 'Dubai, UAE', address: 'Cargo Terminal Gate 2, Dubai South Logistics City', phone: '+971 4 814 1111', role: 'Middle East Hub' }
  ]

  return (
    <div className="space-y-12 select-none pb-12">
      
      {/* Hero section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200/90 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 shadow-sm">
        <div className="flex-1 text-left space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-primary font-bold">Institutional Profile</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Est. 2022</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Lagos & Global Freight Corridors</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
            Connecting African Commerce to Global Corridors
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-body">
            Founded in 2022, Spatial Express Logistics was established on a single principle: cross-border air freight and ocean cargo shouldn't be a black box of hidden fees, manual paperwork, and fragmented tracking. 
          </p>
          <p className="text-sm text-slate-600 leading-relaxed font-body">
            By building a software-native freight aggregation engine, we unite scheduled international flights, automate Nigerian customs manifests, and deliver tariff transparency that empowers fast-growing exporters and multinational shippers alike.
          </p>
        </div>
        
        {/* Story Illustration Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="col-span-2 rounded-2xl overflow-hidden h-48 border border-slate-200 relative group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
            <img src="/images/shipping_cartons.png" alt="Shipping cartons" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 z-20">
              <p className="text-xs text-white italic font-medium">"Automated customs clearance and real-time flight telemetry."</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-center items-center text-center shadow-sm">
            <h3 className="text-4xl font-black text-primary font-display font-mono tabular-nums">5,000+</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Completed Freight Runs</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-center items-center text-center shadow-sm">
            <h3 className="text-4xl font-black text-primary font-display font-mono tabular-nums">194</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Destination Countries</p>
          </div>
        </div>
      </div>

      {/* Mission / Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200/90 text-left p-6 rounded-2xl shadow-sm">
          <CardHeader className="p-0 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-slate-600 leading-relaxed">
              To lower barriers to global trade for African businesses by supplying direct freight booking, automated duty estimations, and instant carrier route selection in a single operational dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200/90 text-left p-6 rounded-2xl shadow-sm">
          <CardHeader className="p-0 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CompassIcon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-slate-600 leading-relaxed">
              To become the default logistics operating system connecting African hubs to European, American, and Asian trading zones, blending automated software with world-class physical operations.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200/90 text-left p-6 rounded-2xl shadow-sm">
          <CardHeader className="p-0 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <ShieldIcon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Core Values</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrity and clarity above all. We display true shipping fees upfront, protect cargo values via comprehensive insurance routing, and respect security standards (WCAG AA & ISO-compliant).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Milestone Timeline Slider */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-left space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Historical Progress</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select a year below</span>
        </div>

        {/* Timeline Slider Navigation TABS */}
        <div className="flex justify-between max-w-xl mx-auto p-1.5 rounded-2xl bg-slate-100 border border-slate-200 relative">
          {milestones.map(m => {
            const isSelected = activeYear === m.year
            return (
              <button
                key={m.year}
                onClick={() => setActiveYear(m.year)}
                className={`relative py-2.5 px-6 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex-1 ${
                  isSelected ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="timeline-glow-bg"
                    className="absolute inset-0 bg-primary rounded-xl z-[-1] shadow-xs"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                {m.year}
              </button>
            )
          })}
        </div>

        {/* Animated Milestone Card */}
        <div className="min-h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {milestones.map(m => {
              if (m.year !== activeYear) return null
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl text-center space-y-3 bg-slate-50 border border-slate-200/80 p-6 rounded-2xl"
                >
                  <h4 className="text-lg font-extrabold text-slate-900 tracking-wide">{m.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto">{m.desc}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-left">Executive Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaders.map(l => (
            <div key={l.name} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center text-left p-5 gap-6 shadow-sm">
              <img src={l.img} alt={l.name} className="w-28 h-28 rounded-full sm:rounded-xl object-cover border border-emerald-100 bg-slate-100 shadow-xs" />
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-wide">{l.name}</h4>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{l.role}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{l.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Locations */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-left">Global Offices</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {locations.map(loc => (
            <Card key={loc.city} className="bg-white border border-slate-200/90 text-left p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 rounded-2xl shadow-sm">
              <CardHeader className="p-0 mb-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <BuildingIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 tracking-wide">{loc.city}</h4>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{loc.role}</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <p className="text-[10px] text-slate-600 leading-relaxed">{loc.address}</p>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                  <MapPinIcon className="w-3.5 h-3.5 text-primary" />
                  <span>{loc.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}

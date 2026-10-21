import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CompassIcon, 
  AnchorIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  InboxIcon, 
  HardHatIcon, 
  ArrowRightIcon, 
  ClockIcon, 
  CheckIcon, 
  CheckCircle2Icon, 
  InfoIcon, 
  PackageIcon,
  Globe2Icon,
  ShieldAlertIcon,
  ZapIcon,
  FileTextIcon
} from '../components/ui/CustomIcons'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useLogistics } from '../context/LogisticsContext'
import { cn } from '../lib/utils'

interface ServiceDetail {
  id: string
  title: string
  tagline: string
  icon: React.ElementType
  leadTime: string
  reliability: string
  network: string
  summary: string
  specifications: { label: string; value: string }[]
  keyCapabilities: string[]
  idealFor: string[]
}

const SERVICES_CATALOG: ServiceDetail[] = [
  {
    id: 'air-freight',
    title: 'Express Air Cargo & Consolidation',
    tagline: 'Direct daily wide-body flights connecting LOS & PHC to LHR, JFK, FRA & DXB',
    icon: CompassIcon,
    leadTime: '1–4 Business Days',
    reliability: '99.4% On-time SLA',
    network: '194 Countries',
    summary: 'High-priority commercial cargo space on scheduled international passenger and freighter flights. Engineered for urgent e-commerce inventory, high-tech components, and time-critical exports with airport-to-airport or door-to-door delivery.',
    specifications: [
      { label: 'Minimum Chargeable Weight', value: '0.5 kg (no max cap)' },
      { label: 'Flight Frequency', value: 'Daily departures via LOS & PHC' },
      { label: 'Customs Handling', value: 'Pre-arrival clearance filing' },
      { label: 'Tracking Telemetry', value: 'Live IATA AWB milestone updates' }
    ],
    keyCapabilities: [
      'Guaranteed cargo space allocation on tier-1 partner airlines',
      'Temperature-controlled cold-chain packaging for biologics & pharmaceuticals',
      'Automated Air Waybill (AWB) generation with digital manifest verification',
      'Dangerous Goods handling (IATA DGR certified packing & documentation)'
    ],
    idealFor: ['High-value consumer tech', 'Fashion & luxury apparel samples', 'Automotive replacement spares', 'Urgent business documents']
  },
  {
    id: 'ocean-freight',
    title: 'Ocean Cargo Freight (LCL & FCL)',
    tagline: 'Economical containerized maritime logistics via Apapa & Onne ports',
    icon: AnchorIcon,
    leadTime: '18–28 Calendar Days',
    reliability: 'Cost-optimized routing',
    network: '45 Major Global Ports',
    summary: 'Cost-effective sea freight solutions for bulk merchandise, industrial machinery, and palletized commodities. We operate dedicated Less-than-Container Load (LCL) consolidation boxes and Full-Container Load (FCL) bookings directly to Europe, the Americas, and Asia.',
    specifications: [
      { label: 'Container Types', value: '20ft, 40ft Standard & High Cube' },
      { label: 'Consolidation Frequency', value: 'Bi-weekly container sailing' },
      { label: 'Port Terminals', value: 'Apapa, Tin Can Island, Onne Port' },
      { label: 'Bill of Lading', value: 'Direct digital Master / House B/L' }
    ],
    keyCapabilities: [
      'Flexible LCL consolidation reducing tariff burdens for growing SMEs',
      'Full port drayage, container stripping, and inland warehouse transfer',
      'Port-of-entry container inspection oversight and phytosanitary clearance',
      'Intermodal transfer directly onto heavy road haulage'
    ],
    idealFor: ['Heavy manufacturing equipment', 'Agricultural raw materials', 'Bulk retail packaging', 'Raw industrial goods']
  },
  {
    id: 'customs-brokerage',
    title: 'Customs Clearance & Regulatory Brokerage',
    tagline: 'Licensed customs brokerage with automated tariff code classification & duty audits',
    icon: ShieldCheckIcon,
    leadTime: '12–36 Hours Standard',
    reliability: '100% Regulatory Compliance',
    network: 'All Nigerian Border Posts & Global Ports',
    summary: 'Navigating international customs regulations is the number one bottleneck in cross-border trade. Our licensed brokerage team audits manifests, verifies Harmonized System (HS) tariff codes, and files automated Form M and NXP documentation.',
    specifications: [
      { label: 'Licensing Status', value: 'Nigeria Customs Service (NCS) Licensed' },
      { label: 'Audit Turnaround', value: '< 2 hours for standard manifests' },
      { label: 'Duty Optimization', value: 'Automated HS code classification' },
      { label: 'Supported Docs', value: 'Form M, NXP, PAAR, EUR.1, COO' }
    ],
    keyCapabilities: [
      'Zero-delay pre-arrival electronic customs lodgement',
      'Tariff classification optimization to prevent overpaid duties',
      'Complete brokerage handling for NAFDAC, SONCAP, and quarantine certificates',
      'Post-clearance duty auditing and bonded cargo escort services'
    ],
    idealFor: ['Regulated pharmaceuticals', 'Imported machinery spares', 'Food & consumable products', 'Restricted commercial inventory']
  },
  {
    id: 'doorstep-dispatch',
    title: 'Scheduled Doorstep Collection & Delivery',
    tagline: 'First-mile dispatch and last-mile verified delivery across all 36 Nigerian states',
    icon: TruckIcon,
    leadTime: 'Same-day to 48 Hours',
    reliability: 'Driver GPS Telemetry',
    network: 'Nationwide Fleet Coverage',
    summary: 'Direct driver dispatch from your home, workshop, or commercial facility in Nigeria. Packages are scanned on collection, weighed with calibrated digital scales, and transported in GPS-monitored courier vans directly to international sorting hubs.',
    specifications: [
      { label: 'Driver Time Windows', value: 'Morning (9am), Midday (12pm), Late (3pm)' },
      { label: 'Verification', value: 'Digital signature & photo proof of receipt' },
      { label: 'Security', value: 'Tamper-evident barcode bag sealing' },
      { label: 'Fleet Types', value: 'Express motorbikes & sealed transit vans' }
    ],
    keyCapabilities: [
      'Same-day collection available in Lagos, Port Harcourt, and Abuja',
      'Calibrated on-site weight and volumetric dimension verification',
      'Instant digital intake receipts issued via SMS and customer portal',
      'Dedicated handling protocol for fragile and high-value cargo'
    ],
    idealFor: ['eCommerce sellers & artisans', 'Direct-to-consumer drops', 'Urgent embassy passports', 'Return logistics & warranty exchanges']
  },
  {
    id: 'warehousing',
    title: 'Secure Warehousing & Cargo Consolidation',
    tagline: '24/7 monitored transit hubs with bonded storage and micro-fulfillment',
    icon: InboxIcon,
    leadTime: 'Instant Intake',
    reliability: 'ISO 9001:2015 Monitored',
    network: 'Lagos, Port Harcourt & London',
    summary: 'Strategic distribution hubs situated within 15 minutes of international airport cargo terminals. Store inventory, consolidate multiple supplier consignments into a single shipment, and slash international freight costs by up to 40%.',
    specifications: [
      { label: 'Security Standards', value: 'CCTV surveillance & biometric access' },
      { label: 'Consolidation Window', value: 'Up to 30 days free staging storage' },
      { label: 'Value-Added Services', value: 'Repackaging, crating & palletizing' },
      { label: 'Climate Control', value: '15°C to 25°C ambient zones available' }
    ],
    keyCapabilities: [
      'Multi-supplier package consolidation into a single master air waybill',
      'Custom wooden crating and bubble-reinforcement for fragile glassware/art',
      'Real-time inventory ledger synced with client console',
      'Pick, pack, and export labeling for global eCommerce brands'
    ],
    idealFor: ['Cross-border eCommerce fulfillment', 'Multiple factory sample consolidation', 'Seasonal inventory staging', 'Heavy crate reinforcement']
  },
  {
    id: 'cold-chain',
    title: 'Pharma & Temperature-Controlled Cold Chain',
    tagline: 'Continuous thermal compliance for biologics, diagnostic kits, and sensitive goods',
    icon: ZapIcon,
    leadTime: 'Priority Express Transit',
    reliability: 'Continuous Data Logger',
    network: 'Select Global Hubs',
    summary: 'Engineered for biomedical exports, laboratory reagents, and perishable specialty items. Includes calibrated thermal insulation packaging, dry ice replenishment at key transit hubs, and continuous data loggers verifying thermal compliance throughout the flight.',
    specifications: [
      { label: 'Temperature Bands', value: '-20°C (Frozen), 2°C–8°C (Chilled), 15°C–25°C' },
      { label: 'Monitoring', value: 'USB/NFC thermal data loggers included' },
      { label: 'Transit Routing', value: 'Direct routing to minimize hub dwell times' },
      { label: 'Regulatory Protocol', value: 'GDP (Good Distribution Practice) compliant' }
    ],
    keyCapabilities: [
      'Validated VIP vacuum insulated panels and phase-change materials',
      'Pre-conditioned dry ice replenishment at London and Frankfurt transit hubs',
      'Complete temperature report provided upon final mile handover',
      'Priority customs release for perishable diagnostic items'
    ],
    idealFor: ['Vaccines & clinical trial specimens', 'Pharmaceutical ingredients', 'Specialty confectionery & chocolate', 'Laboratory diagnostic reagents']
  }
]

const COMPLIANCE_ITEMS = [
  { item: 'Standard Consumer Goods & Textiles', allowed: true, note: 'Normal commercial invoice and packing list required' },
  { item: 'Personal Electronics (Laptops, Phones)', allowed: true, note: 'Must comply with IATA Section II (max 2 spare batteries per box)' },
  { item: 'Dry Packaged Food & Spices (Egusi, Ogbono)', allowed: true, note: 'Sealed airtight commercial packaging; quarantine declaration' },
  { item: 'Prescription Pharmaceuticals', allowed: true, note: 'Medical prescription and NAFDAC clearance certification required' },
  { item: 'Perfumes & Alcohol (>70% Concentration)', allowed: false, note: 'Class 3 Flammable Liquids prohibited on standard passenger air cargo' },
  { item: 'Loose Lithium-Ion Powerbanks', allowed: false, note: 'UN3480 standalone batteries prohibited under IATA passenger regulations' },
  { item: 'Perishable Raw Meat or Dairy', allowed: false, note: 'Prohibited under international bilateral agricultural safety accords' }
]

export default function Services() {
  const { setActiveView, setCalculatorForm } = useLogistics()
  const [selectedServiceId, setSelectedServiceId] = useState<string>('air-freight')
  const [complianceSearch, setComplianceSearch] = useState('')

  const activeService = SERVICES_CATALOG.find(s => s.id === selectedServiceId) || SERVICES_CATALOG[0]
  const ServiceIcon = activeService.icon

  const filteredCompliance = COMPLIANCE_ITEMS.filter(c => 
    c.item.toLowerCase().includes(complianceSearch.toLowerCase()) || 
    c.note.toLowerCase().includes(complianceSearch.toLowerCase())
  )

  return (
    <div className="space-y-16 select-none text-left pb-16">
      
      {/* 1. Header & Kicker */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-primary font-bold">Logistics Capabilities</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Tier-1 Airline Alliances</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>194 Destination Corridors</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>ISO 9001:2015</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-display text-balance">
          Industrial Freight Operations. <br />
          <span className="text-primary">Engineered to Surpass Legacy Carriers.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          While legacy express couriers burden senders with opaque tariffs and delayed customs handoffs, Spatial Express pairs negotiated airline capacity with automated digital customs clearance and guaranteed doorstep collections.
        </p>
      </div>

      {/* 2. Interactive Service Architecture (Sidebar + Deep Specification Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Selector Rail */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
            Core Service Modules
          </span>
          {SERVICES_CATALOG.map((svc) => {
            const Icon = svc.icon
            const isSelected = svc.id === selectedServiceId
            return (
              <button
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 group",
                  isSelected
                    ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                    : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-600"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-emerald-50 border border-emerald-200 text-primary"
                      : "bg-slate-100 text-slate-400 group-hover:text-slate-700"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        "text-xs font-bold leading-tight truncate",
                        isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                      )}
                    >
                      {svc.title}
                    </h3>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-1.5" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-snug">
                    {svc.leadTime} · {svc.reliability}
                  </p>
                </div>
              </button>
            )
          })}

          {/* Quick Calculator Jump Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 mt-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Immediate Tariff Lookup
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculate exact door-to-door contract rates across DHL, FedEx, UPS, and Aramex in under 15 seconds.
            </p>
            <Button
              onClick={() => setActiveView('calculator')}
              className="w-full h-10 bg-primary hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <span>Launch Rate Calculator</span>
              <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Selected Service Detailed Viewport */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-8"
            >
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Operational Specification
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                      {activeService.network}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {activeService.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {activeService.tagline}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <ClockIcon className="w-4 h-4 text-emerald-600" />
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Transit SLA</span>
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{activeService.leadTime}</span>
                  </div>
                </div>
              </div>

              {/* Summary Paragraph */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                {activeService.summary}
              </p>

              {/* Technical Specifications Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Technical Service Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeService.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {spec.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-1 font-mono">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Operational Capabilities */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Operational Advantages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeService.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon className="w-2.5 h-2.5 text-primary stroke-[3]" />
                      </div>
                      <span className="leading-relaxed">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Commodities / Target Use Cases */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Ideal Cargo Categories
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
                    {activeService.idealFor.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span>{item}</span>
                        {idx < activeService.idealFor.length - 1 && (
                          <span aria-hidden="true" className="text-slate-300">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCalculatorForm((prev: any) => ({
                      ...prev,
                      packageType: activeService.id === 'ocean-freight' ? 'Freight Pallet' : 'Parcel'
                    }))
                    setActiveView('calculator')
                  }}
                  className="h-10 px-5 bg-primary hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs shrink-0"
                >
                  <span>Book This Service</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. Dangerous Goods & Cargo Readiness Auditor */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                IATA Dangerous Goods & Customs Compliance
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pre-Flight Commodity Readiness Inspector
            </h2>
            <p className="text-xs text-slate-600 max-w-xl">
              Check import/export restrictions before cargo dispatch to avoid airline holds, customs fines, or clearance seizure.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search commodity (e.g. battery, food)..."
              value={complianceSearch}
              onChange={(e) => setComplianceSearch(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="py-3 px-4">Commodity / Material</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">IATA & NCS Operational Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompliance.map((row) => (
                  <tr key={row.item} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.item}</td>
                    <td className="py-3 px-4">
                      {row.allowed ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-[11px]">
                          <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-600" />
                          Permitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-rose-700 text-[11px]">
                          <ShieldAlertIcon className="w-3.5 h-3.5 text-rose-600" />
                          Restricted
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: Spatial Express vs. Legacy Carriers (FedEx & DHL) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Competitive Architecture Benchmark
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            How Spatial Express Outperforms Traditional Express Couriers
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Legacy carriers were designed for 20th-century paper forms. Spatial Express was built from the ground up as a software-native freight operating system for modern cross-border commerce.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 w-1/4">Operational Dimension</th>
                <th className="py-3.5 px-4 w-1/3 bg-emerald-50/50 text-emerald-900 border-x border-emerald-100">
                  Spatial Express OS
                </th>
                <th className="py-3.5 px-4 w-1/3 text-slate-500">
                  Legacy Carriers (FedEx / DHL Direct)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Tariff Transparency</td>
                <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-emerald-100">
                  Instant contract discount matrix (up to 40% below retail). All fuel and customs fees shown upfront.
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Retail counter markups with surprise fuel surcharges and post-delivery clearance invoices.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Customs Brokerage</td>
                <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-emerald-100">
                  Automated digital Form M / NXP generation with verified HS-code duty estimates.
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Manual physical paperwork prone to border inspection hold-ups and warehouse demurrage fees.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Carrier Flexibility</td>
                <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-emerald-100">
                  Multi-carrier aggregation (DHL, FedEx, UPS, Aramex) routed for optimal price & speed.
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Locked into a single proprietary network even when flights or sorting hubs are congested.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Local Pickup Speed</td>
                <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-emerald-100">
                  Guaranteed same-day driver dispatch in Lagos, Port Harcourt, and Abuja.
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Requires driving to distant drop-off depots or waiting for 48-hour scheduled driver slots.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Real-Time Telemetry</td>
                <td className="py-3.5 px-4 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-emerald-100">
                  Interactive geodesic flight corridor visualizer with dynamic stage progress tracker.
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Generic text lists of scan checkpoints with sparse contextual explanation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Direct Conversion Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Enterprise Freight Accounts
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Shipping more than 100 kg per month?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlock volume rebates, designated account coordinators, priority airline booking, and net-30 consolidated billing terms.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <Button
            onClick={() => setActiveView('contact')}
            className="w-full sm:w-auto h-12 px-6 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md"
          >
            Speak with Freight Desk
          </Button>
          <Button
            onClick={() => setActiveView('calculator')}
            className="w-full sm:w-auto h-12 px-6 bg-primary hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Calculate Tariff Now
          </Button>
        </div>
      </div>

    </div>
  )
}

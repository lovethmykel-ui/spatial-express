import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, ChevronDownIcon, HelpCircleIcon, PackageIcon, ArrowRightIcon, ArrowLeftIcon, UploadIcon, InfoIcon, SearchIcon, ShieldIcon, ShieldCheckIcon, MapPinIcon, Navigation2Icon, ZapIcon, TruckIcon, UserIcon, FileTextIcon, CheckCircleIcon, RotateCcwIcon, AlertTriangleIcon, MailIcon, PrinterIcon, ClockIcon, StarIcon, SendIcon, ShirtIcon, LaptopIcon, PillIcon, UtensilsIcon, BriefcaseIcon, BookIcon, SparklesIcon } from '../components/ui/CustomIcons'
import { getCode } from 'country-list'
import { CountryFlag } from '../components/ui/CountryFlag'
import { cn } from '../lib/utils'
import { useLogistics } from '../context/LogisticsContext'
import { Button } from '../components/ui/Button'

// ─────────────────────── DATA ───────────────────────
const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara'
]

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium',
  'Belize','Bolivia','Brazil','Brunei','Bulgaria','Cameroon','Canada','Chile',
  'China','Colombia','Croatia','Cuba','Cyprus','Czech Republic','Denmark',
  'Ecuador','Egypt','Estonia','Ethiopia','Finland','France','Gabon','Germany',
  'Ghana','Greece','Guatemala','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan',
  'Kenya','Kuwait','Latvia','Lebanon','Libya','Lithuania','Malaysia','Mexico',
  'Morocco','Mozambique','Netherlands','New Zealand','Niger','Nigeria','Norway',
  'Pakistan','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Rwanda','Saudi Arabia','Senegal','Sierra Leone','Singapore','Somalia',
  'South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden',
  'Switzerland','Tanzania','Thailand','Trinidad and Tobago','Tunisia','Turkey',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zimbabwe'
]

const SPEED_OPTIONS = [
  { id: 'express', label: 'Express', icon: ZapIcon, desc: 'Priority handling · 3–5 Business Days', multiplier: 1.5, badge: 'Fastest' },
  { id: 'standard', label: 'Standard', icon: PackageIcon, desc: 'Regular shipping · 5–8 Business Days', multiplier: 1.0, badge: 'Most Popular' },
  { id: 'economy', label: 'Economy', icon: BriefcaseIcon, desc: 'Budget-friendly · 10–14 Business Days', multiplier: 0.65, badge: 'Best Value' },
]

const COURIERS = [
  { id: 'dhl', name: 'DHL Express', logo: '/courier badges/dhl.png', baseRate: 16500, badge: 'Recommended', tracking: true, insurance: true, pickup: 'Free Same-day' },
  { id: 'fedex', name: 'FedEx Express', logo: '/courier badges/fedex.png', baseRate: 15800, badge: 'Fastest', tracking: true, insurance: true, pickup: 'Free Same-day' },
  { id: 'ups', name: 'UPS Worldwide', logo: '/courier badges/ups.png', baseRate: 15300, badge: 'Cheapest', tracking: true, insurance: true, pickup: 'Next-day available' },
  { id: 'aramex', name: 'Aramex International', logo: '/courier badges/aramex.png', baseRate: 14300, badge: '', tracking: true, insurance: false, pickup: 'Next-day available' },
]

const ITEM_TYPES = [
  { icon: ShirtIcon, label: 'Clothing' }, { icon: LaptopIcon, label: 'Electronics' },
  { icon: FileTextIcon, label: 'Documents' }, { icon: PillIcon, label: 'Medicine' },
  { icon: UtensilsIcon, label: 'Food Items' }, { icon: BriefcaseIcon, label: 'Accessories' },
  { icon: BookIcon, label: 'Books' }, { icon: SparklesIcon, label: 'Cosmetics' },
  { icon: PackageIcon, label: 'Other' },
]

const STEPS = ['Route', 'Speed', 'Courier', 'Account', 'Waybill', 'Receipt']

// ─────────────────────── HELPERS ───────────────────────
function generateWaybill() {
  const id = Math.floor(1000 + Math.random() * 9000)
  return `SPX-${new Date().getFullYear()}-${id}`
}

// ─────────────────────── SUB-COMPONENTS ───────────────────────

interface SearchDropdownProps {
  id: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  options: string[]
  showFlags?: boolean
}

function SearchDropdown({ id, placeholder, value, onChange, options, showFlags }: SearchDropdownProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setQuery(value) }, [value])

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 40)

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
        <input
          id={id}
          className="w-full bg-[#050608] border border-white/10 rounded-xl pl-9 pr-10 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <ChevronDownIcon className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted transition-transform", open && 'rotate-180')} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#0D1117] border border-white/10 rounded-xl shadow-2xl max-h-52 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted text-center">No results found</p>
            ) : filtered.map(opt => (
              <button
                key={opt}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border-b border-white/5 last:border-0",
                  value === opt && 'text-primary font-bold bg-primary/5'
                )}
                onClick={() => { onChange(opt); setQuery(opt); setOpen(false) }}
              >
                <div className="flex items-center gap-2">
                  {showFlags && <CountryFlag countryCode={getCode(opt) || ''} size="sm" />}
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────── MAIN COMPONENT ───────────────────────

export default function CalculatorFlow() {
  const { priceMatrix } = useLogistics()

  // Step navigation
  const [step, setStep] = useState(0) // 0-5

  // Step 1: Route
  const [tab, setTab] = useState<'intl' | 'local'>('intl')
  const [intlPickupCountry, setIntlPickupCountry] = useState('Nigeria')
  const [intlPickupState, setIntlPickupState] = useState('')
  const [intlPickupCity, setIntlPickupCity] = useState('')
  const [intlDestCountry, setIntlDestCountry] = useState('')
  const [intlDestState, setIntlDestState] = useState('')
  const [intlDestCity, setIntlDestCity] = useState('')
  const [intlWeight, setIntlWeight] = useState('')
  const [intlValue, setIntlValue] = useState('')
  const [localPickupState, setLocalPickupState] = useState('')
  const [localPickupCity, setLocalPickupCity] = useState('')
  const [localDestState, setLocalDestState] = useState('')
  const [localDestCity, setLocalDestCity] = useState('')
  const [localWeight, setLocalWeight] = useState('')

  // Step 2: Speed
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null)

  // Step 3: Courier
  const [selectedCourier, setSelectedCourier] = useState<typeof COURIERS[0] | null>(null)

  // Step 4: Auth & Payment
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'guest'>('guest')
  const [guestName, setGuestName] = useState('')
  const [guestWa, setGuestWa] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'monnify' | 'transfer'>('paystack')
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)

  // Step 5: Waybill
  const [sFname, setSFname] = useState(''); const [sLname, setSLname] = useState('')
  const [sPhone, setSPhone] = useState(''); const [sWa, setSWa] = useState('')
  const [sEmail, setSEmail] = useState(''); const [sAddr, setSAddr] = useState('')
  const [sState, setSState] = useState(''); const [sCity, setSCity] = useState('')
  const [itemType, setItemType] = useState('')
  const [itemDesc, setItemDesc] = useState('')
  const [wbWeight, setWbWeight] = useState('')
  const [wbValue, setWbValue] = useState('')
  const [dimL, setDimL] = useState(''); const [dimW, setDimW] = useState(''); const [dimH, setDimH] = useState('')
  const [fragile, setFragile] = useState(false); const [insurance, setInsurance] = useState(false)
  const [rFname, setRFname] = useState(''); const [rLname, setRLname] = useState('')
  const [rPhone, setRPhone] = useState(''); const [rEmail, setREmail] = useState('')
  const [rAddr, setRAddr] = useState(''); const [rCity, setRCity] = useState('')
  const [rState, setRState] = useState(''); const [rZip, setRZip] = useState('')

  // Step 6: Receipt
  const [waybillNo] = useState(generateWaybill)

  // ─── Computed ───
  const weight = parseFloat(tab === 'intl' ? intlWeight : localWeight) || 0
  const speedObj = SPEED_OPTIONS.find(s => s.id === selectedSpeed)

  const computePrice = (baseRate: number) => {
    const mult = speedObj?.multiplier ?? 1
    return Math.round(baseRate * weight * mult)
  }

  const totalPrice = selectedCourier ? computePrice(selectedCourier.baseRate) : 0
  const fuel = Math.round(totalPrice * 0.08)
  const vat = Math.round(totalPrice * 0.075)
  const grandTotal = totalPrice + fuel + vat

  const route = tab === 'intl'
    ? `${intlPickupCountry || 'Nigeria'} → ${intlDestCountry || '—'}`
    : `${localPickupState || '—'} → ${localDestState || '—'}`

  // ─── Validation ───
  const canProceedStep1 = () => {
    if (tab === 'intl') return intlDestCountry && parseFloat(intlWeight) > 0
    return localPickupState && localDestState && parseFloat(localWeight) > 0
  }

  const speedPriceLabel = (courier: typeof COURIERS[0]) => {
    const p = computePrice(courier.baseRate)
    return `₦${p.toLocaleString()}`
  }

  const goStep = (n: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(n)
  }

  // ─── Progress Bar ───
  const progress = ((step + 1) / 6) * 100

  return (
    <div className="max-w-2xl mx-auto pb-16 select-none text-left">

      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-black text-white font-display uppercase tracking-wider">Shipping Calculator</h1>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
              Step {step + 1} of 6 — {STEPS[step]}
            </p>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
            {STEPS[step]}
          </span>
        </div>

        {/* Progress track */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex mt-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider transition-colors",
                i < step ? 'text-primary' : i === step ? 'text-primary' : 'text-white/20'
              )}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════ STEP 1: ROUTE ══════════════════════ */}
        {step === 0 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 1 of 6
              </span>
              <h2 className="text-2xl font-black text-white font-display mb-1">Shipping Calculator</h2>
              <p className="text-xs text-muted">Enter your route and shipment details to get an instant quote.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#050608] border border-white/5 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setTab('intl')}
                className={cn("flex-1 py-3 text-xs font-bold text-center transition-all cursor-pointer", tab === 'intl' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted hover:text-white')}
              >🌍 International</button>
              <button
                type="button"
                onClick={() => setTab('local')}
                className={cn("flex-1 py-3 text-xs font-bold text-center transition-all cursor-pointer", tab === 'local' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted hover:text-white')}
              >🇳🇬 Local (Nigeria)</button>
            </div>

            {tab === 'intl' ? (
              <div className="space-y-4">
                {/* Pickup */}
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <MapPinIcon className="w-4 h-4" />Pickup Location
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Country <span className="text-red-400">*</span> <span className="text-muted font-normal normal-case">(Shipping from)</span></label>
                    <SearchDropdown id="pickup-country" placeholder="Search country..." value={intlPickupCountry} onChange={setIntlPickupCountry} options={COUNTRIES} showFlags />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter state" value={intlPickupState} onChange={e => setIntlPickupState(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">City <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter city" value={intlPickupCity} onChange={e => setIntlPickupCity(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <Navigation2Icon className="w-4 h-4" />Destination
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Country <span className="text-red-400">*</span></label>
                    <SearchDropdown id="dest-country" placeholder="Search destination country..." value={intlDestCountry} onChange={setIntlDestCountry} options={COUNTRIES} showFlags />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter state" value={intlDestState} onChange={e => setIntlDestState(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">City <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter city" value={intlDestCity} onChange={e => setIntlDestCity(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Shipment details */}
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <PackageIcon className="w-4 h-4" />Shipment Details
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Weight (KG) <span className="text-red-400">*</span></label>
                    <input type="number" min="0.1" step="0.1" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter weight in kilograms" value={intlWeight} onChange={e => setIntlWeight(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Declared Value ₦ <span className="text-white/30 font-normal normal-case">(for insurance, optional)</span></label>
                    <input type="number" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="e.g. 50000" value={intlValue} onChange={e => setIntlValue(e.target.value)} />
                  </div>
                </div>
              </div>
            ) : (
              /* LOCAL NIGERIA */
              <div className="space-y-4">
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <MapPinIcon className="w-4 h-4" />Pickup State (Nigeria 🇳🇬)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State <span className="text-red-400">*</span></label>
                    <SearchDropdown id="pickup-local" placeholder="Search state..." value={localPickupState} onChange={setLocalPickupState} options={NG_STATES} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">City / LGA <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                    <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter city or LGA" value={localPickupCity} onChange={e => setLocalPickupCity(e.target.value)} />
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <Navigation2Icon className="w-4 h-4" />Destination State (Nigeria 🇳🇬)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State <span className="text-red-400">*</span></label>
                    <SearchDropdown id="dest-local" placeholder="Search state..." value={localDestState} onChange={setLocalDestState} options={NG_STATES} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">City / LGA <span className="text-white/30 font-normal normal-case">(optional)</span></label>
                    <input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter city or LGA" value={localDestCity} onChange={e => setLocalDestCity(e.target.value)} />
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                    <PackageIcon className="w-4 h-4" />Shipment Details
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Weight (KG) <span className="text-red-400">*</span></label>
                    <input type="number" min="0.1" step="0.1" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter weight in kilograms" value={localWeight} onChange={e => setLocalWeight(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <Button
              disabled={!canProceedStep1()}
              onClick={() => goStep(1)}
              className="w-full py-4 flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-4 h-4 text-black" />
              Calculate Shipping
            </Button>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 2: SPEED ══════════════════════ */}
        {step === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 2 of 6
              </span>
              <h2 className="text-2xl font-black text-white font-display mb-1">Select Delivery Speed</h2>
              <p className="text-xs text-muted">Choose how fast you need your package delivered.</p>
            </div>

            {/* Route info banner */}
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs">
              <InfoIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted">Route: <strong className="text-white">{route}</strong>&nbsp;·&nbsp;Weight: <strong className="text-white">{weight} kg</strong></span>
            </div>

            <div className="space-y-3">
              {SPEED_OPTIONS.map(sp => (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpeed(sp.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left",
                    selectedSpeed === sp.id
                      ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(57,255,20,0.08)]'
                      : 'border-white/5 bg-[#0D1117] hover:border-primary/30'
                  )}
                >
                  {/* Radio */}
                  <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all", selectedSpeed === sp.id ? 'border-primary bg-primary' : 'border-white/20')}>
                    {selectedSpeed === sp.id && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0"><sp.icon className="w-6 h-6 text-current" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{sp.label}</p>
                    <p className="text-[11px] text-muted">{sp.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-primary">×{sp.multiplier}</p>
                    <p className="text-[10px] text-muted">{sp.badge}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(0)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button disabled={!selectedSpeed} onClick={() => goStep(2)} className="flex-1 flex items-center justify-center gap-1.5">
                Continue to Courier<ArrowRightIcon className="w-3.5 h-3.5 text-black" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 3: COURIER ══════════════════════ */}
        {step === 2 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 3 of 6
              </span>
              <h2 className="text-2xl font-black text-white font-display mb-1">Choose Your Courier</h2>
              <p className="text-xs text-muted">Select the best carrier for your shipment. Prices are calculated for your route and weight.</p>
            </div>

            <div className="space-y-3">
              {COURIERS.map(courier => {
                const price = computePrice(courier.baseRate)
                const isSelected = selectedCourier?.id === courier.id
                return (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={courier.id}
                    type="button"
                    onClick={() => setSelectedCourier(courier)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative overflow-hidden",
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(57,255,20,0.08)]'
                        : 'border-white/5 bg-[#0D1117] hover:border-primary/30'
                    )}
                  >
                    {/* Badge */}
                    {courier.badge && (
                      <span className={cn(
                        "absolute top-0 right-0 text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider",
                        courier.badge === 'Recommended' ? 'bg-primary text-black' : 'bg-yellow-400/20 text-yellow-400'
                      )}>{courier.badge}</span>
                    )}
                    {/* Radio */}
                    <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all", isSelected ? 'border-primary bg-primary' : 'border-white/20')}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    {/* Logo */}
                    <div className="w-16 h-10 bg-white border border-white/10 rounded overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                      <img src={courier.logo} alt={courier.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{courier.name}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {courier.tracking && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">✓ Tracking</span>}
                        {courier.insurance && <span className="text-[9px] bg-blue-400/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">✓ Insured</span>}
                        <span className="text-[9px] bg-white/5 text-muted px-1.5 py-0.5 rounded font-bold">{courier.pickup}</span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-primary">₦{price.toLocaleString()}</p>
                      <p className="text-[10px] text-muted">total est.</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-3 text-xs">
              <AlertTriangleIcon className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span className="text-yellow-300/80">Prices are estimates. Final cost may vary based on actual dimensions, volumetric weight, and customs charges.</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(1)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button disabled={!selectedCourier} onClick={() => goStep(3)} className="flex-1 flex items-center justify-center gap-1.5">
                Continue to Payment<ArrowRightIcon className="w-3.5 h-3.5 text-black" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 4: ACCOUNT / PAYMENT ══════════════════════ */}
        {step === 3 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 4 of 6
              </span>
              <h2 className="text-2xl font-black text-white font-display mb-1">Account & Payment</h2>
              <p className="text-xs text-muted">Sign in, create an account, or continue as guest.</p>
            </div>

            {/* Order Summary */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 to-emerald-900/30 px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">Order Summary</h3>
                <p className="text-[10px] text-muted mt-0.5">Review before proceeding to payment</p>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { label: 'Route', value: route },
                  { label: 'Courier', value: selectedCourier?.name || '—' },
                  { label: 'Speed', value: speedObj ? `${speedObj.label} (${speedObj.desc.split('·')[1].trim()})` : '—' },
                  { label: 'Weight', value: `${weight} kg` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-3 text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-4 bg-primary/5">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-xl font-black text-primary">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Auth Tabs */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex border-b border-white/5">
                {(['signin', 'signup', 'guest'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAuthTab(t)}
                    className={cn("flex-1 py-3.5 text-xs font-bold capitalize text-center transition-all cursor-pointer border-b-2",
                      authTab === t ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted hover:text-white'
                    )}
                  >
                    {t === 'signin' ? 'Sign In' : t === 'signup' ? 'Register' : 'Guest'}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {authTab === 'signin' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                      <input type="email" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</label>
                      <input type="password" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter your password" />
                    </div>
                    <Button className="w-full">🔒 Sign In & Continue</Button>
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-white/5" /><span className="text-[10px] text-muted">or continue with</span><div className="flex-1 h-px bg-white/5" />
                    </div>
                    <button type="button" className="w-full flex items-center justify-center gap-2 border border-white/10 bg-white/[0.02] rounded-xl py-3 text-xs font-semibold text-white hover:border-white/20 transition-all cursor-pointer">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                  </>
                )}

                {authTab === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">First Name</label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="First name" /></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Last Name</label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Last name" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email</label><input type="email" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="your@email.com" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone / WhatsApp</label><input type="tel" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</label><input type="password" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Create password" /></div>
                    <Button className="w-full">🔒 Create Account & Continue</Button>
                  </>
                )}

                {authTab === 'guest' && (
                  <>
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-center space-y-1">
                      <div className="text-2xl">👤</div>
                      <p className="text-xs font-bold text-white">Continue as Guest</p>
                      <p className="text-[11px] text-muted">No account needed. Receipt will be sent via WhatsApp and/or Email after payment.</p>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Enter your full name" value={guestName} onChange={e => setGuestName(e.target.value)} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">WhatsApp Number <span className="text-red-400">*</span></label><input type="tel" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={guestWa} onChange={e => setGuestWa(e.target.value)} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email <span className="text-white/30 font-normal normal-case">(optional)</span></label><input type="email" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="your@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} /></div>
                  </>
                )}

                {/* Payment Method Selector */}
                <div className="mt-6 border-t border-white/5 pt-6">
                  <h4 className="text-sm font-bold text-white mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer", paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#050608] hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'paystack' ? 'border-primary bg-primary' : 'border-white/20')}>
                        {paymentMethod === 'paystack' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white">Paystack</span>
                        <p className="text-[10px] text-muted">Card, USSD, Bank Transfer via Paystack</p>
                      </div>
                    </label>

                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer", paymentMethod === 'monnify' ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#050608] hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'monnify' ? 'border-primary bg-primary' : 'border-white/20')}>
                        {paymentMethod === 'monnify' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'monnify'} onChange={() => setPaymentMethod('monnify')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white">Monnify</span>
                        <p className="text-[10px] text-muted">Secure payments with Monnify</p>
                      </div>
                    </label>

                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer", paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#050608] hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'transfer' ? 'border-primary bg-primary' : 'border-white/20')}>
                        {paymentMethod === 'transfer' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white">Direct Bank Transfer</span>
                        <p className="text-[10px] text-muted">Make a direct transfer and upload proof</p>
                      </div>
                    </label>
                  </div>

                  {/* Bank Transfer Details & Upload */}
                  <AnimatePresence>
                    {paymentMethod === 'transfer' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mt-4 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Our Bank Details</p>
                            <div className="bg-[#050608] border border-white/5 rounded-lg p-3">
                              <p className="text-xs text-muted mb-1">Bank Name: <strong className="text-white">Zenith Bank</strong></p>
                              <p className="text-xs text-muted mb-1">Account Name: <strong className="text-white">Spatial Express Logistics</strong></p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted">Account No: <strong className="text-white font-mono text-sm tracking-wider">1234567890</strong></p>
                                <button className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-colors">Copy</button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Upload Proof of Payment <span className="text-red-400">*</span></label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer bg-[#050608] relative">
                              <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*,.pdf" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setProofOfPayment(e.target.files[0])
                                  }
                                }}
                              />
                              <UploadIcon className="w-6 h-6 text-muted mx-auto mb-2" />
                              <p className="text-xs text-white font-bold">{proofOfPayment ? proofOfPayment.name : 'Click or drag file here'}</p>
                              <p className="text-[10px] text-muted mt-1">Supports JPG, PNG, PDF</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => goStep(4)}
                    disabled={(authTab === 'guest' && (!guestName || !guestWa)) || (paymentMethod === 'transfer' && !proofOfPayment)}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                  >
                    💳 Pay ₦{grandTotal.toLocaleString()} & Continue
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(2)} className="w-full flex items-center justify-center gap-1.5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back to Courier
              </Button>
              {authTab !== 'guest' && (
                <Button onClick={() => goStep(4)} className="w-full flex items-center justify-center gap-1.5">
                  Continue<ArrowRightIcon className="w-3.5 h-3.5 text-black" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 5: WAYBILL ══════════════════════ */}
        {step === 4 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 5 of 6
              </span>
              <h2 className="text-2xl font-black text-white font-display mb-1">Waybill Form</h2>
              <p className="text-xs text-muted">Complete your shipment details. Fields marked <span className="text-red-400">*</span> are compulsory.</p>
            </div>

            <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs">
              <CheckCircleIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-primary font-semibold">Payment confirmed ✅ — Please fill in all details to schedule your pickup.</span>
            </div>

            {/* Sender */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                <UserIcon className="w-4 h-4" />Sender Information
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">First Name <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="First name" value={sFname} onChange={e => setSFname(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Last Name <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Last name" value={sLname} onChange={e => setSLname(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone Number <span className="text-red-400">*</span></label><input type="tel" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={sPhone} onChange={e => setSPhone(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">WhatsApp Number <span className="text-red-400">*</span></label><input type="tel" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={sWa} onChange={e => setSWa(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address <span className="text-red-400">*</span></label><input type="email" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="your@email.com" value={sEmail} onChange={e => setSEmail(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Pickup Street Address <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="House no., street name" value={sAddr} onChange={e => setSAddr(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State <span className="text-red-400">*</span></label>
                  <SearchDropdown id="s-state" placeholder="State..." value={sState} onChange={setSState} options={NG_STATES} />
                </div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">City / LGA <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="City / LGA" value={sCity} onChange={e => setSCity(e.target.value)} /></div>
              </div>
            </div>

            {/* Package */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                <PackageIcon className="w-4 h-4" />Package / Item Details
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Type of Item <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {ITEM_TYPES.map(it => (
                    <button
                      key={it.label}
                      type="button"
                      onClick={() => setItemType(it.label)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 px-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer",
                        itemType === it.label
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/5 bg-[#050608] text-muted hover:border-primary/30 hover:text-white'
                      )}
                    >
                      <span className="text-lg"><it.icon className="w-5 h-5 text-current" /></span>
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Item Description <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Detailed description (e.g. 2 pairs of shoes, size 42)" value={itemDesc} onChange={e => setItemDesc(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Weight (KG) <span className="text-red-400">*</span></label><input type="number" step="0.1" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="0.0" value={wbWeight} onChange={e => setWbWeight(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Declared Value (₦)</label><input type="number" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="₦0" value={wbValue} onChange={e => setWbValue(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Dimensions (optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="L (cm)" value={dimL} onChange={e => setDimL(e.target.value)} />
                  <input type="number" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="W (cm)" value={dimW} onChange={e => setDimW(e.target.value)} />
                  <input type="number" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="H (cm)" value={dimH} onChange={e => setDimH(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="wb-fragile"
                  className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:border-white/10 transition-all"
                >
                  <input type="checkbox" id="wb-fragile" checked={fragile} onChange={e => setFragile(e.target.checked)} className="w-4 h-4 accent-[#39FF14] rounded cursor-pointer" />
                  <span className="text-xs text-muted">⚠️ Fragile — handle with care</span>
                </label>
                <label
                  htmlFor="wb-insurance"
                  className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:border-white/10 transition-all"
                >
                  <input type="checkbox" id="wb-insurance" checked={insurance} onChange={e => setInsurance(e.target.checked)} className="w-4 h-4 accent-[#39FF14] rounded cursor-pointer" />
                  <span className="text-xs text-muted">🛡️ Add shipping insurance</span>
                </label>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-white/5">
                <Navigation2Icon className="w-4 h-4" />Receiver Details
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">First Name <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="First name" value={rFname} onChange={e => setRFname(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Last Name <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Last name" value={rLname} onChange={e => setRLname(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone Number <span className="text-red-400">*</span></label><input type="tel" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Include country code" value={rPhone} onChange={e => setRPhone(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address <span className="text-red-400">*</span></label><input type="email" className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="receiver@email.com" value={rEmail} onChange={e => setREmail(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Delivery Address — Street <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="Street number and name" value={rAddr} onChange={e => setRAddr(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">City <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="City" value={rCity} onChange={e => setRCity(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">State / Province <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="State/Province" value={rState} onChange={e => setRState(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">ZIP / Postal Code <span className="text-red-400">*</span></label><input className="w-full bg-[#050608] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/50" placeholder="e.g. 10001" value={rZip} onChange={e => setRZip(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Country</label><input className="w-full bg-[#050608]/50 border border-white/5 rounded-xl px-3 py-3 text-xs text-muted focus:outline-none" value={tab === 'intl' ? intlDestCountry : 'Nigeria'} readOnly /></div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(3)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button
                onClick={() => goStep(5)}
                className="flex-1 flex items-center justify-center gap-2 py-4"
              >
                <CheckCircleIcon className="w-4 h-4 text-black" />
                Submit Waybill & Generate Receipt
              </Button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 6: RECEIPT ══════════════════════ */}
        {step === 5 && (
          <motion.div key="step6" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-primary/20 to-emerald-900/30 border border-primary/20 rounded-2xl p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(57,255,20,0.2)]">
                <CheckCircleIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-black text-white font-display">Shipment Confirmed! 🎉</h2>
              <p className="text-xs text-muted">Your waybill has been generated successfully.</p>
              <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-5 py-2">
                <p className="text-sm font-black text-primary tracking-[0.15em] font-mono">{waybillNo}</p>
              </div>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">

              {/* Shipment Info */}
              <div className="border-b border-white/5">
                <div className="bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold text-muted uppercase tracking-wider">📋 Shipment Info</div>
                {[
                  { label: 'Waybill No.', value: waybillNo },
                  { label: 'Date', value: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Route', value: route },
                  { label: 'Courier', value: selectedCourier?.name || '—' },
                  { label: 'Speed', value: speedObj?.label || '—' },
                  { label: 'Est. Delivery', value: speedObj?.desc.split('·')[1]?.trim() || '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-white/[0.03] text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Package */}
              <div className="border-b border-white/5">
                <div className="bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold text-muted uppercase tracking-wider">📦 Package</div>
                {[
                  { label: 'Weight', value: `${wbWeight || weight} kg` },
                  { label: 'Item Type', value: itemType || '—' },
                  { label: 'Description', value: itemDesc || '—' },
                  { label: 'Fragile', value: fragile ? 'Yes ⚠️' : 'No' },
                  { label: 'Insured', value: insurance ? 'Yes 🛡️' : 'No' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-white/[0.03] text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Payment */}
              <div className="border-b border-white/5">
                <div className="bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold text-muted uppercase tracking-wider">💳 Payment</div>
                {[
                  { label: 'Base Charge', value: `₦${totalPrice.toLocaleString()}` },
                  { label: 'Fuel Surcharge (8%)', value: `₦${fuel.toLocaleString()}` },
                  { label: 'VAT (7.5%)', value: `₦${vat.toLocaleString()}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-white/[0.03] text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-3 bg-primary/5">
                  <span className="text-sm font-bold text-white">Amount Paid</span>
                  <span className="text-lg font-black text-primary">₦{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-5 py-2.5 text-xs border-t border-white/[0.03]">
                  <span className="text-muted">Method</span>
                  <span className="text-white font-bold capitalize">{paymentMethod === 'transfer' ? 'Direct Bank Transfer' : paymentMethod}</span>
                </div>
                <div className="flex justify-between px-5 py-2.5 text-xs border-t border-white/[0.03]">
                  <span className="text-muted">Status</span>
                  {paymentMethod === 'transfer' ? (
                    <span className="text-yellow-400 font-bold">⏳ Pending Admin Approval</span>
                  ) : (
                    <span className="text-primary font-bold">✅ Confirmed</span>
                  )}
                </div>
              </div>

              {/* Sender */}
              <div className="border-b border-white/5">
                <div className="bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold text-muted uppercase tracking-wider">👤 Sender</div>
                {[
                  { label: 'Name', value: `${sFname} ${sLname}`.trim() || (guestName || '—') },
                  { label: 'Phone', value: sPhone || '—' },
                  { label: 'WhatsApp', value: sWa || (guestWa || '—') },
                  { label: 'Pickup Address', value: sAddr ? `${sAddr}, ${sCity}, ${sState}` : '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-white/[0.03] text-xs">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Receiver */}
              <div>
                <div className="bg-white/[0.02] px-5 py-2.5 text-[10px] font-bold text-muted uppercase tracking-wider">📬 Receiver</div>
                {[
                  { label: 'Name', value: `${rFname} ${rLname}`.trim() || '—' },
                  { label: 'Phone', value: rPhone || '—' },
                  { label: 'Email', value: rEmail || '—' },
                  { label: 'Address', value: rAddr ? `${rAddr}, ${rCity}, ${rState} ${rZip}` : '—' },
                  { label: 'Country', value: tab === 'intl' ? intlDestCountry : 'Nigeria' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-white/[0.03] text-xs last:border-0">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-white font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Receipt Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white">📤 Send Receipt To:</p>
              <button
                type="button"
                onClick={() => alert('✅ Receipt sent to WhatsApp!')}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1aad52] text-white font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-[0_4px_20px_rgba(37,211,102,0.25)]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send to WhatsApp
              </button>
              <button
                type="button"
                onClick={() => alert('✅ Receipt sent to Email!')}
                className="w-full flex items-center justify-center gap-2 bg-[#0D1117] border border-white/10 hover:border-white/20 text-white font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                <MailIcon className="w-5 h-5" />
                Send to Email
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 text-muted font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                <PrinterIcon className="w-5 h-5" />
                Print / Download PDF
              </button>
            </div>

            {/* Pickup notice */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl px-5 py-4 text-center space-y-1">
              <p className="text-xs font-bold text-primary">📞 Our team will contact you within 2 hours to arrange pickup.</p>
              <p className="text-[11px] text-muted">Need help? WhatsApp: <strong className="text-primary">+234 900 123 4567</strong></p>
            </div>

            <Button
              variant="outline"
              onClick={() => { goStep(0); setSelectedSpeed(null); setSelectedCourier(null) }}
              className="w-full flex items-center justify-center gap-2"
            >
              <RotateCcwIcon className="w-4 h-4" />
              Ship Another Package
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

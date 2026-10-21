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
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          id={id}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <ChevronDownIcon className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 transition-transform", open && 'rotate-180')} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-xs text-slate-500 text-center">No results found</p>
            ) : filtered.map(opt => (
              <button
                key={opt}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer border-b border-slate-100 last:border-0",
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
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null)

  // Currency State
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN')
  const USD_RATE = 1500

  const formatPrice = (ngnAmount: number) => {
    if (currency === 'USD') {
      const usd = ngnAmount / USD_RATE
      return `$${usd.toFixed(2)}`
    }
    return `₦${ngnAmount.toLocaleString()}`
  }

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
    return formatPrice(p)
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
            <h1 className="text-lg font-black text-slate-900 font-display uppercase tracking-wider">Shipping Calculator</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Step {step + 1} of 6 — {STEPS[step]}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Currency Toggle */}
            <div className="inline-flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setCurrency('NGN')}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                  currency === 'NGN' ? "bg-primary text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                )}
              >
                ₦ NGN
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                  currency === 'USD' ? "bg-primary text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                )}
              >
                $ USD
              </button>
            </div>

            <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
              {STEPS[step]}
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                i <= step ? 'text-primary' : 'text-slate-400'
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
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Shipping Calculator</h2>
              <p className="text-xs text-slate-500">Enter your route and shipment details to get an instant quote.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl overflow-hidden p-1">
              <button
                type="button"
                onClick={() => setTab('intl')}
                className={cn("flex-1 py-2.5 text-xs font-bold text-center transition-all cursor-pointer rounded-lg", tab === 'intl' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900')}
              >🌍 International</button>
              <button
                type="button"
                onClick={() => setTab('local')}
                className={cn("flex-1 py-2.5 text-xs font-bold text-center transition-all cursor-pointer rounded-lg", tab === 'local' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900')}
              >🇳🇬 Local (Nigeria)</button>
            </div>

            {tab === 'intl' ? (
              <div className="space-y-4">
                {/* Pickup */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <MapPinIcon className="w-4 h-4" />Pickup Location
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Country <span className="text-red-500">*</span> <span className="text-slate-400 font-normal normal-case">(Shipping from)</span></label>
                    <SearchDropdown id="pickup-country" placeholder="Search country..." value={intlPickupCountry} onChange={setIntlPickupCountry} options={COUNTRIES} showFlags />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter state" value={intlPickupState} onChange={e => setIntlPickupState(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter city" value={intlPickupCity} onChange={e => setIntlPickupCity(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <Navigation2Icon className="w-4 h-4" />Destination
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Country <span className="text-red-500">*</span></label>
                    <SearchDropdown id="dest-country" placeholder="Search destination country..." value={intlDestCountry} onChange={setIntlDestCountry} options={COUNTRIES} showFlags />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter state" value={intlDestState} onChange={e => setIntlDestState(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter city" value={intlDestCity} onChange={e => setIntlDestCity(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Shipment details */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <PackageIcon className="w-4 h-4" />Shipment Details
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Weight (KG) <span className="text-red-500">*</span></label>
                    <input type="number" min="0.1" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter weight in kilograms" value={intlWeight} onChange={e => setIntlWeight(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Declared Value ₦ <span className="text-slate-400 font-normal normal-case">(for insurance, optional)</span></label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="e.g. 50000" value={intlValue} onChange={e => setIntlValue(e.target.value)} />
                  </div>
                </div>
              </div>
            ) : (
              /* LOCAL NIGERIA */
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <MapPinIcon className="w-4 h-4" />Pickup State (Nigeria 🇳🇬)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                    <SearchDropdown id="pickup-local" placeholder="Search state..." value={localPickupState} onChange={setLocalPickupState} options={NG_STATES} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City / LGA <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter city or LGA" value={localPickupCity} onChange={e => setLocalPickupCity(e.target.value)} />
                  </div>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <Navigation2Icon className="w-4 h-4" />Destination State (Nigeria 🇳🇬)
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                    <SearchDropdown id="dest-local" placeholder="Search state..." value={localDestState} onChange={setLocalDestState} options={NG_STATES} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City / LGA <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter city or LGA" value={localDestCity} onChange={e => setLocalDestCity(e.target.value)} />
                  </div>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                    <PackageIcon className="w-4 h-4" />Shipment Details
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Weight (KG) <span className="text-red-500">*</span></label>
                    <input type="number" min="0.1" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter weight in kilograms" value={localWeight} onChange={e => setLocalWeight(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <Button
              disabled={!canProceedStep1()}
              onClick={() => goStep(1)}
              className="w-full py-4 flex items-center justify-center gap-2 shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              <CheckCircleIcon className="w-4 h-4 text-white" />
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
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Select Delivery Speed</h2>
              <p className="text-xs text-slate-500">Choose how fast you need your package delivered.</p>
            </div>

            {/* Route info banner */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs shadow-xs">
              <InfoIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-slate-600">Route: <strong className="text-slate-900">{route}</strong>&nbsp;·&nbsp;Weight: <strong className="text-slate-900">{weight} kg</strong></span>
            </div>

            <div className="space-y-3">
              {SPEED_OPTIONS.map(sp => (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpeed(sp.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left shadow-xs",
                    selectedSpeed === sp.id
                      ? 'border-primary bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-primary/40'
                  )}
                >
                  {/* Radio */}
                  <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all", selectedSpeed === sp.id ? 'border-primary bg-primary' : 'border-slate-300')}>
                    {selectedSpeed === sp.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary flex-shrink-0"><sp.icon className="w-6 h-6 text-current" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{sp.label}</p>
                    <p className="text-[11px] text-slate-500">{sp.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-primary">×{sp.multiplier}</p>
                    <p className="text-[10px] text-slate-500">{sp.badge}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(0)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button disabled={!selectedSpeed} onClick={() => goStep(2)} className="flex-1 flex items-center justify-center gap-1.5 text-white bg-primary hover:bg-primary/90">
                Continue to Courier<ArrowRightIcon className="w-3.5 h-3.5 text-white" />
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
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Choose Your Courier</h2>
              <p className="text-xs text-slate-500">Select the best carrier for your shipment. Prices are calculated for your route and weight.</p>
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
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative overflow-hidden shadow-xs",
                      isSelected
                        ? 'border-primary bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-primary/40'
                    )}
                  >
                    {/* Badge */}
                    {courier.badge && (
                      <span className={cn(
                        "absolute top-0 right-0 text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider",
                        courier.badge === 'Recommended' ? 'bg-primary text-white' : 'bg-amber-100 text-amber-800'
                      )}>{courier.badge}</span>
                    )}
                    {/* Radio */}
                    <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all", isSelected ? 'border-primary bg-primary' : 'border-slate-300')}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    {/* Logo */}
                    <div className="w-16 h-10 bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                      <img src={courier.logo} alt={courier.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{courier.name}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {courier.tracking && <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">✓ Tracking</span>}
                        {courier.insurance && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">✓ Insured</span>}
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold border border-slate-200">{courier.pickup}</span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-primary">{formatPrice(price)}</p>
                      <p className="text-[10px] text-slate-500">total est.</p>
                      <span className="text-[8px] text-primary font-mono block mt-0.5 font-bold">99.4% SLA</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs shadow-xs">
              <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-amber-800">Prices are estimates. Final cost may vary based on actual dimensions, volumetric weight, and customs charges.</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(1)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button disabled={!selectedCourier} onClick={() => goStep(3)} className="flex-1 flex items-center justify-center gap-1.5 text-white bg-primary hover:bg-primary/90">
                Continue to Payment<ArrowRightIcon className="w-3.5 h-3.5 text-white" />
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
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Account & Payment</h2>
              <p className="text-xs text-slate-500">Sign in, create an account, or continue as guest.</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Review before proceeding to payment</p>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { label: 'Route', value: route },
                  { label: 'Courier', value: selectedCourier?.name || '—' },
                  { label: 'Speed', value: speedObj ? `${speedObj.label} (${speedObj.desc.split('·')[1].trim()})` : '—' },
                  { label: 'Weight', value: `${weight} kg` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-3 text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-4 bg-emerald-50/50 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total Amount</span>
                  <span className="text-xl font-black text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Auth Tabs */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-200 bg-slate-50/50">
                {(['signin', 'signup', 'guest'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAuthTab(t)}
                    className={cn("flex-1 py-3.5 text-xs font-bold capitalize text-center transition-all cursor-pointer border-b-2",
                      authTab === t ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-900'
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
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                      <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password</label>
                      <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter your password" />
                    </div>
                    <Button className="w-full text-white bg-primary hover:bg-primary/90">🔒 Sign In & Continue</Button>
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or continue with</span><div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <button type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl py-3 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-xs">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                  </>
                )}

                {authTab === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">First Name</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="First name" /></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Last Name</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Last name" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="your@email.com" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone / WhatsApp</label><input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Create password" /></div>
                    <Button className="w-full text-white bg-primary hover:bg-primary/90">🔒 Create Account & Continue</Button>
                  </>
                )}

                {authTab === 'guest' && (
                  <>
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-center space-y-1">
                      <div className="text-2xl">👤</div>
                      <p className="text-xs font-bold text-slate-900">Continue as Guest</p>
                      <p className="text-[11px] text-slate-600">No account needed. Receipt will be sent via WhatsApp and/or Email after payment.</p>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Enter your full name" value={guestName} onChange={e => setGuestName(e.target.value)} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">WhatsApp Number <span className="text-red-500">*</span></label><input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={guestWa} onChange={e => setGuestWa(e.target.value)} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email <span className="text-slate-400 font-normal normal-case">(optional)</span></label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="your@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} /></div>
                  </>
                )}

                {/* Payment Method Selector */}
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-xs", paymentMethod === 'paystack' ? 'border-primary bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'paystack' ? 'border-primary bg-primary' : 'border-slate-300')}>
                        {paymentMethod === 'paystack' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-900">Paystack</span>
                        <p className="text-[10px] text-slate-500">Card, USSD, Bank Transfer via Paystack</p>
                      </div>
                    </label>

                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-xs", paymentMethod === 'monnify' ? 'border-primary bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'monnify' ? 'border-primary bg-primary' : 'border-slate-300')}>
                        {paymentMethod === 'monnify' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'monnify'} onChange={() => setPaymentMethod('monnify')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-900">Monnify</span>
                        <p className="text-[10px] text-slate-500">Secure payments with Monnify</p>
                      </div>
                    </label>

                    <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer shadow-xs", paymentMethod === 'transfer' ? 'border-primary bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-primary/30')}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === 'transfer' ? 'border-primary bg-primary' : 'border-slate-300')}>
                        {paymentMethod === 'transfer' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-900">Direct Bank Transfer</span>
                        <p className="text-[10px] text-slate-500">Make a direct transfer and upload proof</p>
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
                        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 mt-4 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Our Bank Details</p>
                            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                              <p className="text-xs text-slate-600 mb-1">Bank Name: <strong className="text-slate-900">Zenith Bank</strong></p>
                              <p className="text-xs text-slate-600 mb-1">Account Name: <strong className="text-slate-900">Spatial Express Logistics</strong></p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-600">Account No: <strong className="text-slate-900 font-mono text-sm tracking-wider">1234567890</strong></p>
                                <button className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">Copy</button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Upload Proof of Payment <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-white relative shadow-xs">
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
                              <UploadIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                              <p className="text-xs text-slate-900 font-bold">{proofOfPayment ? proofOfPayment.name : 'Click or drag file here'}</p>
                              <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, PDF</p>
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
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold shadow-sm"
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
                <Button onClick={() => goStep(4)} className="w-full flex items-center justify-center gap-1.5 text-white bg-primary hover:bg-primary/90">
                  Continue<ArrowRightIcon className="w-3.5 h-3.5 text-white" />
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
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Waybill Form</h2>
              <p className="text-xs text-slate-500">Complete your shipment details. Fields marked <span className="text-red-500">*</span> are compulsory.</p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs shadow-xs">
              <CheckCircleIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-emerald-800 font-semibold">Payment confirmed ✅ — Please fill in all details to schedule your pickup.</span>
            </div>

            {/* Sender */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                <UserIcon className="w-4 h-4" />Sender Information
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">First Name <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="First name" value={sFname} onChange={e => setSFname(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Last Name <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Last name" value={sLname} onChange={e => setSLname(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label><input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={sPhone} onChange={e => setSPhone(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">WhatsApp Number <span className="text-red-500">*</span></label><input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="+234 800 000 0000" value={sWa} onChange={e => setSWa(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="your@email.com" value={sEmail} onChange={e => setSEmail(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pickup Street Address <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="House no., street name" value={sAddr} onChange={e => setSAddr(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                  <SearchDropdown id="s-state" placeholder="State..." value={sState} onChange={setSState} options={NG_STATES} />
                </div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City / LGA <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="City / LGA" value={sCity} onChange={e => setSCity(e.target.value)} /></div>
              </div>
            </div>

            {/* Package */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                <PackageIcon className="w-4 h-4" />Package / Item Details
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Type of Item <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {ITEM_TYPES.map(it => (
                    <button
                      key={it.label}
                      type="button"
                      onClick={() => setItemType(it.label)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 px-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer",
                        itemType === it.label
                          ? 'border-primary bg-emerald-50 text-primary shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30 hover:text-slate-900'
                      )}
                    >
                      <span className="text-lg"><it.icon className="w-5 h-5 text-current" /></span>
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Item Description <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Detailed description (e.g. 2 pairs of shoes, size 42)" value={itemDesc} onChange={e => setItemDesc(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Weight (KG) <span className="text-red-500">*</span></label><input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="0.0" value={wbWeight} onChange={e => setWbWeight(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Declared Value (₦)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="₦0" value={wbValue} onChange={e => setWbValue(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Dimensions (optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="L (cm)" value={dimL} onChange={e => setDimL(e.target.value)} />
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="W (cm)" value={dimW} onChange={e => setDimW(e.target.value)} />
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="H (cm)" value={dimH} onChange={e => setDimH(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="wb-fragile"
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-slate-300 transition-all"
                >
                  <input type="checkbox" id="wb-fragile" checked={fragile} onChange={e => setFragile(e.target.checked)} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span className="text-xs text-slate-700">⚠️ Fragile — handle with care</span>
                </label>
                <label
                  htmlFor="wb-insurance"
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-slate-300 transition-all"
                >
                  <input type="checkbox" id="wb-insurance" checked={insurance} onChange={e => setInsurance(e.target.checked)} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span className="text-xs text-slate-700">🛡️ Add shipping insurance</span>
                </label>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-primary pb-2 border-b border-slate-100">
                <Navigation2Icon className="w-4 h-4" />Receiver Details
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">First Name <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="First name" value={rFname} onChange={e => setRFname(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Last Name <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Last name" value={rLname} onChange={e => setRLname(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label><input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Include country code" value={rPhone} onChange={e => setRPhone(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="receiver@email.com" value={rEmail} onChange={e => setREmail(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Delivery Address — Street <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="Street number and name" value={rAddr} onChange={e => setRAddr(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="City" value={rCity} onChange={e => setRCity(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State / Province <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="State/Province" value={rState} onChange={e => setRState(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">ZIP / Postal Code <span className="text-red-500">*</span></label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/50" placeholder="e.g. 10001" value={rZip} onChange={e => setRZip(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Country</label><input className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-600 focus:outline-none" value={tab === 'intl' ? intlDestCountry : 'Nigeria'} readOnly /></div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goStep(3)} className="flex items-center gap-1.5 px-5">
                <ArrowLeftIcon className="w-3.5 h-3.5" />Back
              </Button>
              <Button
                onClick={() => goStep(5)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-white bg-primary hover:bg-primary/90 shadow-sm"
              >
                <CheckCircleIcon className="w-4 h-4 text-white" />
                Submit Waybill & Generate Receipt
              </Button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ STEP 6: RECEIPT ══════════════════════ */}
        {step === 5 && (
          <motion.div key="step6" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Success Header */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircleIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-black text-slate-900 font-display">Shipment Confirmed! 🎉</h2>
              <p className="text-xs text-slate-600">Your waybill has been generated successfully.</p>
              <div className="inline-block bg-white border border-slate-200 rounded-xl px-5 py-2 shadow-xs">
                <p className="text-sm font-black text-primary tracking-[0.15em] font-mono">{waybillNo}</p>
              </div>
            </div>

            {/* Receipt Card with Air Waybill Barcode Header */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Air Waybill Barcode Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <span>SPATIAL AIR WAYBILL (AWB)</span>
                    <span>·</span>
                    <span className="text-primary font-bold">{selectedCourier?.name || 'EXPRESS AIR'}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">ROUTING: {route} · CARGO CLASS: {itemType || 'GEN-CARGO'}</p>
                </div>

                {/* SVG Code 128 Barcode Mock */}
                <div className="flex flex-col items-center">
                  <svg width="180" height="42" viewBox="0 0 180 42" className="text-slate-900">
                    <rect x="0" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="5" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="9" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="15" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="18" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="23" y="0" width="5" height="34" fill="currentColor" />
                    <rect x="30" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="34" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="40" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="43" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="48" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="52" y="0" width="6" height="34" fill="currentColor" />
                    <rect x="60" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="64" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="69" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="72" y="0" width="5" height="34" fill="currentColor" />
                    <rect x="79" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="84" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="88" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="94" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="97" y="0" width="5" height="34" fill="currentColor" />
                    <rect x="104" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="108" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="114" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="119" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="122" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="128" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="132" y="0" width="5" height="34" fill="currentColor" />
                    <rect x="139" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="144" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="148" y="0" width="4" height="34" fill="currentColor" />
                    <rect x="154" y="0" width="1" height="34" fill="currentColor" />
                    <rect x="157" y="0" width="3" height="34" fill="currentColor" />
                    <rect x="162" y="0" width="5" height="34" fill="currentColor" />
                    <rect x="169" y="0" width="2" height="34" fill="currentColor" />
                    <rect x="173" y="0" width="3" height="34" fill="currentColor" />
                    <text x="90" y="42" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" fontWeight="bold">{waybillNo}</text>
                  </svg>
                </div>
              </div>

              {/* Shipment Info */}
              <div className="border-b border-slate-200">
                <div className="bg-slate-50 px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">📋 Shipment Info</div>
                {[
                  { label: 'Waybill No.', value: waybillNo },
                  { label: 'Date', value: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Route', value: route },
                  { label: 'Courier', value: selectedCourier?.name || '—' },
                  { label: 'Speed', value: speedObj?.label || '—' },
                  { label: 'Est. Delivery', value: speedObj?.desc.split('·')[1]?.trim() || '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-slate-100 text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Package */}
              <div className="border-b border-slate-200">
                <div className="bg-slate-50 px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">📦 Package</div>
                {[
                  { label: 'Weight', value: `${wbWeight || weight} kg` },
                  { label: 'Item Type', value: itemType || '—' },
                  { label: 'Description', value: itemDesc || '—' },
                  { label: 'Fragile', value: fragile ? 'Yes ⚠️' : 'No' },
                  { label: 'Insured', value: insurance ? 'Yes 🛡️' : 'No' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-slate-100 text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Payment */}
              <div className="border-b border-slate-200">
                <div className="bg-slate-50 px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">💳 Payment</div>
                {[
                  { label: 'Base Charge', value: `₦${totalPrice.toLocaleString()}` },
                  { label: 'Fuel Surcharge (8%)', value: `₦${fuel.toLocaleString()}` },
                  { label: 'VAT (7.5%)', value: `₦${vat.toLocaleString()}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-slate-100 text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-3 bg-emerald-50/60 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Amount Paid</span>
                  <span className="text-lg font-black text-primary">₦{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-5 py-2.5 text-xs border-t border-slate-100">
                  <span className="text-slate-500">Method</span>
                  <span className="text-slate-900 font-bold capitalize">{paymentMethod === 'transfer' ? 'Direct Bank Transfer' : paymentMethod}</span>
                </div>
                <div className="flex justify-between px-5 py-2.5 text-xs border-t border-slate-100">
                  <span className="text-slate-500">Status</span>
                  {paymentMethod === 'transfer' ? (
                    <span className="text-amber-600 font-bold">⏳ Pending Admin Approval</span>
                  ) : (
                    <span className="text-primary font-bold">✅ Confirmed</span>
                  )}
                </div>
              </div>

              {/* Sender */}
              <div className="border-b border-slate-200">
                <div className="bg-slate-50 px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">👤 Sender</div>
                {[
                  { label: 'Name', value: `${sFname} ${sLname}`.trim() || (guestName || '—') },
                  { label: 'Phone', value: sPhone || '—' },
                  { label: 'WhatsApp', value: sWa || (guestWa || '—') },
                  { label: 'Pickup Address', value: sAddr ? `${sAddr}, ${sCity}, ${sState}` : '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-slate-100 text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Receiver */}
              <div>
                <div className="bg-slate-50 px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">📬 Receiver</div>
                {[
                  { label: 'Name', value: `${rFname} ${rLname}`.trim() || '—' },
                  { label: 'Phone', value: rPhone || '—' },
                  { label: 'Email', value: rEmail || '—' },
                  { label: 'Address', value: rAddr ? `${rAddr}, ${rCity}, ${rState} ${rZip}` : '—' },
                  { label: 'Country', value: tab === 'intl' ? intlDestCountry : 'Nigeria' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between px-5 py-2.5 border-b border-slate-100 text-xs last:border-0">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[55%]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Receipt Buttons */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-900">Forward Official Waybill & Commercial Manifest:</p>
              
              {dispatchNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-primary shrink-0" />
                  <span>{dispatchNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchNotice('Air Waybill dispatched to registered WhatsApp number.')}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1aad52] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchNotice('Official commercial invoice and packing slip emailed.')}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                >
                  <MailIcon className="w-4 h-4" />
                  <span>Email PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                >
                  <PrinterIcon className="w-4 h-4 text-slate-600" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Pickup notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-center space-y-1">
              <p className="text-xs font-bold text-primary">📞 Our team will contact you within 2 hours to arrange pickup.</p>
              <p className="text-[11px] text-slate-600">Need help? WhatsApp: <strong className="text-primary">+234 900 123 4567</strong></p>
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

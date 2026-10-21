import React, { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}
import { DollarSignIcon, PackageIcon, ClockIcon, CheckCircleIcon, TrendingUpIcon, ActivityIcon, MapPinIcon, SettingsIcon, SlidersIcon, UploadIcon, DownloadIcon, Undo2Icon, Redo2Icon, PlusIcon, TrashIcon, SearchIcon, AlertTriangleIcon, RefreshCwIcon, Edit2Icon, TruckIcon } from '../components/ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { CountryFlag } from '../components/ui/CountryFlag'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  BarChart,
  Bar,
  Cell
} from 'recharts'

export default function AdminDashboard() {
  const {
    shipments,
    couriers,
    zones,
    priceMatrix,
    priceHistory,
    updatePriceMatrixCell,
    generatePrices,
    undoPriceEdit,
    redoPriceEdit,
    canUndo,
    canRedo,
    togglePartner,
    updatePartnerPriority,
    addZone,
    deleteZone,
    assignCountryToZone,
    confirmCountryTransfer,
    removeCountryFromZone,
    activeView,
    setActiveView
  } = useLogistics()

  // Zone Manager state
  const [selectedZoneId, setSelectedZoneId] = useState('zone-1')
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneDesc, setNewZoneDesc] = useState('')
  const [countrySearch, setCountrySearch] = useState('')

  // Zone Assignment Conflict State
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [conflictCountry, setConflictCountry] = useState<any>(null)
  const [conflictSourceZoneId, setConflictSourceZoneId] = useState('')
  const [conflictTargetZoneId, setConflictTargetZoneId] = useState('')

  // Price Matrix Editor state
  const [selectedCourierId, setSelectedCourierId] = useState('dhl')
  const [editingCell, setEditingCell] = useState<{ courierId: string; weight: number } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [justSavedCell, setJustSavedCell] = useState<{ courierId: string; weight: number } | null>(null)

  // Price Generator state
  const [basePrice, setBasePrice] = useState(6500)
  const [increment, setIncrement] = useState(800)
  const [roundingRule, setRoundingRule] = useState(50)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const weightTiers = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0]

  // All available countries for zone assignment
  const allCountries = [
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  ]

  // Recharts Mock Analytics Data
  const revenueChartData = [
    { date: 'Jul 06', revenue: 450000 },
    { date: 'Jul 07', revenue: 580000 },
    { date: 'Jul 08', revenue: 490000 },
    { date: 'Jul 09', revenue: 720000 },
    { date: 'Jul 10', revenue: 830000 },
    { date: 'Jul 11', revenue: 910000 },
    { date: 'Jul 12', revenue: 1050000 },
  ]

  const courierPerformanceData = [
    { name: 'DHL', rating: 98, latency: 1.2 },
    { name: 'FedEx', rating: 95, latency: 1.8 },
    { name: 'UPS', rating: 92, latency: 2.1 },
    { name: 'Aramex', rating: 88, latency: 3.5 },
  ]

  // --- Pricing Handlers ---
  const handleCellEditClick = (courierId: string, weight: number, currentValue: number) => {
    setEditingCell({ courierId, weight })
    setEditingValue(currentValue.toString())
  }

  const handleCellSave = (courierId: string, weight: number) => {
    const numeric = parseFloat(editingValue)
    if (!isNaN(numeric) && numeric > 0) {
      updatePriceMatrixCell(courierId, weight, numeric)
      setJustSavedCell({ courierId, weight })
      setTimeout(() => setJustSavedCell(null), 1000) // reset green flash
    }
    setEditingCell(null)
  }

  const handlePriceGeneration = (e: React.FormEvent) => {
    e.preventDefault()
    generatePrices(basePrice, increment, roundingRule)
    showToast("Pricing tiers regenerated successfully for all active carriers.")
  }

  // --- Zone Handlers ---
  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newZoneName) return
    addZone(newZoneName, newZoneDesc)
    setNewZoneName('')
    setNewZoneDesc('')
  }

  const handleCountryAssignClick = (country: any) => {
    const res = assignCountryToZone(country, selectedZoneId)
    if (res && res.conflict) {
      // Setup conflict modal
      setConflictCountry(country)
      setConflictSourceZoneId(res.originalZoneId || '')
      setConflictTargetZoneId(selectedZoneId)
      setShowConflictModal(true)
    }
  }

  const handleResolveConflictMove = () => {
    if (conflictCountry) {
      confirmCountryTransfer(conflictCountry, conflictSourceZoneId, conflictTargetZoneId)
      setShowConflictModal(false)
      setConflictCountry(null)
    }
  }

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0]

  return (
    <div className="space-y-8 select-none text-left pb-12">
      {/* Inline Feedback Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-extrabold cursor-pointer text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Tabs Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex border-b border-white/0 pb-0.5 gap-6 text-xs font-bold overflow-x-auto whitespace-nowrap custom-scrollbar max-w-full">
          {[
            { id: 'admin-overview', label: 'Operations Dashboard', icon: DollarSignIcon },
            { id: 'admin-partners', label: 'Courier Integration', icon: RefreshCwIcon },
            { id: 'admin-zones', label: 'Zones & Countries', icon: MapPinIcon },
            { id: 'admin-pricing-matrix', label: 'Price Matrix Editor', icon: SlidersIcon },
            { id: 'admin-reports', label: 'Version History', icon: ClockIcon }
          ].map(tab => {
            const Icon = tab.icon
            const isSelected = activeView === tab.id || (activeView === 'admin-shipments' && tab.id === 'admin-overview') || (activeView === 'admin-orders' && tab.id === 'admin-overview') || (activeView === 'admin-customers' && tab.id === 'admin-overview') || (activeView === 'admin-payments' && tab.id === 'admin-overview') || (activeView === 'admin-settings' && tab.id === 'admin-overview')
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={cn(
                  "relative pb-3 flex items-center gap-2 transition-all cursor-pointer z-10",
                  isSelected ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="adminTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-96 relative">
        <AnimatePresence mode="wait">
        
        {/* TAB 1: OPERATIONS DASHBOARD (KPI Charts) */}
        {activeView === 'admin-overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            
            {/* Operator KPI Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Gross Tariff Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 font-display mt-1">12,480,200 NGN</h3>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">▲ 14.2% growth (Weekly)</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Today's Shipments</span>
                  <h3 className="text-2xl font-black text-slate-900 font-display mt-1">245</h3>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">▲ 18 units in transit</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pending Pickups</span>
                  <h3 className="text-2xl font-black text-slate-900 font-display mt-1">78</h3>
                  <p className="text-[9px] text-amber-700 font-bold mt-1">● Awaiting driver dispatch</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Successful Deliveries</span>
                  <h3 className="text-2xl font-black text-slate-900 font-display mt-1">98%</h3>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Latency within SLA bounds</p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Gross Revenue Area Chart */}
              <Card className="glass-card border border-slate-200/90 p-5 lg:col-span-2 text-left space-y-4 bg-white shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Revenue Stream Ledger</h4>
                  <p className="text-[10px] text-slate-500">Daily aggregated checkout payments</p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `${(v/1000)}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Courier Performance bar chart */}
              <Card className="glass-card border border-slate-200/90 p-5 text-left space-y-4 bg-white shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Courier Performance Rating</h4>
                  <p className="text-[10px] text-slate-500">Average SLA delivery speed (Days)</p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courierPerformanceData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="latency" fill="#16a34a" radius={[4, 4, 0, 0]}>
                        {courierPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

            </div>

          </motion.div>
        )}

        {/* TAB 2: COURIER PARTNERS MANAGEMENT */}
        {activeView === 'admin-partners' && (
          <motion.div 
            key="partners"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Carrier Integration Controller</h3>
              <p className="text-[10px] text-slate-500">Enable couriers and prioritize operational dispatch</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {couriers.map((courier) => (
                <Card 
                  key={courier.id} 
                  className={cn(
                    "glass-card border p-5 space-y-5 text-left transition-all shadow-sm",
                    courier.enabled ? 'border-primary/40 bg-white' : 'border-slate-200 bg-slate-50 opacity-70'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-24 bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                      <img src={courier.logo} alt={courier.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </div>
                    
                    {/* Toggle switch */}
                    <div 
                      onClick={() => togglePartner(courier.id)}
                      className={cn(
                        "w-9 h-5 rounded-full relative cursor-pointer transition-all duration-300",
                        courier.enabled ? "bg-primary" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-xs",
                        courier.enabled ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{courier.name}</h4>
                    <p className="text-[10px] text-slate-500">Priority Dispatch Level: <span className="capitalize text-slate-900 font-bold">{courier.priority}</span></p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", courier.enabled ? "bg-primary animate-pulse" : "bg-red-500")} />
                      API Feed: {courier.enabled ? 'Optimal Connect' : 'Offline'}
                    </span>
                    
                    {/* Priority selectors */}
                    <select
                      value={courier.priority}
                      onChange={(e) => updatePartnerPriority(courier.id, e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] text-slate-800 focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="high">High priority</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low priority</option>
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: ZONES & COUNTRY MANAGER */}
        {activeView === 'admin-zones' && (
          <motion.div 
            key="zones"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            
            {/* Zones Sidebar */}
            <Card className="glass-card border border-slate-200/90 p-4 space-y-4 bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">Operational Zones</span>
              </div>

              <div className="space-y-2">
                {zones.map(z => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZoneId(z.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all block cursor-pointer",
                      selectedZoneId === z.id ? "bg-emerald-50 border-emerald-300 text-slate-900 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <p className="text-xs font-bold leading-none">{z.name}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-3">
                      <span>{z.description}</span>
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{z.countries.length} Countries</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create Zone Form */}
              <form onSubmit={handleCreateZone} className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Create Shipping Zone</h4>
                <Input
                  type="text"
                  required
                  placeholder="Zone Name"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-[11px] focus:bg-white"
                />
                <Input
                  type="text"
                  placeholder="Zone Description"
                  value={newZoneDesc}
                  onChange={(e) => setNewZoneDesc(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-[11px] focus:bg-white"
                />
                <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1 text-white bg-primary hover:bg-primary/90">
                  <PlusIcon className="w-3.5 h-3.5 text-white" />
                  <span>Create Zone</span>
                </Button>
              </form>
            </Card>

            {/* Zone detail countries allocations (Spreadsheet / List style) */}
            <Card className="glass-card border border-slate-200/90 p-5 lg:col-span-2 flex flex-col justify-between text-left bg-white shadow-sm">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{activeZone.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{activeZone.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => deleteZone(activeZone.id)} className="h-8 text-rose-600 hover:bg-rose-50 border-rose-200 text-[10px]">
                    <TrashIcon className="w-3.5 h-3.5 mr-1" /> Delete Zone
                  </Button>
                </div>

                {/* Country Search */}
                <div className="relative mb-4">
                  <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Assigned country list */}
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar text-xs">
                  {activeZone.countries.map(c => (
                    <div key={c.code} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CountryFlag countryCode={c.code} />
                        <span className="text-slate-900 font-semibold">{c.name}</span>
                        <span className="text-[9px] text-slate-500">({c.code})</span>
                      </div>
                      <button 
                        onClick={() => removeCountryFromZone(c.code, activeZone.id)}
                        className="text-rose-600 hover:underline font-bold text-[10px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {activeZone.countries.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-8">No countries assigned to this zone.</p>
                  )}
                </div>
              </div>

              {/* Assign country actions */}
              <div className="border-t border-slate-100 pt-4 mt-4 text-left">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2">Add country to this zone</h4>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar p-1">
                  {allCountries
                    .filter(c => !activeZone.countries.some(zc => zc.code === c.code))
                    .map(c => (
                      <button
                        key={c.code}
                        onClick={() => handleCountryAssignClick(c)}
                        className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded px-2.5 py-1 text-[10px] text-slate-800 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <CountryFlag countryCode={c.code} />
                        <span>{c.name}</span>
                        <PlusIcon className="w-3 h-3 text-primary ml-1" />
                      </button>
                    ))}
                </div>
              </div>
            </Card>

          </motion.div>
        )}

        {/* TAB 4: SPREADSHEET PRICE MATRIX EDITOR */}
        {activeView === 'admin-pricing-matrix' && (
          <motion.div 
            key="pricing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* Rate generator and history undo/redo actions */}
            <div className="glass-panel border border-slate-200/90 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white shadow-sm">
              
              {/* Undo Redo buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!canUndo} 
                  onClick={undoPriceEdit}
                  className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
                >
                  <Undo2Icon className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!canRedo} 
                  onClick={redoPriceEdit}
                  className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
                >
                  <Redo2Icon className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Price Spreadsheet Cache</span>
              </div>

              {/* Auto price generator wizard */}
              <form onSubmit={handlePriceGeneration} className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-600">Base:</span>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] px-2 py-1 rounded focus:bg-white focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-600">Incr:</span>
                  <input
                    type="number"
                    value={increment}
                    onChange={(e) => setIncrement(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] px-2 py-1 rounded focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-600">Round:</span>
                  <select
                    value={roundingRule}
                    onChange={(e) => setRoundingRule(parseInt(e.target.value) || 0)}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-[11px] px-1 py-1 rounded focus:outline-none cursor-pointer"
                  >
                    <option value="10">Nearest 10</option>
                    <option value="50">Nearest 50</option>
                    <option value="100">Nearest 100</option>
                  </select>
                </div>

                <Button type="submit" size="sm" className="h-8 text-[11px] font-bold text-white bg-primary hover:bg-primary/90">Generate Price Matrix</Button>
              </form>
            </div>

            {/* SPREADSHEET TABLE GRID CONTAINER */}
            <Card className="glass-card border border-slate-200/90 p-5 overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px] bg-slate-50/50">
                      <th className="py-3 px-2 border-r border-slate-200">Courier Provider</th>
                      {weightTiers.map(w => (
                        <th key={w} className="py-3 px-2 border-r border-slate-200 text-center">{w} kg</th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {couriers.map((courier) => {
                      const courierRates = priceMatrix[courier.id] || {}
                      return (
                        <motion.tr variants={itemVariants} key={courier.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-2 border-r border-slate-200 font-bold text-slate-900 flex items-center gap-2">
                            <span className={cn("w-1.5 h-1.5 rounded-full", courier.enabled ? 'bg-primary' : 'bg-rose-500')} />
                            <span>{courier.name}</span>
                          </td>
                          
                          {weightTiers.map(weight => {
                            const val = courierRates[weight] || 0
                            const isEditing = editingCell?.courierId === courier.id && editingCell?.weight === weight
                            const isJustSaved = justSavedCell?.courierId === courier.id && justSavedCell?.weight === weight
                            
                            return (
                              <td 
                                key={weight} 
                                className={cn(
                                  "p-1 border-r border-slate-100 text-center transition-colors min-w-[70px] duration-300 relative",
                                  isJustSaved && "bg-emerald-100 animate-pulse"
                                )}
                              >
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={() => handleCellSave(courier.id, weight)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCellSave(courier.id, weight)}
                                    autoFocus
                                    className="w-full bg-slate-50 border border-primary text-primary font-bold text-[10px] text-center py-1 focus:outline-none"
                                  />
                                ) : (
                                  <button
                                    onClick={() => handleCellEditClick(courier.id, weight, val)}
                                    className="w-full h-full text-center text-slate-700 hover:text-primary font-mono font-medium py-2 rounded transition-colors block cursor-pointer"
                                  >
                                    {val.toLocaleString()}
                                  </button>
                                )}
                              </td>
                            )
                          })}
                        </motion.tr>
                      )
                    })}
                  </motion.tbody>
                </table>
              </div>
            </Card>

          </motion.div>
        )}

        {/* TAB 5: VERSION PRICE HISTORY */}
        {activeView === 'admin-reports' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tariff Adjustment History Log</h3>
              <p className="text-[10px] text-slate-500">Audited registry of pricing updates</p>
            </div>

            <div className="space-y-4">
              {priceHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold">{item.changes}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>Operator: <span className="text-slate-900 font-semibold">{item.admin}</span></span>
                      <span>•</span>
                      <span>Carrier: <span className="text-slate-900 font-semibold">{item.courier}</span></span>
                      <span>•</span>
                      <span>Date: <span className="text-slate-900 font-semibold">{item.date}</span></span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={() => showToast("Price matrix restored to selected version.")} className="h-8 text-[10px] cursor-pointer">
                    Restore Version
                  </Button>
                </div>
              ))}
            </div>
            </Card>
          </motion.div>
        )}

        {/* TAB: SHIPMENTS */}
        {activeView === 'admin-shipments' && (
          <motion.div 
            key="admin-shipments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Network Shipments</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Global ledger of all dispatched manifests</p>
                </div>
                <div className="flex items-center gap-2">
                  <SearchIcon className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tracking ID or origin..."
                    className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:bg-white focus:outline-none focus:border-primary/50 text-xs text-slate-900 w-56 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-2">Tracking ID</th>
                      <th className="py-3 px-2">Sender</th>
                      <th className="py-3 px-2">Recipient</th>
                      <th className="py-3 px-2">Origin ➔ Destination</th>
                      <th className="py-3 px-2">Weight</th>
                      <th className="py-3 px-2">Courier</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-primary">{s.id}</td>
                        <td className="py-3.5 px-2 text-slate-900">Guest User</td>
                        <td className="py-3.5 px-2 text-slate-900">{s.recipientName}</td>
                        <td className="py-3.5 px-2 text-slate-600">{s.origin} ➔ {s.destination}</td>
                        <td className="py-3.5 px-2 text-slate-500">{s.weight} kg</td>
                        <td className="py-3.5 px-2 capitalize text-slate-700">{s.courier}</td>
                        <td className="py-3.5 px-2">
                          <Badge variant={
                            s.status === 'delivered' ? 'success' : 
                            ['customs', 'cancelled'].includes(s.status) ? 'danger' : 'warning'
                          }>
                            {s.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB: PENDING PICKUPS (ORDERS) */}
        {activeView === 'admin-orders' && (
          <motion.div 
            key="admin-orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Dispatches</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Awaiting driver assignment and pickup</p>
                </div>
                <Button size="sm" className="h-8 text-[10px] font-bold text-white bg-primary hover:bg-primary/90">Auto-Assign Drivers</Button>
              </div>

              <div className="space-y-4">
                {shipments.filter(s => s.status === 'processing').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] text-amber-700 font-bold">{s.id}</span>
                      <p className="text-xs font-bold text-slate-900 leading-none">From: {s.origin} • To: {s.destination}</p>
                      <p className="text-[10px] text-slate-600">Client: Guest User • Courier Pref: <span className="capitalize text-slate-900 font-semibold">{s.courier}</span></p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-[10px]">Assign Driver</Button>
                      <Button size="sm" className="h-8 text-[10px] text-white bg-primary hover:bg-primary/90">Mark as Picked Up</Button>
                    </div>
                  </div>
                ))}
                {shipments.filter(s => s.status === 'processing').length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-12">No pending pickups at this time.</p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB: CUSTOMERS */}
        {activeView === 'admin-customers' && (
          <motion.div 
            key="admin-customers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Directory</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Registered clients and platform users</p>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Joined</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="py-3.5 px-2 font-bold text-slate-900">Danny Client</td>
                      <td className="py-3.5 px-2 text-slate-600">danny@example.com</td>
                      <td className="py-3.5 px-2 text-slate-500">Customer</td>
                      <td className="py-3.5 px-2 text-slate-500">Jul 12, 2026</td>
                      <td className="py-3.5 px-2"><Badge variant="success">Active</Badge></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="py-3.5 px-2 font-bold text-slate-900">Dora Operator</td>
                      <td className="py-3.5 px-2 text-slate-600">dora@sel.com</td>
                      <td className="py-3.5 px-2 text-primary font-bold">Admin</td>
                      <td className="py-3.5 px-2 text-slate-500">Jan 01, 2026</td>
                      <td className="py-3.5 px-2"><Badge variant="success">Active</Badge></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="py-3.5 px-2 font-bold text-slate-900">Guest User</td>
                      <td className="py-3.5 px-2 text-slate-600">guest@unverified.com</td>
                      <td className="py-3.5 px-2 text-slate-500">Customer</td>
                      <td className="py-3.5 px-2 text-slate-500">Jul 14, 2026</td>
                      <td className="py-3.5 px-2"><Badge variant="warning">Unverified</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB: PAYMENTS */}
        {activeView === 'admin-payments' && (
          <motion.div 
            key="admin-payments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment Ledger</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Transaction histories and invoice settlements</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="px-3 py-1">Total Rev: 12,480,200 NGN</Badge>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-2">Invoice ID</th>
                      <th className="py-3 px-2">Tracking Ref</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Gateway</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s.invoiceId} className="border-b border-slate-100 hover:bg-slate-50/70">
                        <td className="py-3.5 px-2 font-bold text-slate-900">{s.invoiceId}</td>
                        <td className="py-3.5 px-2 text-primary font-bold">{s.id}</td>
                        <td className="py-3.5 px-2 text-slate-500">{s.createdDate}</td>
                        <td className="py-3.5 px-2 font-bold text-slate-900">{s.cost.toLocaleString()} NGN</td>
                        <td className="py-3.5 px-2 text-slate-600">Paystack</td>
                        <td className="py-3.5 px-2"><Badge variant="success">Paid</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB: SETTINGS */}
        {activeView === 'admin-settings' && (
          <motion.div 
            key="admin-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="glass-card border border-slate-200/90 p-5 space-y-5 text-left bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Preferences</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Configure platform behavior</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Require Puzzle Captcha</p>
                    <p className="text-[10px] text-slate-500">Enforce spatial verification on login</p>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-primary relative cursor-pointer">
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white shadow-xs" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Auto-assign Drivers</p>
                    <p className="text-[10px] text-slate-500">Automatically route pending pickups</p>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-slate-200 relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-xs" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Developer API Mode</p>
                    <p className="text-[10px] text-slate-500">Enable sandbox endpoints</p>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-slate-200 relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-xs" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card border border-slate-200/90 p-5 space-y-5 text-left bg-white shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Security & API Keys</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Manage external integrations</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Paystack Secret Key</label>
                  <Input type="password" value="sk_test_mock1234567890abcdef" readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">SendGrid API Key</label>
                  <Input type="password" value="SG.mock_email_key_xyz" readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                </div>
                <Button className="w-full text-white bg-primary hover:bg-primary/90" size="sm">Regenerate Keys</Button>
              </div>
            </Card>
          </motion.div>
        )}

        </AnimatePresence>
      </div>

      {/* ZONE MOVE CONFLICT WARNING MODAL */}
      {showConflictModal && conflictCountry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="glass-card border border-slate-200 max-w-sm w-full p-6 text-left space-y-4 bg-white shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangleIcon className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Country Conflict</h3>
            </div>
            
            <div className="p-4 text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-900 font-bold inline-flex items-center gap-1.5">{conflictCountry.name} <CountryFlag countryCode={conflictCountry.code} /></span> already belongs to <span className="text-slate-900 font-semibold">
                {zones.find(z => z.id === conflictSourceZoneId)?.name || 'another zone'}
              </span>.
            </div>
            
            <p className="text-xs text-slate-500">
              Do you want to transfer this country to the currently active zone? It will be automatically removed from its old zone allocation.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowConflictModal(false); setConflictCountry(null) }} size="sm">Cancel</Button>
              <Button type="button" onClick={handleResolveConflictMove} size="sm" className="text-white bg-primary hover:bg-primary/90">Transfer Country</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}

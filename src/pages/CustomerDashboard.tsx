import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}
import { LayoutDashboardIcon, CalendarIcon, HistoryIcon, FileTextIcon, BellIcon, HelpCircleIcon, PackageIcon, PlusIcon, SearchIcon, DownloadIcon, TrashIcon, SendIcon, MessageSquareIcon, XIcon } from '../components/ui/CustomIcons'
import { ShipmentProgressTracker } from '../components/ShipmentProgressTracker'
import { useLogistics, Shipment } from '../context/LogisticsContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

export default function CustomerDashboard() {
  const {
    shipments,
    notifications,
    supportTickets,
    couriers,
    bookPickupBooking,
    addSupportChatMessage,
    createSupportTicket,
    setSelectedTrackingId,
    setActiveView,
    activeView
  } = useLogistics()
  
  // State for pickup booking form
  const [pickupForm, setPickupForm] = useState({
    pickupAddress: '4 Victory Street, Port Harcourt, Rivers State',
    preferredDate: '2026-07-14',
    preferredTime: '10:00 AM - 01:00 PM',
    courierPreference: 'dhl',
    packageDescription: 'E-commerce cartons (Cosmetics)',
    insurance: true,
    specialInstructions: 'Handle with care. Call sender on arrival.'
  })

  // Support chat state
  const [activeTicketId, setActiveTicketId] = useState('ST-9021')
  const [chatInput, setChatInput] = useState('')
  const [newTicketSubject, setNewTicketSubject] = useState('')
  const [newTicketMessage, setNewTicketMessage] = useState('')
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [inspectingShipment, setInspectingShipment] = useState<Shipment | null>(null)
  const [dashboardToast, setDashboardToast] = useState<string | null>(null)

  // PDF Generation State
  const [printingShipment, setPrintingShipment] = useState<any>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  // Shipment History filter state
  const [historySearch, setHistorySearch] = useState('')

  // Calculate Overview sums
  const activeCount = shipments.filter(s => ['processing', 'in_transit', 'customs', 'picked_up'].includes(s.status)).length
  const completedCount = shipments.filter(s => s.status === 'delivered').length
  const totalSpend = shipments.reduce((sum, s) => sum + s.cost, 0)

  // Handles Booking
  const handleBookPickupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bookPickupBooking(pickupForm)
    setActiveView('history') // redirect to manifests history
  }

  // Handle Support message submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    addSupportChatMessage(activeTicketId, chatInput.trim())
    setChatInput('')
  }

  // Create new ticket
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return
    createSupportTicket(newTicketSubject, newTicketMessage)
    setNewTicketSubject('')
    setNewTicketMessage('')
    setShowNewTicketModal(false)
  }

  const activeTicket = supportTickets.find(t => t.id === activeTicketId) || supportTickets[0]

  // Export CSV mock trigger
  const triggerCsvExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Tracking ID,Courier,Origin,Destination,Cost,Status,Date"].join(",") + "\n"
      + shipments.map(s => [s.id, s.courier, s.origin, s.destination, s.cost, s.status, s.createdDate].join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "spatial_express_manifests.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export PDF mock trigger (Ledger)
  const triggerPdfExport = async () => {
    setIsGeneratingPdf(true)
    try {
      const doc = new jsPDF()
      doc.text("Spatial Express - Package Ledger", 14, 20)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
      
      let yPos = 40
      shipments.forEach((s, idx) => {
        if (yPos > 280) {
          doc.addPage()
          yPos = 20
        }
        doc.text(`${idx + 1}. ${s.id} | ${s.origin} to ${s.destination} | ${s.status} | ${s.cost} NGN`, 14, yPos)
        yPos += 10
      })
      
      doc.save("spatial_express_ledger.pdf")
    } catch (e) {
      console.error(e)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Generate Individual Receipt
  const generateInvoicePdf = (shipment: any) => {
    setPrintingShipment(shipment)
    setIsGeneratingPdf(true)
  }

  // Effect to capture the template once it renders with the specific shipment
  useEffect(() => {
    if (printingShipment && isGeneratingPdf) {
      const captureAndDownload = async () => {
        const element = document.getElementById('pdf-receipt-template')
        if (element) {
          try {
            // Add a small delay to ensure rendering and images load
            await new Promise(resolve => setTimeout(resolve, 300))
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0D1117' })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`Receipt_${printingShipment.invoiceId}.pdf`)
          } catch (err) {
            console.error("Failed to generate PDF:", err)
            setDashboardToast("Error generating PDF receipt. Please retry.")
          } finally {
            setPrintingShipment(null)
            setIsGeneratingPdf(false)
          }
        }
      }
      captureAndDownload()
    }
  }, [printingShipment, isGeneratingPdf])

  return (
    <div className="space-y-8 select-none text-left pb-12">
      {/* Toast alert banner */}
      <AnimatePresence>
        {dashboardToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm"
          >
            <span>{dashboardToast}</span>
            <button
              onClick={() => setDashboardToast(null)}
              className="text-amber-700 hover:text-amber-950 font-extrabold cursor-pointer text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overview Top Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Shipments</span>
            <h3 className="text-3xl font-black text-slate-900 font-display mt-1">{activeCount}</h3>
            <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Live manifests in transit</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Delivered Packages</span>
            <h3 className="text-3xl font-black text-slate-900 font-display mt-1">{completedCount}</h3>
            <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ 100% success routing</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card-hover border border-slate-200/90 p-5 bg-white shadow-sm h-full">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Tariff Spent</span>
            <h3 className="text-2xl md:text-3xl font-black text-primary font-display mt-1">{totalSpend.toLocaleString()} NGN</h3>
            <p className="text-[9px] text-slate-500 mt-1">Contract aggregate rates</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card-hover border border-slate-200/90 p-5 flex flex-col justify-between items-stretch bg-white shadow-sm h-full">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Operational Controls</span>
            <Button onClick={() => setActiveView('pickup')} size="sm" className="w-full flex items-center justify-center gap-1.5 mt-3 shadow-sm border-none font-bold text-white bg-primary hover:bg-primary/90">
              <PlusIcon className="w-3.5 h-3.5 text-white" />
              <span>Book New Pickup</span>
            </Button>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 pb-0.5 gap-6 text-xs font-bold overflow-x-auto whitespace-nowrap custom-scrollbar max-w-full">
        {[
          { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboardIcon },
          { id: 'pickup', label: 'Schedule Dispatch', icon: CalendarIcon },
          { id: 'history', label: 'Package Ledger', icon: HistoryIcon },
          { id: 'invoices', label: 'Billing Invoices', icon: FileTextIcon },
          { id: 'notifications', label: 'Alert Logs', icon: BellIcon },
          { id: 'support', label: 'Live Helpdesk', icon: HelpCircleIcon }
        ].map(tab => {
          const Icon = tab.icon
          const isSelected = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={cn(
                "relative pb-3 flex items-center gap-2 transition-all cursor-pointer z-10",
                isSelected ? "text-primary" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="customerTabUnderline"
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

      {/* Tab Panels */}
      <div className="min-h-96 relative">
        <AnimatePresence mode="wait">
        {/* TAB 1: OVERVIEW HOME */}
        {activeView === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Active shipment monitor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Spotlight Active Tracker */}
              {shipments.filter(s => s.status !== 'delivered').length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Manifest Pipeline
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Real-time Telemetry
                    </span>
                  </div>
                  <ShipmentProgressTracker
                    status={shipments.filter(s => s.status !== 'delivered')[0].status}
                    history={shipments.filter(s => s.status !== 'delivered')[0].history}
                    trackingId={shipments.filter(s => s.status !== 'delivered')[0].id}
                    courier={shipments.filter(s => s.status !== 'delivered')[0].courier}
                    origin={shipments.filter(s => s.status !== 'delivered')[0].origin}
                    destination={shipments.filter(s => s.status !== 'delivered')[0].destination}
                    estimatedDelivery={shipments.filter(s => s.status !== 'delivered')[0].estimatedDelivery}
                    currentLocation={
                      shipments.filter(s => s.status !== 'delivered')[0].history.filter(h => h.completed).slice(-1)[0]?.location
                    }
                  />
                </div>
              )}

              <Card className="glass-card border border-slate-200/90 p-5 shadow-sm bg-white">
                <CardHeader className="p-0 mb-4 flex justify-between items-center">
                  <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Manifest Monitoring</CardTitle>
                  <button onClick={() => setActiveView('history')} className="text-[10px] text-primary hover:underline font-bold cursor-pointer">View Ledger</button>
                </CardHeader>
                
                <CardContent className="p-0 space-y-4">
                  {shipments.filter(s => s.status !== 'delivered').map(s => (
                    <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] text-primary font-bold">{s.id}</span>
                        <p className="text-xs font-bold text-slate-900 leading-none">To: {s.recipientName} ({s.destination})</p>
                        <p className="text-[10px] text-slate-500">Courier: <span className="capitalize text-slate-700">{s.courier}</span> • {s.weight}kg</p>
                      </div>
                      
                      {/* Compact Progress Tracker */}
                      <div className="flex-1 w-full max-w-sm">
                        <ShipmentProgressTracker
                          status={s.status}
                          history={s.history}
                          trackingId={s.id}
                          compact={true}
                          layout="horizontal"
                          interactive={false}
                          className="bg-transparent border-none p-0 shadow-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => setInspectingShipment(s)}
                          size="sm" 
                          variant="outline"
                          className="text-[11px] font-bold"
                        >
                          Inspect
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedTrackingId(s.id)
                            setActiveView('tracking')
                          }}
                          size="sm" 
                          className="text-[11px] font-bold text-white bg-primary hover:bg-primary/90"
                        >
                          Map
                        </Button>
                      </div>
                    </div>
                  ))}
                  {shipments.filter(s => s.status !== 'delivered').length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-12">No active shipments in transit. Click Book Pickup above to schedule dispatch.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick help desk overview */}
            <div className="space-y-6">
              <Card className="glass-card border border-slate-200/90 p-5 space-y-4 shadow-sm bg-white">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Support Desk</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Active chat tickets</p>
                </div>
                {supportTickets.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => { setActiveView('support'); setActiveTicketId(t.id) }}
                    className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors block cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-900 truncate">{t.subject}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2">
                      <span className="font-semibold text-primary">ID: {t.id}</span>
                      <span>{t.createdDate}</span>
                    </div>
                  </button>
                ))}
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SCHEDULE DISPATCH PICKUP */}
        {activeView === 'pickup' && (
          <motion.div
            key="pickup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-6 md:p-8 max-w-3xl mx-auto bg-white shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Schedule Courier Dispatch Pickup</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Specify pickup address and driver dispatch window</p>
            </div>

            <form onSubmit={handleBookPickupSubmit} className="space-y-5">
              
              {/* Pickup Address */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Pickup Address</label>
                <textarea
                  required
                  rows={2}
                  value={pickupForm.pickupAddress}
                  onChange={(e) => setPickupForm(prev => ({ ...prev, pickupAddress: e.target.value }))}
                  className="w-full bg-slate-50 text-xs text-slate-900 p-3 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Date & Time slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Preferred Date</label>
                  <Input
                    type="date"
                    required
                    value={pickupForm.preferredDate}
                    onChange={(e) => setPickupForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Driver Time Window</label>
                  <select
                    value={pickupForm.preferredTime}
                    onChange={(e) => setPickupForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="09:00 AM - 12:00 PM">Morning slot (09:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 03:00 PM">Afternoon slot (12:00 PM - 03:00 PM)</option>
                    <option value="03:00 PM - 06:00 PM">Late slot (03:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Courier and description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Courier Dispatch Partner</label>
                  <select
                    value={pickupForm.courierPreference}
                    onChange={(e) => setPickupForm(prev => ({ ...prev, courierPreference: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    {couriers.filter(c => c.enabled).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Package Description</label>
                  <Input
                    type="text"
                    required
                    value={pickupForm.packageDescription}
                    onChange={(e) => setPickupForm(prev => ({ ...prev, packageDescription: e.target.value }))}
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Driver Instructions</label>
                <Input
                  type="text"
                  value={pickupForm.specialInstructions}
                  onChange={(e) => setPickupForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              {/* Options */}
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="pickup-insure"
                  checked={pickupForm.insurance}
                  onChange={(e) => setPickupForm(prev => ({ ...prev, insurance: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 bg-white text-primary focus:ring-0 cursor-pointer"
                />
                <label htmlFor="pickup-insure" className="text-[10px] text-slate-600 leading-relaxed cursor-pointer select-none">
                  Add full value coverage protection insurance to scheduled pickup cargo manifest.
                </label>
              </div>

              <Button type="submit" className="w-full py-3 flex items-center justify-center gap-1.5 text-white bg-primary hover:bg-primary/90 shadow-sm font-bold">
                <span>Book Courier Pickup</span>
              </Button>

            </form>
          </Card>
          </motion.div>
        )}

        {/* TAB 3: PACKAGE LEDGER (HISTORY) */}
        {activeView === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by tracking ID or country..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-900 w-64 placeholder:text-slate-400"
                />
              </div>

              {/* Bulk actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={triggerCsvExport} className="flex items-center gap-1.5 text-[10px]">
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </Button>
                <Button variant="outline" size="sm" onClick={triggerPdfExport} className="flex items-center gap-1.5 text-[10px]">
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </Button>
              </div>
            </div>

            {/* Manifest Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-2">Tracking ID</th>
                    <th className="py-3 px-2">Courier</th>
                    <th className="py-3 px-2">Origin</th>
                    <th className="py-3 px-2">Destination</th>
                    <th className="py-3 px-2">Weight</th>
                    <th className="py-3 px-2">Cost</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments
                    .filter(s => s.id.toLowerCase().includes(historySearch.toLowerCase()) || s.destination.toLowerCase().includes(historySearch.toLowerCase()))
                    .map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-primary">{s.id}</td>
                        <td className="py-3.5 px-2 capitalize text-slate-800">{s.courier}</td>
                        <td className="py-3.5 px-2 text-slate-600">{s.origin}</td>
                        <td className="py-3.5 px-2 text-slate-600">{s.destination}</td>
                        <td className="py-3.5 px-2 text-slate-500">{s.weight} kg</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-900">{s.cost.toLocaleString()} NGN</td>
                        <td className="py-3.5 px-2">
                          <Badge variant={
                            s.status === 'delivered' ? 'success' : 
                            ['customs', 'cancelled'].includes(s.status) ? 'danger' : 'warning'
                          }>
                            {s.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => setInspectingShipment(s)}
                            className="text-primary hover:underline font-bold text-[10px] mr-2.5 cursor-pointer"
                          >
                            Stage Trace
                          </button>
                          <button
                            onClick={() => { setSelectedTrackingId(s.id); setActiveView('tracking') }}
                            className="text-slate-400 hover:text-slate-700 font-bold text-[10px] cursor-pointer"
                          >
                            Map
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 4: BILLING INVOICES */}
        {activeView === 'invoices' && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Billing Statements & Invoices</h3>
              <p className="text-[10px] text-slate-500">Download receipts for past payments</p>
            </div>

            <div className="space-y-3">
              {shipments.map(s => (
                <div key={s.invoiceId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="text-left space-y-1">
                    <p className="text-xs font-bold text-slate-900">{s.invoiceId}</p>
                    <p className="text-[10px] text-slate-500">Issued: {s.createdDate} for Shipment {s.id}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-primary">{s.cost.toLocaleString()} NGN</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateInvoicePdf(s)} 
                      disabled={isGeneratingPdf}
                      className="flex items-center gap-1 text-[10px]"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      <span>{isGeneratingPdf && printingShipment?.id === s.id ? 'Generating...' : 'Download PDF'}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 5: ALERT LOGS */}
        {activeView === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border border-slate-200/90 p-5 bg-white shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Operational Alert Logs</h3>
              <p className="text-[10px] text-slate-500">Chronological log of shipment events</p>
            </div>

            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-left flex gap-3">
                  <div className="mt-0.5">
                    {n.type === 'success' && <Badge variant="success">OK</Badge>}
                    {n.type === 'warning' && <Badge variant="warning">ALERT</Badge>}
                    {n.type === 'danger' && <Badge variant="danger">STOP</Badge>}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">{n.title}</h4>
                    <p className="text-[10px] text-slate-600 mt-1">{n.description}</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 6: SUPPORT LIVE HELPDESK */}
        {activeView === 'support' && (
          <motion.div
            key="support"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            
            {/* Active Tickets Sidebar */}
            <Card className="glass-card border border-slate-200/90 p-4 space-y-3 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Tickets</span>
                <Button size="sm" onClick={() => setShowNewTicketModal(true)} className="px-2 h-7 rounded text-[10px] text-white bg-primary hover:bg-primary/90">New</Button>
              </div>

              {supportTickets.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors block cursor-pointer",
                    activeTicketId === t.id ? "bg-emerald-50 border-emerald-300 text-slate-900 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <p className="text-xs font-bold truncate">{t.subject}</p>
                  <div className="flex justify-between text-[9px] mt-2">
                    <span className="text-primary font-bold">{t.id}</span>
                    <span className="capitalize">{t.status}</span>
                  </div>
                </button>
              ))}
            </Card>

            {/* Active chat window */}
            <Card className="glass-card border border-slate-200/90 p-5 md:col-span-2 flex flex-col justify-between min-h-[400px] bg-white shadow-sm">
              {activeTicket ? (
                <>
                  <div className="border-b border-slate-100 pb-3 mb-4 text-left">
                    <h4 className="text-xs font-bold text-slate-900">{activeTicket.subject}</h4>
                    <span className="text-[9px] text-primary font-bold">Ticket ID: {activeTicket.id}</span>
                  </div>

                  {/* Chat messages feed */}
                  <div className="flex-1 overflow-y-auto space-y-4 max-h-60 pr-2 custom-scrollbar my-4 text-xs">
                    {activeTicket.messages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "max-w-md p-3 rounded-xl",
                          m.sender === 'user' 
                            ? 'bg-emerald-50 border border-emerald-200 text-slate-900 ml-auto text-right' 
                            : 'bg-slate-100 border border-slate-200 text-slate-700 mr-auto text-left'
                        )}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <span className="text-[8px] text-slate-400 mt-1 block">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat input box */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-slate-100 pt-3">
                    <input
                      type="text"
                      placeholder="Type your response message here..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-50 text-xs text-slate-900 px-3 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50"
                    />
                    <Button type="submit" size="icon" className="w-10 h-10 flex items-center justify-center cursor-pointer text-white bg-primary hover:bg-primary/90">
                      <SendIcon className="w-4 h-4 text-white" />
                    </Button>
                  </form>
                </>
              ) : (
                <p className="text-xs text-slate-500 text-center py-24">Select a ticket to open operational chat.</p>
              )}
            </Card>

          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="glass-card border border-slate-200/90 max-w-md w-full p-6 text-left space-y-4 bg-white shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Subject Title</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Shipment clearance delay"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your operational issue in detail..."
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 p-3 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowNewTicketModal(false)} size="sm">Cancel</Button>
                <Button type="submit" size="sm" className="text-white bg-primary hover:bg-primary/90">Create Ticket</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Inspecting Shipment Progress Modal */}
      {inspectingShipment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 text-left space-y-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Checkpoint Telemetry
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Shipment {inspectingShipment.id}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {inspectingShipment.status.replace('_', ' ')}
                  </span>
                </h3>
              </div>
              <button 
                onClick={() => setInspectingShipment(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Shipment Progress Tracker */}
            <ShipmentProgressTracker
              status={inspectingShipment.status}
              history={inspectingShipment.history}
              trackingId={inspectingShipment.id}
              courier={inspectingShipment.courier}
              origin={inspectingShipment.origin}
              destination={inspectingShipment.destination}
              estimatedDelivery={inspectingShipment.estimatedDelivery}
              currentLocation={
                inspectingShipment.history.filter(h => h.completed).slice(-1)[0]?.location
              }
              className="border-slate-100 bg-slate-50/50"
            />

            {/* Footer with actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Carrier assigned: <span className="font-bold text-slate-800 capitalize">{inspectingShipment.courier}</span> • {inspectingShipment.weight}kg
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInspectingShipment(null)}
                >
                  Close
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedTrackingId(inspectingShipment.id)
                    setInspectingShipment(null)
                    setActiveView('tracking')
                  }}
                  className="text-white bg-primary hover:bg-primary/90 font-bold"
                >
                  Trace on Route Map
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* HIDDEN RECEIPT TEMPLATE FOR HTML2CANVAS */}
      {printingShipment && (
        <div 
          id="pdf-receipt-template" 
          className="absolute left-[-9999px] top-[-9999px] w-[800px] bg-white p-12 text-slate-900 font-sans border border-slate-200"
          style={{ zIndex: -999 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-primary flex items-center justify-center font-black text-white text-xl rounded-md">
                  SE
                </div>
                <h1 className="text-3xl font-black font-display tracking-tight text-slate-900">SPATIAL EXPRESS</h1>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Fast. Reliable. Everywhere.</p>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-bold text-primary">OFFICIAL RECEIPT</h2>
              <p className="text-sm font-semibold text-slate-800">Invoice No: {printingShipment.invoiceId}</p>
              <p className="text-sm text-slate-500">Date: {printingShipment.createdDate}</p>
            </div>
          </div>

          {/* Customer & Route details */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-200 pb-2">Shipper Details</h3>
              <div>
                <p className="text-base font-bold text-slate-900">Customer</p>
                <p className="text-sm text-slate-500">Client Account (Premium)</p>
                <p className="text-sm text-slate-500">contact@customer.com</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-200 pb-2">Recipient Details</h3>
              <div>
                <p className="text-base font-bold text-slate-900">{printingShipment.recipientName}</p>
                <p className="text-sm text-slate-500">{printingShipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Shipment Particulars */}
          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-200 pb-2 mb-4">Shipment Particulars</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-3 text-sm font-bold">Tracking ID</th>
                  <th className="p-3 text-sm font-bold">Origin</th>
                  <th className="p-3 text-sm font-bold">Destination</th>
                  <th className="p-3 text-sm font-bold text-center">Weight</th>
                  <th className="p-3 text-sm font-bold text-center">Courier</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-3 text-sm font-bold text-primary">{printingShipment.id}</td>
                  <td className="p-3 text-sm text-slate-700">{printingShipment.origin}</td>
                  <td className="p-3 text-sm text-slate-700">{printingShipment.destination}</td>
                  <td className="p-3 text-sm text-center text-slate-700">{printingShipment.weight} kg</td>
                  <td className="p-3 text-sm text-center capitalize text-slate-700">{printingShipment.courier}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financials */}
          <div className="flex justify-end mb-16">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-800">{(printingShipment.cost * 0.9).toFixed(2)} NGN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax & Customs (10%)</span>
                <span className="text-slate-800">{(printingShipment.cost * 0.1).toFixed(2)} NGN</span>
              </div>
              <div className="flex justify-between text-lg font-black text-primary border-t border-slate-200 pt-3">
                <span>TOTAL PAID</span>
                <span>{printingShipment.cost.toLocaleString()} NGN</span>
              </div>
            </div>
          </div>

          {/* Footer & Barcode mock */}
          <div className="flex items-end justify-between border-t border-slate-200 pt-8">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Thank you for shipping with Spatial Express.</p>
              <p className="text-[10px] text-slate-400">If you have any questions concerning this invoice, contact support@spatialexpress.com</p>
            </div>
            
            {/* Mock Barcode generated with pure CSS */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 items-end justify-center bg-slate-100 p-2 rounded w-48 border border-slate-200">
                <div className="w-1 h-10 bg-black mr-1" />
                <div className="w-0.5 h-10 bg-black mr-0.5" />
                <div className="w-2 h-10 bg-black mr-1" />
                <div className="w-0.5 h-10 bg-black mr-1.5" />
                <div className="w-1.5 h-10 bg-black mr-0.5" />
                <div className="w-3 h-10 bg-black mr-1" />
                <div className="w-0.5 h-10 bg-black mr-1" />
                <div className="w-1 h-10 bg-black mr-2" />
                <div className="w-2 h-10 bg-black mr-0.5" />
                <div className="w-0.5 h-10 bg-black mr-1" />
                <div className="w-1 h-10 bg-black mr-1" />
                <div className="w-1.5 h-10 bg-black mr-0.5" />
                <div className="w-2 h-10 bg-black mr-1.5" />
                <div className="w-0.5 h-10 bg-black mr-1" />
                <div className="w-1 h-10 bg-black" />
              </div>
              <p className="text-[10px] tracking-[0.3em] font-mono text-slate-600">{printingShipment.id}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

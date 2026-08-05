import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLogistics } from '../context/LogisticsContext'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { CheckIcon, GlobeIcon, MapPinIcon, ShieldIcon, CalendarIcon, PackageIcon } from '../components/ui/CustomIcons'
import { ThreeDTilt } from '../components/ui/ThreeDTilt'
import { Floating3DDecorations } from '../components/ui/ParallaxLayer'
import { cn } from '../lib/utils'

export default function ShipmentTracking() {
  const { 
    shipments,
    selectedTrackingId, 
    setSelectedTrackingId,
    selectedShipmentDetail
  } = useLogistics()

  const [searchId, setSearchId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const found = shipments.find(s => s.id.toLowerCase() === searchId.trim().toLowerCase())
    if (found) {
      setSelectedTrackingId(found.id)
      setErrorMsg('')
    } else {
      setErrorMsg('No shipment match found. Double check registration code (e.g. SPX-8294-0921).')
    }
  }

  return (
    <div className="space-y-8 select-none text-left pb-12 relative overflow-hidden">
      
      {/* Parallax elements */}
      <Floating3DDecorations />

      {/* Header section */}
      <div className="text-left space-y-2 z-10 relative">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Global Tracking Engine</span>
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Real-Time Cargo Manifest Tracker</h1>
        <p className="text-xs text-muted max-w-lg leading-relaxed">
          Monitor your international freight runs, check individual customs brokerage statuses, and view live carrier processing history.
        </p>
      </div>

      {/* Tracker Lookup Bar */}
      <ThreeDTilt maxTilt={5} scale={1.01} className="w-full max-w-2xl z-10 relative">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-black/40 border border-white/5 p-3 rounded-2xl w-full">
          <input
            type="text"
            placeholder="Search Shipment Registration Code (e.g. SPX-8294-0921)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder:text-muted focus:outline-none border-none ring-0 focus:ring-0"
          />
          <Button type="submit" className="py-2.5 px-6 font-bold text-xs uppercase tracking-wider">
            Query Live Databases
          </Button>
        </form>
        {errorMsg && <p className="text-[10px] text-danger mt-1.5 pl-3 absolute font-semibold">{errorMsg}</p>}
      </ThreeDTilt>

      {/* Primary Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4 z-10 relative">

        {selectedShipmentDetail ? (
          <>
            {/* LEFT COLUMN: HISTORY TIMELINE OF THE MANIFEST */}
            <div className="lg:col-span-2 space-y-6">
              <ThreeDTilt maxTilt={5} scale={1.01} className="w-full">
                <Card className="glass-card border border-white/5 p-6 bg-gradient-to-br from-[#0D1117]/80 to-[#050608]/90">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                    <div>
                      <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Live Registration Code</span>
                      <h3 className="text-base font-black text-white">{selectedShipmentDetail.id}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        selectedShipmentDetail.status === 'delivered' ? 'success' :
                        ['customs', 'cancelled'].includes(selectedShipmentDetail.status) ? 'danger' : 'warning'
                      }>
                        {selectedShipmentDetail.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted font-semibold">{selectedShipmentDetail.createdDate}</span>
                    </div>
                  </div>

                  {/* Vertical custom stepper timeline */}
                  <div className="relative pl-6 border-l border-white/5 space-y-8 py-2">
                    {selectedShipmentDetail.history.map((step, idx) => {
                      const isCompleted = step.completed
                      return (
                        <div key={idx} className="relative flex items-start gap-4 group">

                          {/* Stepper Bullet Node */}
                          <span className={cn(
                            "absolute -left-[31px] w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all",
                            isCompleted
                              ? "bg-primary border-primary text-black shadow-glow"
                              : "bg-background border-white/10 text-muted"
                          )}>
                            {isCompleted ? <CheckIcon className="w-2.5 h-2.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                          </span>

                          <div className="text-left space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-4">
                              <h4 className={cn(
                                "text-xs font-bold transition-colors",
                                isCompleted ? "text-white" : "text-muted"
                              )}>
                                {step.status}
                              </h4>
                              <span className="text-[10px] text-muted whitespace-nowrap">{step.time}</span>
                            </div>
                            <p className="text-[10px] text-muted flex items-center gap-1">
                              <MapPinIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span>{step.location}</span>
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </ThreeDTilt>
            </div>

            {/* RIGHT COLUMN: CARRIER SUMMARY META */}
            <div className="space-y-6">

              <ThreeDTilt maxTilt={8} scale={1.02} className="w-full">
                <Card className="glass-card border border-white/5 p-5 bg-gradient-to-b from-[#0D1117] to-background space-y-5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Carrier Dispatch Summary</h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Origin Facility</span>
                      <span className="text-white font-semibold">{selectedShipmentDetail.origin}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Final Destination</span>
                      <span className="text-white font-semibold">{selectedShipmentDetail.destination}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Assigned Carrier</span>
                      <span className="text-white font-bold uppercase tracking-wider">{selectedShipmentDetail.courier}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Invoice Number</span>
                      <span className="text-white font-semibold">{selectedShipmentDetail.invoiceId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Declared Value</span>
                      <span className="text-white font-semibold">{selectedShipmentDetail.declaredValue.toLocaleString()} NGN</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Cargo Insurance</span>
                      <span className="text-white font-semibold">{selectedShipmentDetail.insurance ? 'Guaranteed Lock' : 'None'}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-muted">Estimated ETA</span>
                      <span className="text-sm font-black text-primary">{selectedShipmentDetail.estimatedDelivery}</span>
                    </div>
                  </div>
                </Card>
              </ThreeDTilt>

              <ThreeDTilt maxTilt={8} scale={1.02} className="w-full">
                <div className="border border-[#FFFFFF]/[0.03] bg-white/[0.01] p-5 rounded-2xl flex items-start gap-3">
                  <ShieldIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left text-xs text-muted space-y-1">
                    <h4 className="font-bold text-white">Customs Clearing Lock</h4>
                    <p className="leading-relaxed">This shipment has bypassed secondary duty clearing hurdles. Clearance manifests are generated dynamically via official border clearing interfaces.</p>
                  </div>
                </div>
              </ThreeDTilt>

            </div>
          </>
        ) : (
          <div className="col-span-3 text-center py-20 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            <PackageIcon className="w-12 h-12 text-muted mx-auto" />
            <h3 className="text-base font-bold text-white">No active shipment selected</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Please search for a valid tracking registration ID above, or select an active shipment in your Client Dashboard to track live logs.
            </p>
          </div>
        )}

      </div>

    </div>
  )
}

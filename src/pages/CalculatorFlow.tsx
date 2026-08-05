import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLogistics } from '../context/LogisticsContext'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { CountryFlag } from '../components/ui/CountryFlag'
import { ArrowRightIcon, ChevronRightIcon, CreditCardIcon, BuildingIcon, DollarSignIcon, ShieldCheckIcon, AlertTriangleIcon } from '../components/ui/CustomIcons'
import { ThreeDTilt } from '../components/ui/ThreeDTilt'
import { Floating3DDecorations } from '../components/ui/ParallaxLayer'
import { cn } from '../lib/utils'

export default function CalculatorFlow() {
  const {
    calculatorForm,
    setCalculatorForm,
    calculatorResults,
    setCalculatorResults,
    priceMatrix,
    selectedCourierResult,
    setSelectedCourierResult,
    checkoutStep,
    setCheckoutStep,
    processCheckoutPayment
  } = useLogistics()

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd'>('card')
  const [createdShipment, setCreatedShipment] = useState<any>(null)

  // Recipient form mock
  const [recipient, setRecipient] = useState({
    name: 'Oliver Smith',
    email: 'oliver.smith@example.com',
    phone: '+44 7911 123456',
    address: '12 Baker Street, London, NW1 6XE, UK'
  })

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const weightVal = calculatorForm.weight
    const results = [
      { id: 'dhl', name: 'DHL Express', price: priceMatrix['dhl']?.[weightVal] || 16500, time: '1-3 Business Days', logo: '/courier badges/dhl.png', badge: 'Fastest' },
      { id: 'fedex', name: 'FedEx Express', price: priceMatrix['fedex']?.[weightVal] || 15800, time: '2-4 Business Days', logo: '/courier badges/fedex.png', badge: 'Recommended' },
      { id: 'ups', name: 'UPS Worldwide', price: priceMatrix['ups']?.[weightVal] || 15300, time: '2-5 Business Days', logo: '/courier badges/ups.png', badge: 'Cheapest' },
      { id: 'aramex', name: 'Aramex International', price: priceMatrix['aramex']?.[weightVal] || 14300, time: '3-6 Business Days', logo: '/courier badges/aramex.png' }
    ]

    setCalculatorResults(results)
    setSelectedCourierResult(results[1]) // FedEx recommendation as default
    setCheckoutStep(2)
  }

  const handleCompletePayment = () => {
    const shipment = processCheckoutPayment(paymentMethod)
    setCreatedShipment(shipment)
    setCheckoutStep(4)
  }

  return (
    <div className="space-y-8 select-none text-left pb-12 relative overflow-hidden">

      {/* Parallax animations */}
      <Floating3DDecorations />

      {/* Title */}
      <div className="text-left space-y-2 z-10 relative">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Automated Tariff Engine</span>
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Interactive Cost Calculator & Booking</h1>
        <p className="text-xs text-muted max-w-lg leading-relaxed">
          Compare global partner tariffs in real-time, select custom insurance declarations, and book secure courier dispatch with credit card or instant transfer.
        </p>
      </div>

      {/* Multi-step checkout pipeline tracker */}
      <div className="w-full max-w-2xl bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold z-10 relative">
        {[
          { step: 1, label: 'Calculate Price' },
          { step: 2, label: 'Select Courier' },
          { step: 3, label: 'Recipient & Pay' },
          { step: 4, label: 'Receipt & Track' }
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-2">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all",
              checkoutStep === item.step
                ? "bg-primary text-black border-primary shadow-glow"
                : checkoutStep > item.step
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-surface text-muted border-white/5"
            )}>
              {item.step}
            </span>
            <span className={cn(
              "hidden sm:inline text-[10px] uppercase tracking-wider",
              checkoutStep === item.step ? "text-white" : "text-muted"
            )}>
              {item.label}
            </span>
            {item.step < 4 && <ChevronRightIcon className="w-4 h-4 text-white/10 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start z-10 relative">

        <AnimatePresence mode="wait">

          {/* STEP 1: CALCULATOR INPUTS */}
          {checkoutStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="lg:col-span-2 space-y-6"
            >
              <ThreeDTilt maxTilt={5} scale={1.01} className="w-full">
                <Card className="glass-card border border-white/5 p-6 bg-gradient-to-br from-[#0D1117]/80 to-[#050608]/90">
                  <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Ship From (Origin)</label>
                        <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                          <CountryFlag countryCode="NG" size="md" />
                          <span className="text-sm text-white font-medium">Nigeria (Lagos Hub)</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Ship To (Destination)</label>
                        <div className="w-full bg-black/60 border border-white/10 rounded-xl px-4 flex items-center gap-3 focus-within:border-primary/50 transition-colors overflow-hidden">
                          <CountryFlag
                            countryCode={calculatorForm.destination === 'United Kingdom' ? 'GB' : calculatorForm.destination === 'United States' ? 'US' : calculatorForm.destination === 'Canada' ? 'CA' : 'DE'}
                            size="md"
                            className="flex-shrink-0"
                          />
                          <select
                            value={calculatorForm.destination}
                            onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, destination: e.target.value }))}
                            className="w-full bg-transparent py-3 text-sm text-white font-medium appearance-none cursor-pointer outline-none border-none ring-0 focus:ring-0"
                          >
                            <option value="United Kingdom" className="bg-background text-white">United Kingdom</option>
                            <option value="United States" className="bg-background text-white">United States</option>
                            <option value="Canada" className="bg-background text-white">Canada</option>
                            <option value="Germany" className="bg-background text-white">Germany</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Weight Tiers (kg)</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={calculatorForm.weight}
                            onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, weight: parseFloat(e.target.value) || 0.2 }))}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted font-bold">kg</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Package Contents</label>
                        <select
                          value={calculatorForm.packageType}
                          onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, packageType: e.target.value }))}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                          <option value="Parcel" className="bg-background text-white">Standard Parcel</option>
                          <option value="Document" className="bg-background text-white">Documents / Invoices</option>
                          <option value="Heavy Crate" className="bg-background text-white">Heavy Wood Crate</option>
                          <option value="Pallet" className="bg-background text-white">Freight Pallet</option>
                        </select>
                      </div>

                    </div>

                    {/* Declared Value & Insurance */}
                    <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="insurance"
                          checked={calculatorForm.insurance}
                          onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, insurance: e.target.checked }))}
                          className="w-4 h-4 rounded border-white/10 bg-black/60 text-primary focus:ring-primary focus:ring-offset-background"
                        />
                        <div className="text-left">
                          <label htmlFor="insurance" className="text-xs font-bold text-white cursor-pointer">Include Cargo Insurance</label>
                          <p className="text-[10px] text-muted">Protects declared values up to 5,000,000 NGN.</p>
                        </div>
                      </div>

                      {calculatorForm.insurance && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Declared Package Value (NGN)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={calculatorForm.declaredValue}
                              onChange={(e) => setCalculatorForm((prev: any) => ({ ...prev, declaredValue: parseFloat(e.target.value) || 0 }))}
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted font-bold">NGN</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full flex items-center justify-center gap-2 py-4">
                      <span>Calculate Tariffs</span>
                      <ArrowRightIcon className="w-4 h-4 text-black" />
                    </Button>
                  </form>
                </Card>
              </ThreeDTilt>
            </motion.div>
          )}

          {/* STEP 2: COURIER TARIFF COMPARISON */}
          {checkoutStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Compare Carrier Quote Results</h2>
                <button
                  onClick={() => setCheckoutStep(1)}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  ← Modify Parameters
                </button>
              </div>

              <div className="space-y-4">
                {calculatorResults.map((res) => {
                  const isSelected = selectedCourierResult?.id === res.id
                  return (
                    <ThreeDTilt maxTilt={10} scale={1.02} key={res.id} className="w-full">
                      <div
                        onClick={() => setSelectedCourierResult(res)}
                        className={cn(
                          "bg-[#0D1117]/80 border rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer transition-all",
                          isSelected ? "border-primary shadow-[0_0_20px_rgba(57,255,20,0.1)]" : "border-white/5 hover:border-white/15"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-white/5 border border-white/10 rounded-lg p-1.5 flex items-center justify-center">
                            <img src={res.logo} alt={res.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{res.name}</h4>
                              {res.badge && (
                                <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  {res.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted">Estimated Delivery: {res.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <h3 className="text-base font-black text-white">{res.price.toLocaleString()} NGN</h3>
                            <p className="text-[10px] text-muted">All duties & brokerage included</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center",
                            isSelected ? "border-primary bg-primary text-black" : "border-white/20 bg-transparent"
                          )}>
                            {isSelected && <span className="text-xs font-bold">✓</span>}
                          </div>
                        </div>
                      </div>
                    </ThreeDTilt>
                  )
                })}
              </div>

              <Button
                onClick={() => setCheckoutStep(3)}
                className="w-full flex items-center justify-center gap-2 py-4 mt-6"
              >
                <span>Continue to Booking Information</span>
                <ArrowRightIcon className="w-4 h-4 text-black" />
              </Button>
            </motion.div>
          )}

          {/* STEP 3: RECIPIENT & SECURE CHECKOUT PAYMENT */}
          {checkoutStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recipient Details & Payment Desk</h2>
                <button
                  onClick={() => setCheckoutStep(2)}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  ← Back to Carriers
                </button>
              </div>

              <ThreeDTilt maxTilt={5} scale={1.01} className="w-full">
                <Card className="glass-card border border-white/5 p-6 bg-gradient-to-br from-[#0D1117]/80 to-[#050608]/90 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">1. Delivery Recipient Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Recipient Name</label>
                        <Input
                          type="text"
                          value={recipient.name}
                          onChange={e => setRecipient(r => ({ ...r, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                        <Input
                          type="email"
                          value={recipient.email}
                          onChange={e => setRecipient(r => ({ ...r, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Recipient Phone</label>
                        <Input
                          type="text"
                          value={recipient.phone}
                          onChange={e => setRecipient(r => ({ ...r, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Delivery Destination Country</label>
                        <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                          <CountryFlag countryCode={calculatorForm.destination === 'United Kingdom' ? 'GB' : calculatorForm.destination === 'United States' ? 'US' : calculatorForm.destination === 'Canada' ? 'CA' : 'DE'} size="sm" />
                          <span className="text-sm text-white font-medium">{calculatorForm.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Complete Shipping Address</label>
                      <textarea
                        rows={2}
                        value={recipient.address}
                        onChange={e => setRecipient(r => ({ ...r, address: e.target.value }))}
                        className="flex w-full rounded-md border border-white/10 bg-surface/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background"
                      />
                    </div>
                  </div>

                  {/* Payment Method Desk */}
                  <div className="space-y-4 border-t border-white/5 pt-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">2. Secure Gateway Checkout (Powered by Paystack)</h3>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'card', label: 'Debit Card', icon: CreditCardIcon },
                        { id: 'bank_transfer', label: 'Bank Transfer', icon: BuildingIcon },
                        { id: 'ussd', label: 'Instant USSD', icon: DollarSignIcon }
                      ].map(method => {
                        const Icon = method.icon
                        const isSel = paymentMethod === method.id
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={cn(
                              "border rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                              isSel ? "border-primary bg-primary/10 text-white" : "border-white/5 text-muted hover:border-white/10"
                            )}
                          >
                            <Icon className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{method.label}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-black/60 border border-white/5 p-4 rounded-xl space-y-2 text-xs text-muted">
                      {paymentMethod === 'card' && (
                        <p>Pay instantly using Visa, Mastercard, or Verve. Enter card details via secure overlay on the next step.</p>
                      )}
                      {paymentMethod === 'bank_transfer' && (
                        <p>Generate a temporary custom Wema/Sterling account number to transfer {selectedCourierResult?.price.toLocaleString()} NGN instantly.</p>
                      )}
                      {paymentMethod === 'ussd' && (
                        <p>Pick your bank and dial the custom code string (e.g. *737#) to process instant mobile payment authorization.</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCompletePayment}
                    className="w-full flex items-center justify-center gap-2 py-4"
                  >
                    <span>Authorize Secure Payment ({selectedCourierResult?.price.toLocaleString()} NGN)</span>
                    <ShieldCheckIcon className="w-4 h-4 text-black" />
                  </Button>
                </Card>
              </ThreeDTilt>
            </motion.div>
          )}

          {/* STEP 4: PAYMENT SUCCESSFUL & TRACKING RECEIPT */}
          {checkoutStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="lg:col-span-2 space-y-6"
            >
              <ThreeDTilt maxTilt={5} scale={1.01} className="w-full">
                <Card className="glass-card border border-primary/20 p-8 text-center bg-gradient-to-br from-[#0D1117] to-[#050608] space-y-6 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary text-2xl font-black shadow-glow">✓</div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-extrabold text-white">Payment Completed successfully</h2>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      Your pickup dispatcher has been dispatched in Port Harcourt. Your parcel is registered in our network databases.
                    </p>
                  </div>

                  {/* Registered Shipment Receipt card */}
                  {createdShipment && (
                    <div className="bg-black/60 border border-white/5 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3.5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Receipt Overview</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-wide">{createdShipment.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted text-[10px]">Courier Service</p>
                          <p className="text-white font-bold">{selectedCourierResult?.name}</p>
                        </div>
                        <div>
                          <p className="text-muted text-[10px]">Consolidation Weight</p>
                          <p className="text-white font-bold">{calculatorForm.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-muted text-[10px]">Shipment Cost</p>
                          <p className="text-white font-bold">{createdShipment.cost.toLocaleString()} NGN</p>
                        </div>
                        <div>
                          <p className="text-muted text-[10px]">Customs Brokerage</p>
                          <p className="text-white font-bold">Guaranteed Covered</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3 text-[10px] text-muted leading-relaxed">
                        <p><span className="font-bold text-white">Recipient Address:</span> {recipient.name} ({recipient.address})</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 bg-surface border border-white/5 hover:bg-white/5 text-white"
                    >
                      New Calculation
                    </Button>
                    <Button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        // Trigger Tracking active view directly
                        useLogistics().setActiveView('tracking')
                      }}
                      className="flex-1"
                    >
                      Track Parcel Live
                    </Button>
                  </div>
                </Card>
              </ThreeDTilt>
            </motion.div>
          )}

        </AnimatePresence>

        {/* RIGHT SIDEBAR: ORDER SUMMARY DESK */}
        <div className="space-y-6">
          <ThreeDTilt maxTilt={8} scale={1.02} className="w-full">
            <Card className="glass-card border border-white/5 p-5 bg-gradient-to-b from-[#0D1117] to-background">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mb-4">Tariff Calculation Summary</h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Origin Facility</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <CountryFlag countryCode="NG" size="sm" /> Nigeria
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted">Destination Hub</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <CountryFlag countryCode={calculatorForm.destination === 'United Kingdom' ? 'GB' : calculatorForm.destination === 'United States' ? 'US' : calculatorForm.destination === 'Canada' ? 'CA' : 'DE'} size="sm" />
                    {calculatorForm.destination}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted">Consolidation weight</span>
                  <span className="text-white font-bold">{calculatorForm.weight} kg</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted">Package Type</span>
                  <span className="text-white font-bold">{calculatorForm.packageType}</span>
                </div>

                {checkoutStep >= 2 && selectedCourierResult && (
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Selected Courier</span>
                      <span className="text-white font-bold">{selectedCourierResult.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted">Estimated Transit</span>
                      <span className="text-white font-bold text-primary">{selectedCourierResult.time}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                      <span className="text-white font-bold">Total Estimated Tariff</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-primary">{selectedCourierResult.price.toLocaleString()} NGN</span>
                        <p className="text-[9px] text-muted">Duties & VAT aggregated</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </ThreeDTilt>

          {/* Additional details card */}
          <ThreeDTilt maxTilt={8} scale={1.02} className="w-full">
            <div className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="text-left text-xs text-muted space-y-1">
                <h4 className="font-bold text-white">Tariff Transparency Lock</h4>
                <p className="leading-relaxed">All displayed custom tariffs are aggregated hourly. No hidden local delivery fees or warehouse custom clearance surcharges guaranteed.</p>
              </div>
            </div>
          </ThreeDTilt>
        </div>

      </div>

    </div>
  )
}

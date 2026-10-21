import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneIcon, MailIcon, ClockIcon, MapPinIcon, SendIcon, MessageSquareIcon } from '../components/ui/CustomIcons'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { InteractiveMap } from '../components/InteractiveMap'

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <div className="space-y-8 select-none text-left pb-12">
      
      {/* Header section */}
      <div className="text-left space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-primary font-bold">Freight Support Desk</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Response SLA &lt; 30 Minutes</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Lagos &amp; Port Harcourt Dispatches</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
          Connect with a Logistics Coordinator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
          Need special cargo consolidation tariffs, dangerous goods clearance guidance, or corporate freight forwarding agreements? Reach our operational desk directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info list */}
        <div className="space-y-6">
          
          <Card className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm">
            <CardHeader className="p-0 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <MapPinIcon className="w-4.5 h-4.5 text-primary" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">Office Address</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                4 Victory Street, off Police Post, Eliozu, Port Harcourt, Rivers State, Nigeria.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm">
            <CardHeader className="p-0 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <PhoneIcon className="w-4.5 h-4.5 text-primary" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">Operations Desk</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-1">
              <p className="text-xs text-slate-600 font-semibold">Phone: +234 707 264 4177</p>
              <p className="text-xs text-slate-600">WhatsApp Support: Direct via Floating Widget</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm">
            <CardHeader className="p-0 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <MailIcon className="w-4.5 h-4.5 text-primary" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">Global Inquiries</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-1">
              <p className="text-xs text-slate-600 font-semibold">Email: info@spatialexpress.com</p>
              <p className="text-xs text-slate-600">Duty Clearance: customs@spatialexpress.com</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm">
            <CardHeader className="p-0 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <ClockIcon className="w-4.5 h-4.5 text-primary" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-900">Mon - Fri:</span> 08:00 AM - 06:00 PM</p>
              <p><span className="font-semibold text-slate-900">Saturday:</span> 09:00 AM - 02:00 PM (Dispatch Only)</p>
              <p><span className="font-semibold text-slate-900">Sunday:</span> Closed</p>
            </CardContent>
          </Card>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <MessageSquareIcon className="w-4 h-4 text-primary" />
                Submit Operational Ticket
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-primary text-xl font-bold">✓</div>
                  <h3 className="text-base font-bold text-slate-900">Ticket Submitted Successfully</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your request was routed to our Port Harcourt sorting dispatch desk. A coordinator will email you within 30 minutes.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <Input
                        type="email"
                        required
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                    <Input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Message Details</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Specify your freight details, courier preferences, or shipment tracking query..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="flex w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <Button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-sm">
                    <SendIcon className="w-4 h-4 text-white" />
                    <span>Submit Cargo Ticket</span>
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Embedded Map Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Nigeria HQ Hub Map</h3>
        
        {/* Vector mockup of Port Harcourt region */}
        <div className="h-96 rounded-2xl overflow-hidden relative border border-slate-200">
          <InteractiveMap 
            markers={[{ name: "Spatial HQ Nigeria", coordinates: [7.0, 4.8], id: "hq" }]}
          />
        </div>
      </div>

    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneIcon, MailIcon, ClockIcon, MapPinIcon, SendIcon, MessageSquareIcon } from '../components/ui/CustomIcons'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { InteractiveMap } from '../components/InteractiveMap'
import { ThreeDTilt } from '../components/ui/ThreeDTilt'
import { Floating3DDecorations } from '../components/ui/ParallaxLayer'

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
    <div className="space-y-8 select-none text-left pb-12 relative overflow-hidden">
      
      {/* Parallax elements */}
      <Floating3DDecorations />

      {/* Header section */}
      <div className="text-left space-y-2 z-10 relative">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Contact Desk</span>
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Connect with a Logistics Coordinator</h1>
        <p className="text-xs text-muted max-w-lg leading-relaxed">
          Need custom cargo consolidation rates or help with a clearance manifest? Get in touch with our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* Contact info list */}
        <div className="space-y-6">
          
          <ThreeDTilt maxTilt={15} scale={1.03}>
            <Card className="glass-card border border-white/5 p-5 h-full w-full">
              <CardHeader className="p-0 mb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <MapPinIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-white">Office Address</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-xs text-text-secondary leading-relaxed">
                  4 Victory Street, off Police Post, Eliozu, Port Harcourt, Rivers State, Nigeria.
                </p>
              </CardContent>
            </Card>
          </ThreeDTilt>

          <ThreeDTilt maxTilt={15} scale={1.03}>
            <Card className="glass-card border border-white/5 p-5 h-full w-full">
              <CardHeader className="p-0 mb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <PhoneIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-white">Operations Desk</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <p className="text-xs text-text-secondary font-semibold">Phone: +234 707 264 4177</p>
                <p className="text-xs text-text-secondary">WhatsApp Support: Direct via Floating Widget</p>
              </CardContent>
            </Card>
          </ThreeDTilt>

          <ThreeDTilt maxTilt={15} scale={1.03}>
            <Card className="glass-card border border-white/5 p-5 h-full w-full">
              <CardHeader className="p-0 mb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <MailIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-white">Global Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <p className="text-xs text-text-secondary font-semibold">Email: info@spatialexpress.com</p>
                <p className="text-xs text-text-secondary">Duty Clearance: customs@spatialexpress.com</p>
              </CardContent>
            </Card>
          </ThreeDTilt>

          <ThreeDTilt maxTilt={15} scale={1.03}>
            <Card className="glass-card border border-white/5 p-5 h-full w-full">
              <CardHeader className="p-0 mb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <ClockIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-white">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-xs text-text-secondary space-y-1">
                <p><span className="font-semibold text-white">Mon - Fri:</span> 08:00 AM - 06:00 PM</p>
                <p><span className="font-semibold text-white">Saturday:</span> 09:00 AM - 02:00 PM (Dispatch Only)</p>
                <p><span className="font-semibold text-white">Sunday:</span> Closed</p>
              </CardContent>
            </Card>
          </ThreeDTilt>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ThreeDTilt maxTilt={5} scale={1.01} className="w-full">
            <Card className="glass-card border border-white/5 p-6 bg-gradient-to-br from-[#0D1117]/80 to-[#050608]/90 h-full">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
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
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary text-xl font-bold">✓</div>
                    <h3 className="text-base font-bold text-white">Ticket Submitted Successfully</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      Your request was routed to our Port Harcourt sorting dispatch desk. A coordinator will email you within 30 minutes.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name</label>
                        <Input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
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
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Contact Phone</label>
                      <Input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Message Details</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Specify your freight details, courier preferences, or shipment tracking query..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="flex w-full rounded-md border border-white/10 bg-surface/50 px-3 py-2 text-sm text-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      />
                    </div>

                    <Button type="submit" className="w-full flex items-center justify-center gap-2">
                      <SendIcon className="w-4 h-4 text-black" />
                      <span>Submit Cargo Ticket</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ThreeDTilt>
        </div>

      </div>

      {/* Embedded Map Section */}
      <ThreeDTilt maxTilt={3} scale={1.01} className="w-full z-10 relative">
        <div className="glass-panel border border-white/5 rounded-2xl p-6 space-y-4 h-full w-full">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nigeria HQ Hub Map</h3>

          {/* Beautiful dark vector mockup of Port Harcourt region */}
          <div className="h-96 rounded-xl overflow-hidden relative border border-white/5">
            <InteractiveMap
              markers={[{ name: "Spatial HQ Nigeria", coordinates: [7.0, 4.8], id: "hq" }]}
            />
          </div>
        </div>
      </ThreeDTilt>

    </div>
  )
}

import { useLogistics } from '../context/LogisticsContext'
import LandingPage from './LandingPage'
import CalculatorFlow from './CalculatorFlow'
import ShipmentTracking from './ShipmentTracking'
import CustomerDashboard from './CustomerDashboard'
import AdminDashboard from './AdminDashboard'
import About from './About'
import Contact from './Contact'
import { Card } from '../components/ui/Card'
import { TruckIcon, ShieldCheckIcon, AnchorIcon, ShieldAlertIcon, AwardIcon, InboxIcon, HardHatIcon, CompassIcon } from '../components/ui/CustomIcons'

export default function Dashboard() {
  const { activePortal, activeView } = useLogistics()

  // Render Services list inline when requested
  const renderServicesPage = () => {
    const services = [
      { title: 'Air Freight Cargo', desc: 'Negotiated airline space guarantees fast daily cargo consolidation and airport-to-airport clearance.', icon: CompassIcon },
      { title: 'Ocean Cargo LCL/FCL', desc: 'Cost-effective sea freight aggregation for heavy crates and containerized logistics loads.', icon: AnchorIcon },
      { title: 'Last-Mile Road Freight', desc: 'Secure door-to-door cargo trucking from our Port Harcourt and Lagos sorting hubs.', icon: TruckIcon },
      { title: 'Customs Clearance Brokerage', desc: 'Complete clearing manifest handling, tariff audits, duty estimations, and customs brokerage.', icon: ShieldCheckIcon },
      { title: 'Secure Warehousing', desc: 'Fenced, 24/7 monitored hubs with fragile packing and consolidation facilities.', icon: InboxIcon },
      { title: 'Doorstep Courier Dispatch', desc: 'Dispatched driver pickups directly from homes or offices anywhere in Nigeria.', icon: HardHatIcon }
    ]

    return (
      <div className="space-y-12 select-none text-left pb-12">
        <div className="text-left space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Operational Services</span>
          <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Cargo Consolidation & Freight Forwarding</h1>
          <p className="text-xs text-muted max-w-lg leading-relaxed">
            Spatial Express aggregates airline, ocean, and ground carriers to offer premium cargo routing options at contract discount tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(s => {
            const Icon = s.icon
            return (
              <Card key={s.title} className="glass-card border border-white/5 p-5 hover:border-primary/20 hover:shadow-glow transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{s.title}</h3>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Route depending on activeView
  if (activePortal === 'customer') {
    return <CustomerDashboard />
  }

  if (activePortal === 'admin') {
    return <AdminDashboard />
  }

  // Public portal routing
  switch (activeView) {
    case 'home':
      return <LandingPage />
    case 'calculator':
      return <CalculatorFlow />
    case 'tracking':
      return <ShipmentTracking />
    case 'services':
      return renderServicesPage()
    case 'about':
      return <About />
    case 'contact':
      return <Contact />
    default:
      return <LandingPage />
  }
}

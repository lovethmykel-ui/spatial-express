import { useLogistics } from '../context/LogisticsContext'
import LandingPage from './LandingPage'
import CalculatorFlow from './CalculatorFlow'
import ShipmentTracking from './ShipmentTracking'
import CustomerDashboard from './CustomerDashboard'
import AdminDashboard from './AdminDashboard'
import About from './About'
import Contact from './Contact'
import Services from './Services'

export default function Dashboard() {
  const { activePortal, activeView } = useLogistics()

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
      return <Services />
    case 'about':
      return <About />
    case 'contact':
      return <Contact />
    default:
      return <LandingPage />
  }
}

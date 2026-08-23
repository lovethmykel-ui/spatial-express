import { motion } from 'framer-motion'
import { GlobeIcon, UserIcon, ShieldAlertIcon, LayoutDashboardIcon, CalculatorIcon, MapPinIcon, TruckIcon, HelpCircleIcon, InfoIcon, PhoneIcon, CalendarIcon, HistoryIcon, BellIcon, FileTextIcon, TrendingUpIcon, SlidersIcon, UsersIcon, CreditCardIcon, NetworkIcon, LayersIcon, LogOutIcon, ChevronDownIcon, ActivityIcon, SunIcon, MoonIcon } from './ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { cn } from '../lib/utils'
import { useState } from 'react'

export default function Sidebar() {
  const { 
    activePortal, 
    setActivePortal, 
    activeView, 
    setActiveView,
    couriers,
    notifications,
    currentUser,
    theme,
    toggleTheme
  } = useLogistics()

  const [pricingOpen, setPricingOpen] = useState(true)
  const unreadNotifs = notifications.filter(n => !n.read).length

  // Portals configuration
  const allPortals = [
    { id: 'public', label: 'Public', icon: GlobeIcon },
    { id: 'customer', label: 'Client', icon: UserIcon },
    { id: 'admin', label: 'Operator', icon: ShieldAlertIcon }
  ] as const

  const portals = allPortals.filter(p => {
    if (!currentUser) return true // Show all if not logged in
    if (currentUser.role === 'customer' && p.id === 'admin') return false
    if (currentUser.role === 'admin' && p.id === 'customer') return false
    return true
  })

  // Nav Items depending on active portal
  const publicNav = [
    { label: 'Homepage', view: 'home', icon: GlobeIcon },
    { label: 'Quote Calculator', view: 'calculator', icon: CalculatorIcon },
    { label: 'Track Shipment', view: 'tracking', icon: MapPinIcon },
    { label: 'Our Services', view: 'services', icon: TruckIcon },
    { label: 'About Us', view: 'about', icon: InfoIcon },
    { label: 'Contact', view: 'contact', icon: PhoneIcon }
  ]

  const customerNav = [
    { label: 'Overview', view: 'dashboard', icon: LayoutDashboardIcon },
    { label: 'Book Pickup', view: 'pickup', icon: CalendarIcon },
    { label: 'Shipment History', view: 'history', icon: HistoryIcon },
    { label: 'Invoices', view: 'invoices', icon: FileTextIcon },
    { label: 'Notifications', view: 'notifications', icon: BellIcon, badge: unreadNotifs },
    { label: 'Support Center', view: 'support', icon: HelpCircleIcon }
  ]

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-[#0D1117]/80 backdrop-blur-xl h-screen select-none">
      
      {/* Brand Header */}
      <div className="flex flex-col px-6 py-5 border-b border-white/5 bg-background/20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Spatial Express Logo" className="h-8 w-auto object-contain" />
        </div>
        <p className="text-[9px] text-muted mt-1 tracking-wider uppercase font-semibold">Fast. Reliable. Everywhere.</p>
      </div>

      {/* Profile Card under Logo */}
      <div className="px-4 py-4 border-b border-white/5 bg-background/10">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary font-bold border border-primary/30">
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : (activePortal === 'admin' ? 'OP' : 'G')}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-[#0D1117]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser ? currentUser.name : (activePortal === 'admin' ? 'Admin Operator' : 'Guest User')}
            </p>
            <p className="text-[10px] text-muted truncate flex items-center gap-1">
              {currentUser ? (
                <>
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                  {currentUser.role === 'admin' ? 'Super Admin' : 'Premium Shipper'}
                </>
              ) : (
                'Not logged in'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Portal Segue Controller Slider */}
      <div className="px-4 py-3 border-b border-white/5 bg-background/5">
        <div className={cn(
          "grid gap-0.5 p-0.5 rounded-lg bg-black/60 border border-white/5 relative",
          portals.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {portals.map(p => {
            const Icon = p.icon
            const isSelected = activePortal === p.id
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePortal(p.id)
                  // Default views per portal
                  if (p.id === 'public') setActiveView('home')
                  if (p.id === 'customer') setActiveView('dashboard')
                  if (p.id === 'admin') setActiveView('admin-overview')
                }}
                className={cn(
                  "relative py-1.5 px-1 rounded-md text-[10px] font-semibold transition-all duration-300 z-10 flex flex-col items-center gap-1 cursor-pointer",
                  isSelected ? "text-black" : "text-text-secondary hover:text-white"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-portal-bg"
                    className="absolute inset-0 bg-primary rounded-md z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Portal Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        
        {/* PUBLIC PORTAL NAV */}
        {activePortal === 'public' && publicNav.map(item => {
          const Icon = item.icon
          const isSelected = activeView === item.view
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer relative",
                isSelected 
                  ? "bg-primary/10 text-white border border-primary/20 shadow-glow" 
                  : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {isSelected && (
                <div className="absolute left-1.5 top-3 w-1 h-4 rounded bg-primary" />
              )}
              <Icon className={cn("w-4 h-4", isSelected ? "text-primary scale-110" : "text-muted")} />
              <span>{item.label}</span>
            </button>
          )
        })}

        {/* CLIENT PORTAL NAV */}
        {activePortal === 'customer' && customerNav.map(item => {
          const Icon = item.icon
          const isSelected = activeView === item.view
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer relative",
                isSelected 
                  ? "bg-primary/10 text-white border border-primary/20 shadow-glow" 
                  : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isSelected ? "text-primary scale-110" : "text-muted")} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-primary text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}

        {/* ADMIN OPERATOR PORTAL NAV (Mockup style details) */}
        {activePortal === 'admin' && (
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('admin-overview')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-overview' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <LayoutDashboardIcon className="w-4 h-4 text-muted" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView('admin-shipments')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-shipments' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <TruckIcon className="w-4 h-4 text-muted" />
              <span>Shipments</span>
            </button>

            <button
              onClick={() => setActiveView('admin-orders')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-orders' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <CalendarIcon className="w-4 h-4 text-muted" />
              <span>Pending Pickups</span>
            </button>

            <button
              onClick={() => setActiveView('admin-customers')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-customers' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <UsersIcon className="w-4 h-4 text-muted" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveView('admin-partners')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-partners' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <NetworkIcon className="w-4 h-4 text-muted" />
              <span>Partners</span>
            </button>

            {/* Collapsible Pricing Section */}
            <div className="space-y-0.5">
              <button
                onClick={() => setPricingOpen(!pricingOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-text-secondary hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <SlidersIcon className="w-4 h-4 text-muted" />
                  <span>Pricing Control</span>
                </div>
                <ChevronDownIcon className={cn("w-3.5 h-3.5 transition-transform", pricingOpen && "rotate-180")} />
              </button>

              {pricingOpen && (
                <div className="pl-6 space-y-0.5 border-l border-white/5 ml-5 mt-1">
                  <button
                    onClick={() => setActiveView('admin-pricing-matrix')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-[11px] font-semibold transition-colors cursor-pointer block",
                      activeView === 'admin-pricing-matrix' ? "text-primary bg-primary/5" : "text-muted hover:text-white"
                    )}
                  >
                    Price Matrix Editor
                  </button>
                  <button
                    onClick={() => setActiveView('admin-zones')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-[11px] font-semibold transition-colors cursor-pointer block",
                      activeView === 'admin-zones' ? "text-primary bg-primary/5" : "text-muted hover:text-white"
                    )}
                  >
                    Zone Assignments
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveView('admin-payments')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-payments' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <CreditCardIcon className="w-4 h-4 text-muted" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveView('admin-reports')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-reports' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <TrendingUpIcon className="w-4 h-4 text-muted" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveView('admin-settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
                activeView === 'admin-settings' ? "bg-primary/10 text-white border border-primary/20" : "text-text-secondary hover:text-white"
              )}
            >
              <LayersIcon className="w-4 h-4 text-muted" />
              <span>Settings</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Info / Theme Switcher / Logout */}
      <div className="p-4 border-t border-white/5 bg-background/25 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <SunIcon className="w-4 h-4 text-warning" />
            ) : (
              <MoonIcon className="w-4 h-4 text-slate-700" />
            )}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </div>
          <span className="text-[10px] font-mono uppercase text-muted bg-white/5 px-2 py-0.5 rounded">
            {theme}
          </span>
        </button>

        <button 
          onClick={() => {
            setActivePortal('public')
            setActiveView('home')
          }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-muted hover:text-danger hover:bg-danger/10 border border-white/5 transition-colors cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Exit Portal</span>
        </button>
      </div>

    </aside>
  )
}

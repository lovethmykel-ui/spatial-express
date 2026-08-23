import { GlobeIcon, CalculatorIcon, MapPinIcon, MenuIcon, UserIcon, InfoIcon, PhoneIcon, BriefcaseIcon, XIcon, LayoutDashboardIcon, ArrowRightIcon, SunIcon, MoonIcon } from './ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface MobileNavProps {
  onLoginRequest?: () => void
}

export default function MobileNav({ onLoginRequest }: MobileNavProps) {
  const { 
    activePortal, 
    setActivePortal, 
    activeView, 
    setActiveView,
    theme,
    toggleTheme 
  } = useLogistics()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  type TabItem = {
    id: string;
    label: string;
    icon: any;
    portal?: string;
    view?: string;
    action?: string;
    isCenter?: boolean;
  };

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', portal: 'public', view: 'home', icon: GlobeIcon },
    { id: 'calculator', label: 'Quote', portal: 'public', view: 'calculator', icon: CalculatorIcon },
    { id: 'track', label: 'Track', portal: 'public', view: 'tracking', icon: MapPinIcon, isCenter: true },
    { id: 'menu', label: 'Explore', action: 'toggleMenu', icon: MenuIcon },
    { id: 'account', label: 'Portal', portal: 'customer', view: 'dashboard', icon: UserIcon }
  ]

  const menuLinks = [
    { label: 'Home', view: 'home', portal: 'public', icon: GlobeIcon, desc: 'Global logistics overview' },
    { label: 'Services', view: 'services', portal: 'public', icon: BriefcaseIcon, desc: 'Air, sea & road freight' },
    { label: 'Rate Calculator', view: 'calculator', portal: 'public', icon: CalculatorIcon, desc: 'Instant multi-carrier quote' },
    { label: 'Live Tracking', view: 'tracking', portal: 'public', icon: MapPinIcon, desc: 'Real-time cargo radar' },
    { label: 'About Us', view: 'about', portal: 'public', icon: InfoIcon, desc: 'Infrastructure & mission' },
    { label: 'Contact Us', view: 'contact', portal: 'public', icon: PhoneIcon, desc: '24/7 client dispatch' },
    { label: 'Client Dashboard', view: 'dashboard', portal: 'customer', icon: LayoutDashboardIcon, desc: 'Bookings, invoices & tickets' },
  ]

  return (
    <>
      {/* Expanding Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 120, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 120, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="lg:hidden fixed bottom-28 left-4 right-4 bg-[#0D1117]/95 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] rounded-3xl p-5 z-50 max-h-[75vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 px-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-white font-bold tracking-wider uppercase text-xs">Spatial Express</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Theme Switcher Button */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-semibold text-white cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <SunIcon className="w-3.5 h-3.5 text-warning" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="w-3.5 h-3.5 text-slate-300" />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
                  >
                    <XIcon className="w-4 h-4 text-white/80" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {menuLinks.map((link, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (activePortal === 'public' && link.portal !== 'public') {
                        setIsMenuOpen(false)
                        onLoginRequest?.()
                      } else {
                        setActivePortal(link.portal as any)
                        setActiveView(link.view)
                        setIsMenuOpen(false)
                      }
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-white/[0.08] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <link.icon className="w-4 h-4 text-primary group-hover:text-black transition-colors" />
                      </div>
                      <div className="text-left">
                        <span className="text-white text-sm font-semibold block">{link.label}</span>
                        <span className="text-[10px] text-text-secondary">{link.desc}</span>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-white/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Nav Dock */}
      <div className="lg:hidden fixed bottom-5 left-4 right-4 h-[68px] rounded-[32px] bg-[#0D1117]/85 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-between px-3 z-40 select-none pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = (tab.portal === activePortal && tab.view === activeView) || (tab.id === 'menu' && isMenuOpen)
          
          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative flex-1 flex justify-center -mt-7">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (activePortal === 'public' && tab.portal !== 'public') {
                      onLoginRequest?.()
                    } else if (tab.portal && tab.view) {
                      setActivePortal(tab.portal as any)
                      setActiveView(tab.view)
                    }
                  }}
                  className="relative w-15 h-15 rounded-2xl bg-gradient-to-br from-primary via-[#2bd620] to-[#128a30] p-0.5 shadow-[0_10px_28px_rgba(57,255,20,0.4)] flex items-center justify-center cursor-pointer group"
                >
                  <div className="w-full h-full rounded-[14px] bg-[#050608]/80 backdrop-blur-xl flex flex-col items-center justify-center">
                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-primary mt-0.5 font-mono">Radar</span>
                  </div>
                </motion.button>
              </div>
            )
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (tab.action === 'toggleMenu') {
                  setIsMenuOpen(!isMenuOpen)
                  return
                }
                if (activePortal === 'public' && tab.portal && tab.portal !== 'public') {
                  onLoginRequest?.()
                } else if (tab.portal && tab.view) {
                  setActivePortal(tab.portal as any)
                  setActiveView(tab.view)
                }
              }}
              className="flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer group"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/15 text-primary" : "text-white/40 group-hover:text-white/80"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "filter drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]"
                )} />
              </div>
              <span className={cn(
                "text-[9px] font-semibold transition-colors leading-none mt-0.5",
                isActive ? "text-white font-bold" : "text-white/40 group-hover:text-white/70"
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#39FF14]"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}

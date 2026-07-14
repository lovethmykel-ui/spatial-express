import { GlobeIcon, CalculatorIcon, MapPinIcon, MenuIcon, UserIcon, InfoIcon, PhoneIcon, BriefcaseIcon, XIcon, LayoutDashboardIcon, ArrowRightIcon } from './ui/CustomIcons'
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
    setActiveView 
  } = useLogistics()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  type TabItem = {
    id: string;
    icon: any;
    portal?: string;
    view?: string;
    action?: string;
    isCenter?: boolean;
  };

  const tabs: TabItem[] = [
    { id: 'home', portal: 'public', view: 'home', icon: GlobeIcon },
    { id: 'calculator', portal: 'public', view: 'calculator', icon: CalculatorIcon },
    { id: 'track', portal: 'public', view: 'tracking', icon: MapPinIcon, isCenter: true },
    { id: 'menu', action: 'toggleMenu', icon: MenuIcon },
    { id: 'account', portal: 'customer', view: 'dashboard', icon: UserIcon }
  ]
  const menuLinks = [
    { label: 'Home', view: 'home', portal: 'public', icon: GlobeIcon },
    { label: 'Services', view: 'services', portal: 'public', icon: BriefcaseIcon },
    { label: 'About Us', view: 'about', portal: 'public', icon: InfoIcon },
    { label: 'Contact Us', view: 'contact', portal: 'public', icon: PhoneIcon },
    { label: 'Customer Portal', view: 'dashboard', portal: 'customer', icon: LayoutDashboardIcon },
  ]

  return (
    <>
      {/* Expanding Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-24 left-4 right-4 bg-[#0D1117]/90 liquid-glass border border-white/10 shadow-2xl rounded-3xl p-4 z-40"
          >
            <div className="flex justify-between items-center mb-4 px-2 border-b border-white/5 pb-2">
              <span className="text-white font-bold tracking-wider uppercase text-xs">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <XIcon className="w-4 h-4 text-white/70" />
              </button>
            </div>
            <div className="space-y-2">
              {menuLinks.map((link, idx) => (
                <button
                  key={idx}
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
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <link.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white text-sm font-semibold">{link.label}</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed bottom-6 left-4 right-4 h-[72px] rounded-[36px] glass-panel flex items-center justify-between px-2 z-50 select-none pb-safe">
      
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activePortal === tab.portal && activeView === tab.view
        
        if (tab.isCenter) {
          return (
            <div key={tab.id} className="relative flex-1 flex justify-center -mt-6">
              <button
                onClick={() => {
                  if (activePortal === 'public' && tab.portal !== 'public') {
                    onLoginRequest?.()
                  } else if (tab.portal && tab.view) {
                    setActivePortal(tab.portal as any)
                    setActiveView(tab.view)
                  }
                }}
                className="w-16 h-16 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Icon className={cn("w-7 h-7 text-white transition-all duration-300", isActive && "text-primary filter drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]")} />
              </button>
            </div>
          )
        }

        return (
          <button
            key={tab.id}
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
            <Icon 
              className={cn(
                "w-6 h-6 transition-all duration-300",
                isActive 
                  ? "text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : "text-white/40 group-hover:text-white/80"
              )} 
            />
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}

      </div>
    </>
  )
}

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MobileNav from './components/MobileNav'
import Dashboard from './pages/Dashboard'
import CustomCursor from './components/CustomCursor'
import { useLogistics } from './context/LogisticsContext'
import { cn } from './lib/utils'
import Footer from './components/Footer'
import { Button } from './components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import LoginModal from './components/LoginModal'
import LiveActivityToast from './components/LiveActivityToast'

export default function App() {
  const { activePortal, activeView, setActiveView } = useLogistics()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const isPublic = activePortal === 'public'

  return (
    <div className="min-h-screen bg-background text-text relative overflow-hidden flex flex-col custom-cursor-area select-none transition-colors duration-300">
      {/* Glowing delivery cursor */}
      <CustomCursor />

      {/* Live Social Proof Activity Toast */}
      {isPublic && <LiveActivityToast />}

      {/* Ambient Lighting Effects - Light Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#06B6D4]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-[160px]" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {isPublic ? (
        /* PUBLIC PORTAL VIEWPORTS (Full-width custom layout) */
        <div className="flex-1 flex flex-col w-full relative z-10">
          
          {/* Floating Premium Navbar adhering to 3-Zone Top Bar Contract */}
          <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
            <header className="w-full max-w-7xl glass-nav rounded-2xl py-3 px-6 md:px-8 flex items-center justify-between gap-8 border border-slate-200/90 shadow-sm">
              {/* Zone 1: Single text element Brand Wordmark */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { setActiveView('home') }}
                className="flex items-center gap-2.5 cursor-pointer shrink-0"
              >
                <img src="/logo.png" alt="Spatial Express Logo" className="h-7 w-auto object-contain" />
                <span className="font-display font-bold text-base tracking-tight text-slate-900 whitespace-nowrap">
                  Spatial Express
                </span>
              </motion.div>

              {/* Zone 2: 5 single-line clean navigation links */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
                {[
                  { label: 'Services', view: 'services' },
                  { label: 'Rate Calculator', view: 'calculator' },
                  { label: 'Live Tracking', view: 'tracking' },
                  { label: 'About Us', view: 'about' },
                  { label: 'Contact', view: 'contact' },
                ].map(link => {
                  const isActive = activeView === link.view
                  return (
                    <button
                      key={link.view}
                      onClick={() => setActiveView(link.view)}
                      className={cn(
                        "transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 py-1 relative",
                        isActive 
                          ? "text-slate-900 font-bold" 
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Zone 3: 1 primary action */}
              <div className="hidden md:flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Client Console
                </button>
                <Button 
                  onClick={() => {
                    setActiveView('calculator')
                  }}
                  size="sm" 
                  className="text-xs font-bold px-4 py-2 cursor-pointer shadow-sm hover:shadow transition-all bg-primary hover:bg-emerald-700 text-white whitespace-nowrap rounded-lg"
                >
                  Get Instant Quote
                </Button>
              </div>
            </header>
          </div>

          {/* Page Contents (Add top padding for floating nav) */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dashboard />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Standalone Footer */}
          <Footer />
          <MobileNav onLoginRequest={() => setIsLoginModalOpen(true)} />
        </div>
      ) : (
        /* BACKOFFICE / CLIENT DASHBOARD (Side Navigation Shell) */
        <div className="flex h-screen w-full overflow-hidden relative z-10">
          <Sidebar />
          <div className="flex-1 flex flex-col relative z-0 overflow-hidden bg-background">
            <TopBar />
            <main className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePortal}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Dashboard />
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
          <MobileNav onLoginRequest={() => setIsLoginModalOpen(true)} />
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}

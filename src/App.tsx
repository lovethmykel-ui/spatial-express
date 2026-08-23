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
import { SunIcon, MoonIcon } from './components/ui/CustomIcons'
import LiveActivityToast from './components/LiveActivityToast'

export default function App() {
  const { activePortal, activeView, setActiveView, theme, toggleTheme } = useLogistics()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const isPublic = activePortal === 'public'

  return (
    <div className="min-h-screen bg-background text-text relative overflow-hidden flex flex-col custom-cursor-area select-none transition-colors duration-300">
      {/* Glowing delivery cursor */}
      <CustomCursor />

      {/* Live Social Proof Activity Toast */}
      {isPublic && <LiveActivityToast />}

      {/* Cyber Ambient Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {isPublic ? (
        /* PUBLIC PORTAL VIEWPORTS (Full-width custom layout) */
        <div className="flex-1 flex flex-col w-full relative z-10">
          
          {/* Floating Premium Navbar */}
          <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
            <header className="w-full max-w-7xl glass-nav rounded-2xl py-3 px-6 md:px-8 flex items-center justify-between border border-slate-200 dark:border-white/10 shadow-glass">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveView('home') }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain drop-shadow-md group-hover:brightness-110 transition-all" />
              </motion.div>

              {/* Middle Nav Links */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1.5 rounded-full border border-slate-200 dark:border-white/5 text-xs font-semibold text-text-secondary">
                {[
                  { label: 'Home', view: 'home' },
                  { label: 'Services', view: 'services' },
                  { label: 'Rate Calculator', view: 'calculator' },
                  { label: 'Live Tracking', view: 'tracking' },
                  { label: 'About Us', view: 'about' },
                  { label: 'Contact', view: 'contact' },
                ].map(link => {
                  const isActive = activeView === link.view
                  return (
                    <motion.button
                      key={link.view}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveView(link.view)}
                      className={cn(
                        "px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer relative",
                        isActive ? "text-text font-bold" : "text-text-secondary hover:text-text hover:bg-white/5"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="active-desktop-pill"
                          className="absolute inset-0 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] -z-10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Action Buttons & Theme Switcher */}
              <div className="hidden md:flex items-center gap-3">
                {/* Theme Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  className="w-9 h-9 rounded-xl glass-button flex items-center justify-center cursor-pointer text-text-secondary hover:text-primary transition-colors"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="w-4 h-4 text-warning" />
                  ) : (
                    <MoonIcon className="w-4 h-4 text-slate-700" />
                  )}
                </motion.button>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs font-bold text-text-secondary hover:text-text px-4 py-2 transition-all cursor-pointer rounded-xl hover:bg-white/5"
                >
                  Client Portal
                </motion.button>
                <Button 
                  onClick={() => {
                    setActiveView('calculator')
                  }}
                  size="sm" 
                  className="text-xs font-bold px-5 py-2 cursor-pointer shadow-glow hover:shadow-glow-strong transition-all"
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

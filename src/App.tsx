import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MobileNav from './components/MobileNav'
import Dashboard from './pages/Dashboard'
import CustomCursor from './components/CustomCursor'
import { useLogistics } from './context/LogisticsContext'
import { cn } from './lib/utils'
import Footer from './components/Footer'
import { Button } from './components/ui/Button'
import { motion } from 'framer-motion'
import LoginModal from './components/LoginModal'
import { useState } from 'react'

export default function App() {
  const { activePortal, setActivePortal, activeView, setActiveView } = useLogistics()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const isPublic = activePortal === 'public'

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col custom-cursor-area">
      {/* Glowing neon delivery truck cursor */}
      <CustomCursor />

      {isPublic ? (
        /* PUBLIC PORTAL VIEWPORTS (Full-width custom layout) */
        <div className="flex-1 flex flex-col w-full">
          
          {/* Floating Premium Navbar */}
          <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
            <header className="w-full max-w-7xl bg-[#0D1117]/70 backdrop-blur-xl border border-white/10 shadow-glass rounded-2xl py-3 px-6 md:px-8 flex items-center justify-between select-none">
              <div 
                onClick={() => { setActiveView('home') }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
              </div>

              {/* Middle Nav Links */}
              <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-secondary">
                {[
                  { label: 'Home', view: 'home' },
                  { label: 'Services', view: 'services' },
                  { label: 'Calculator', view: 'calculator' },
                  { label: 'Track Shipment', view: 'tracking' },
                  { label: 'About Us', view: 'about' },
                  { label: 'Contact Us', view: 'contact' },
                ].map(link => (
                  <button
                    key={link.view}
                    onClick={() => setActiveView(link.view)}
                    className={cn(
                      "hover:text-primary transition-colors cursor-pointer text-left relative",
                      activeView === link.view && "text-white"
                    )}
                  >
                    {link.label}
                    {activeView === link.view && (
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs font-bold text-white hover:text-primary px-4 py-2 transition-all cursor-pointer"
                >
                  Login
                </button>
                <Button 
                  onClick={() => {
                    setActiveView('calculator')
                  }}
                  size="sm" 
                  className="text-xs font-bold px-4 py-2 cursor-pointer shadow-glow-secondary"
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Toggle removed in favor of Degen-style bottom nav */}
            </header>
          </div>

          {/* Page Contents (Add top padding for floating nav) */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
            <Dashboard />
          </main>

          {/* Standalone Footer */}
          <Footer />
          <MobileNav onLoginRequest={() => setIsLoginModalOpen(true)} />
        </div>
      ) : (
        /* BACKOFFICE / CLIENT DASHBOARD (Side Navigation Shell) */
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col relative z-0 overflow-hidden bg-background">
            <TopBar />
            <main className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <Dashboard />
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

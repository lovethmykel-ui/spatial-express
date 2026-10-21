import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon, ShieldAlertIcon, XIcon, ArrowRightIcon, CheckCircleIcon } from './ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { cn } from '../lib/utils'
import SliderPuzzle from './SliderPuzzle'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { setActivePortal, setActiveView, setCurrentUser } = useLogistics()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('123456789') // Default password
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [pendingUser, setPendingUser] = useState<any>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    setTimeout(() => {
      const emailLower = email.toLowerCase().trim()
      
      if (emailLower === 'danny@example.com' && password === '123456789') {
        setPendingUser({ name: 'danny Michael', email: emailLower, role: 'customer' })
        setShowPuzzle(true)
      } else if (emailLower === 'dora@sel.com' && password === '123456789') {
        setPendingUser({ name: 'dora Opu', email: emailLower, role: 'admin' })
        setShowPuzzle(true)
      } else {
        setError('Invalid credentials. Please check your email and password.')
      }
      
      setIsSubmitting(false)
    }, 800) // Simulated network delay
  }

  const handlePuzzleSuccess = () => {
    if (pendingUser) {
      setCurrentUser(pendingUser)
      setActivePortal(pendingUser.role)
      setActiveView(pendingUser.role === 'customer' ? 'dashboard' : 'admin-overview')
      
      // reset states after a tiny delay to allow the checkmark animation to show
      setTimeout(() => {
        onClose()
        setShowPuzzle(false)
        setPendingUser(null)
      }, 500)
    }
  }

  const handlePuzzleCancel = () => {
    setShowPuzzle(false)
    setPendingUser(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-[28px] p-8 shadow-2xl overflow-hidden"
          >
            {/* Top right close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer z-10 text-slate-500 hover:text-slate-900"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                {showPuzzle ? <CheckCircleIcon className="w-8 h-8 text-primary" /> : <UserIcon className="w-8 h-8 text-primary" />}
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {showPuzzle ? 'Verification Required' : 'Secure Login'}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {showPuzzle ? 'Prove you are human to continue' : 'Enter your credentials to continue'}
              </p>
            </div>

            {showPuzzle ? (
              <div className="relative z-10">
                <SliderPuzzle onSuccess={handlePuzzleSuccess} onCancel={handlePuzzleCancel} />
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="•••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-400"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-center">
                    <p className="text-xs font-bold text-danger">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer shadow-sm",
                    isSubmitting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In Securely'}
                  {!isSubmitting && <ArrowRightIcon className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Demo Helper Links */}
            <div className="mt-6 flex items-center justify-between text-[10px] text-slate-500 relative z-10 border-t border-slate-100 pt-4">
              <p>Demo Customer: <br/><strong className="text-slate-800">danny@example.com</strong></p>
              <p className="text-right">Demo Admin: <br/><strong className="text-slate-800">dora@sel.com</strong></p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { NavLink } from 'react-router-dom'

const links = [
  { 
    to: '/', 
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    to: '/check', 
    label: 'Token Audit',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    to: '/airdrops', 
    label: 'Airdrops',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    )
  },
  { 
    to: '/compare', 
    label: 'Fees & Yield',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
]

export default function Navigation() {
  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none h-16 items-center px-8 justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold to-purple">
            DEGEN<span className="text-white">_</span>TOOLKIT
          </span>
        </div>
        
        <div className="flex gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-purple/20 text-gold shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'text-muted hover:text-white hover:bg-surfaceAlt'
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass-panel rounded-2xl p-2 flex justify-between items-center shadow-glow-purple">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 flex-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-gold bg-purple/20'
                  : 'text-muted hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`mb-1 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : ''}`}>
                  {l.icon}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{l.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

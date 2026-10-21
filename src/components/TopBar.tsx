import { useState, useRef, useEffect } from 'react'
import { BellIcon, SearchIcon, UserIcon, ChevronDownIcon, CheckIcon, ShieldCheckIcon, HelpCircleIcon, PackageIcon, ArrowRightIcon, ShieldAlertIcon, GlobeIcon } from './ui/CustomIcons'
import { useLogistics } from '../context/LogisticsContext'
import { cn } from '../lib/utils'

export default function TopBar() {
  const { 
    activePortal, 
    setActivePortal, 
    activeView, 
    setActiveView,
    notifications,
    markNotificationsRead,
    shipments,
    setSelectedTrackingId,
    currentUser,
    setCurrentUser
  } = useLogistics()

  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Generate dynamic breadcrumb labels
  const getBreadcrumbs = () => {
    const portalLabel = activePortal === 'public' ? 'Public Portal' : activePortal === 'customer' ? 'Client Console' : 'Operator OS'
    
    let viewLabel = ''
    switch (activeView) {
      case 'home': viewLabel = 'Homepage / Logistics Central'; break
      case 'calculator': viewLabel = 'Freight Rate Calculator'; break
      case 'tracking': viewLabel = 'Real-Time Container Tracking'; break
      case 'services': viewLabel = 'Cargo & Freight Services'; break
      case 'about': viewLabel = 'Corporate Story & Global Network'; break
      case 'contact': viewLabel = 'Operational Contact Hub'; break
      case 'dashboard': viewLabel = 'Client Operations Overview'; break
      case 'pickup': viewLabel = 'Schedule Courier Pickup'; break
      case 'history': viewLabel = 'Shipment Manifest Ledger'; break
      case 'invoices': viewLabel = 'Financial Statements & Invoices'; break
      case 'notifications': viewLabel = 'Operational Alert Log'; break
      case 'support': viewLabel = '24/7 Logistics Helpdesk'; break
      case 'admin-overview': viewLabel = 'Global Logistics KPI Analytics'; break
      case 'admin-shipments': viewLabel = 'Freight Order Manifests'; break
      case 'admin-orders': viewLabel = 'Pending Driver Dispatch'; break
      case 'admin-customers': viewLabel = 'Enterprise Accounts'; break
      case 'admin-partners': viewLabel = 'Courier Aggregation Control'; break
      case 'admin-pricing-matrix': viewLabel = 'Freight Pricing Matrix Sheet'; break
      case 'admin-zones': viewLabel = 'Shipping Zones & Country Allocator'; break
      case 'admin-payments': viewLabel = 'Financial Transaction Ledgers'; break
      case 'admin-reports': viewLabel = 'Analytics & Revenue Reports'; break
      case 'admin-settings': viewLabel = 'Global Engine Configurations'; break
      default: viewLabel = activeView.replace('admin-', '').toUpperCase()
    }
    
    return { portalLabel, viewLabel }
  }

  const { portalLabel, viewLabel } = getBreadcrumbs()

  // Handle outside clicks to close dropdowns & global Ctrl+K shortcut
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setShowSearchResults(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Mock global search filter
  const getSearchMatches = () => {
    if (!searchQuery) return { shipments: [], invoices: [] }
    const q = searchQuery.toLowerCase()
    
    // Search shipments by ID, recipient, or destination
    const matchingShipments = shipments.filter((s: any) => 
      s.id.toLowerCase().includes(q) || 
      s.recipientName.toLowerCase().includes(q) || 
      s.destination.toLowerCase().includes(q)
    )

    // Search invoices
    const matchingInvoices = shipments.filter((s: any) => 
      s.invoiceId.toLowerCase().includes(q)
    )

    return { shipments: matchingShipments, invoices: matchingInvoices }
  }

  const searchMatches = getSearchMatches()
  const hasMatches = (searchMatches.shipments && searchMatches.shipments.length > 0) || (searchMatches.invoices && searchMatches.invoices.length > 0)

  return (
    <header className="min-h-16 py-3 md:py-0 border-b border-slate-200 bg-white/95 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 z-30 select-none gap-3 md:gap-0 shadow-sm">
      
      {/* Dynamic Breadcrumbs */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <span>{portalLabel}</span>
          <span>/</span>
          <span className="text-primary font-bold">{activePortal === 'admin' ? 'Operations' : 'Client'}</span>
        </div>
        <h2 className="text-xs font-bold text-slate-900 tracking-wide mt-0.5">{viewLabel}</h2>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        
        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 md:flex-none md:w-80">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tracking, invoice, client..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(true)
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-14 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center pointer-events-none">
              <kbd className="text-[9px] font-mono bg-slate-200 border border-slate-300 text-slate-600 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Search Result Dropdown */}
          {showSearchResults && searchQuery && (
            <div className="absolute right-0 top-12 w-full glass-card border border-slate-200 bg-white rounded-lg overflow-hidden shadow-xl p-2 z-50 text-left">
              <p className="text-[10px] font-semibold text-slate-500 px-3 py-1.5 border-b border-slate-100 uppercase tracking-wider">Search Results</p>
              
              <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                {/* Shipments section */}
                {searchMatches.shipments && searchMatches.shipments.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[9px] text-primary font-bold px-3 py-1 uppercase tracking-wider">Shipments</p>
                    {searchMatches.shipments.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedTrackingId(s.id)
                          // Route to tracking page
                          if (activePortal === 'admin') {
                            setActiveView('admin-shipments')
                          } else {
                            setActivePortal('public')
                            setActiveView('tracking')
                          }
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <PackageIcon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <p className="text-slate-900 font-bold truncate text-[11px]">{s.id}</p>
                            <p className="text-slate-500 text-[10px] truncate">{s.recipientName} ({s.destination})</p>
                          </div>
                        </div>
                        <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Invoices section */}
                {searchMatches.invoices && searchMatches.invoices.length > 0 && (
                  <div>
                    <p className="text-[9px] text-amber-600 font-bold px-3 py-1 uppercase tracking-wider">Invoices</p>
                    {searchMatches.invoices.map(s => (
                      <button
                        key={s.invoiceId}
                        onClick={() => {
                          if (activePortal === 'admin') {
                            setActiveView('admin-payments')
                          } else {
                            setActivePortal('customer')
                            setActiveView('invoices')
                          }
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="text-slate-900 font-bold text-[11px]">{s.invoiceId}</p>
                          <p className="text-slate-500 text-[10px]">Cost: {s.cost.toLocaleString()} NGN | {s.id}</p>
                        </div>
                        <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {!hasMatches && (
                  <p className="text-xs text-slate-500 text-center py-6">No matches found for "{searchQuery}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Notification Center */}
        <div ref={notificationRef} className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="w-10 h-10 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center relative cursor-pointer group transition-colors shadow-sm"
          >
            <BellIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 glass-card border border-slate-200 bg-white rounded-lg overflow-hidden shadow-xl p-2 z-50 text-left">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Logistics Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      markNotificationsRead()
                    }}
                    className="text-[9px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3 rounded-md hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex gap-2.5 transition-colors relative",
                      !n.read && "bg-emerald-50/50"
                    )}
                  >
                    {!n.read && (
                      <span className="absolute top-4 right-3 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <div className="mt-0.5">
                      {n.type === 'success' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      {n.type === 'warning' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                      {n.type === 'danger' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                      {n.type === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">{n.title}</p>
                      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{n.description}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => {
                  if (activePortal === 'customer') {
                    setActiveView('notifications')
                  } else {
                    setActivePortal('customer')
                    setActiveView('notifications')
                  }
                  setShowNotifications(false)
                }}
                className="w-full text-center py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-900 border-t border-slate-100 mt-1 block transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile Menu / Quick Swappers */}
        <div ref={profileRef} className="relative shrink-0">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-7 h-7 rounded-md overflow-hidden bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : (activePortal === 'admin' ? 'OP' : 'CO')}
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden md:inline-block">
              {currentUser ? currentUser.name : (activePortal === 'admin' ? 'Operator' : 'Guest')}
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 hidden md:inline-block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 glass-card border border-slate-200 bg-white rounded-lg overflow-hidden shadow-xl p-1.5 z-50 text-left">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Spatial Active Session</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {currentUser ? currentUser.email : (activePortal === 'admin' ? 'superadmin@spatialexpress.com' : 'guest@spatialexpress.com')}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActivePortal('public')
                    setActiveView('home')
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <GlobeIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Public Portal (Client Web)</span>
                </button>
                
                <button
                  onClick={() => {
                    setActivePortal('customer')
                    setActiveView('dashboard')
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Client Console (Dashboard)</span>
                </button>

                <button
                  onClick={() => {
                    setActivePortal('admin')
                    setActiveView('admin-overview')
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldAlertIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Operator OS (Admin)</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    setCurrentUser(null)
                    setActivePortal('public')
                    setActiveView('home')
                    setShowProfileMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-danger/10 text-xs text-slate-500 hover:text-danger flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  )
}

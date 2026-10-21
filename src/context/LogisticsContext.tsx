import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// --- Type Definitions ---

export interface TrackingStep {
  status: string
  location: string
  time: string
  completed: boolean
}

export interface Shipment {
  id: string
  courier: string
  origin: string
  destination: string
  weight: number
  packageType: string
  cost: number
  status: 'pending' | 'picked_up' | 'processing' | 'in_transit' | 'customs' | 'delivered' | 'cancelled' | 'returned'
  insurance: boolean
  declaredValue: number
  createdDate: string
  estimatedDelivery: string
  history: TrackingStep[]
  invoiceId: string
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
}

export interface Courier {
  id: string
  name: string
  logo: string
  enabled: boolean
  priority: 'high' | 'medium' | 'low'
  health: 'optimal' | 'degraded' | 'offline'
  baseSpeed: string
  baseRate: number
}

export interface Country {
  code: string
  name: string
  flag?: string
}

export interface Zone {
  id: string
  name: string
  description: string
  countries: Country[]
}

export interface PriceRecord {
  courierId: string
  weight: number
  price: number
}

export interface PriceHistoryItem {
  id: string
  date: string
  admin: string
  courier: string
  zone: string
  changes: string
  originalMatrix: Record<string, Record<number, number>>
}

export interface SupportMessage {
  sender: 'user' | 'agent'
  text: string
  time: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'closed'
  createdDate: string
  messages: SupportMessage[]
}

export interface GlobalNotification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'danger'
}

export interface UserInfo {
  name: string
  email: string
  role: 'customer' | 'admin'
}

interface LogisticsContextType {
  // Theme Management
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  // Navigation & View Mode
  activePortal: 'public' | 'customer' | 'admin'
  setActivePortal: (portal: 'public' | 'customer' | 'admin') => void
  activeView: string
  setActiveView: (view: string) => void
  
  // Custom Cursor
  customCursorActive: boolean
  setCustomCursorActive: (active: boolean) => void

  // User State
  currentUser: UserInfo | null
  setCurrentUser: (user: UserInfo | null) => void

  // Data State
  shipments: Shipment[]
  couriers: Courier[]
  zones: Zone[]
  priceMatrix: Record<string, Record<number, number>> // courierId -> weight -> price
  priceHistory: PriceHistoryItem[]
  notifications: GlobalNotification[]
  supportTickets: SupportTicket[]
  
  // Checkout & Calculator State
  calculatorForm: {
    origin: string
    destination: string
    weight: number
    packageType: string
    insurance: boolean
    declaredValue: number
    deliverySpeed: string
  }
  setCalculatorForm: React.Dispatch<React.SetStateAction<any>>
  calculatorResults: any[]
  setCalculatorResults: (results: any[]) => void
  selectedCourierResult: any
  setSelectedCourierResult: (courier: any) => void
  checkoutStep: number
  setCheckoutStep: (step: number) => void
  
  // Operations & Actions
  updatePriceMatrixCell: (courierId: string, weight: number, newPrice: number) => void
  generatePrices: (basePrice: number, increment: number, roundingRule: number) => void
  undoPriceEdit: () => void
  redoPriceEdit: () => void
  canUndo: boolean
  canRedo: boolean
  togglePartner: (courierId: string) => void
  updatePartnerPriority: (courierId: string, priority: 'high' | 'medium' | 'low') => void
  addZone: (name: string, description: string) => void
  renameZone: (zoneId: string, name: string, description: string) => void
  deleteZone: (zoneId: string) => void
  assignCountryToZone: (country: Country, targetZoneId: string) => { conflict: boolean; originalZoneName?: string; originalZoneId?: string } | null
  confirmCountryTransfer: (country: Country, sourceZoneId: string, targetZoneId: string) => void
  removeCountryFromZone: (countryCode: string, zoneId: string) => void
  bookPickupBooking: (bookingDetails: any) => void
  processCheckoutPayment: (method: string) => Shipment
  markNotificationsRead: () => void
  createSupportTicket: (subject: string, messageText: string) => void
  addSupportChatMessage: (ticketId: string, text: string) => void
  selectedTrackingId: string
  setSelectedTrackingId: (id: string) => void
  selectedShipmentDetail: Shipment | null
  setSelectedShipmentDetail: (shipment: Shipment | null) => void
}

const weightTiers = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0]

const initialCountries: Country[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
]

export const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined)

export function LogisticsProvider({ children }: { children: ReactNode }) {
  // Theme State - Light mode only
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    localStorage.setItem('spatial_express_theme', 'light')
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }, [])

  const toggleTheme = () => {
    // Light mode only
    setTheme('light')
  }

  // Navigation & Workspace
  const [activePortal, setActivePortal] = useState<'public' | 'customer' | 'admin'>('public')
  const [activeView, setActiveView] = useState<string>('home')
  
  // User Authentication Mock
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)

  // Custom neon cursor active states
  const [customCursorActive, setCustomCursorActive] = useState<boolean>(true)

  // Tracking selection helper
  const [selectedTrackingId, setSelectedTrackingId] = useState<string>('SPX-8294-0921')
  const [selectedShipmentDetail, setSelectedShipmentDetail] = useState<Shipment | null>(null)

  // Active calculator states
  const [calculatorForm, setCalculatorForm] = useState({
    origin: 'Nigeria',
    destination: 'United Kingdom',
    weight: 1.5,
    packageType: 'Parcel',
    insurance: true,
    declaredValue: 250,
    deliverySpeed: 'Standard'
  })
  const [calculatorResults, setCalculatorResults] = useState<any[]>([])
  const [selectedCourierResult, setSelectedCourierResult] = useState<any>(null)
  const [checkoutStep, setCheckoutStep] = useState<number>(1)

  // 1. Couriers
  const [couriers, setCouriers] = useState<Courier[]>([
    { id: 'dhl', name: 'DHL Express', logo: '/courier badges/dhl.png', enabled: true, priority: 'high', health: 'optimal', baseSpeed: '1-3 Business Days', baseRate: 15.5 },
    { id: 'fedex', name: 'FedEx Express', logo: '/courier badges/fedex.png', enabled: true, priority: 'high', health: 'optimal', baseSpeed: '2-4 Business Days', baseRate: 14.2 },
    { id: 'ups', name: 'UPS Worldwide', logo: '/courier badges/ups.png', enabled: true, priority: 'medium', health: 'optimal', baseSpeed: '2-5 Business Days', baseRate: 13.8 },
    { id: 'aramex', name: 'Aramex International', logo: '/courier badges/aramex.png', enabled: true, priority: 'medium', health: 'optimal', baseSpeed: '3-6 Business Days', baseRate: 11.4 },
    { id: 'ems', name: 'EMS Speed Post', logo: '/courier badges/ems.png', enabled: false, priority: 'low', health: 'offline', baseSpeed: '5-9 Business Days', baseRate: 8.5 },
  ])

  // 2. Zones
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 'zone-1',
      name: 'Zone 1 (Europe)',
      description: 'Western and Central European Countries',
      countries: [
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱' }
      ]
    },
    {
      id: 'zone-2',
      name: 'Zone 2 (Americas)',
      description: 'North American and Select LATAM countries',
      countries: [
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' }
      ]
    },
    {
      id: 'zone-3',
      name: 'Zone 3 (Middle East)',
      description: 'Middle East and Gulf Cooperation Countries',
      countries: [
        { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
        { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' }
      ]
    },
    {
      id: 'zone-4',
      name: 'Zone 4 (Asia Pacific)',
      description: 'Asia Pacific, Australia, and New Zealand',
      countries: [
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
        { code: 'CN', name: 'China', flag: '🇨🇳' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: 'SG', name: 'Singapore', flag: '🇸🇬' }
      ]
    }
  ])

  // 3. Price Matrix (Pre-filled matching the mockup spreadsheet editor)
  const [priceMatrix, setPriceMatrix] = useState<Record<string, Record<number, number>>>(() => {
    const matrix: Record<string, Record<number, number>> = {}
    
    // Fill DHL
    matrix['dhl'] = {
      0.2: 6500, 0.5: 9800, 1.0: 13200, 1.5: 16500, 2.0: 19500,
      3.0: 27800, 5.0: 43500, 10.0: 78500, 15.0: 112500, 20.0: 146000,
      25.0: 179000, 30.0: 210000
    }
    
    // Fill FedEx
    matrix['fedex'] = {
      0.2: 6200, 0.5: 9300, 1.0: 12600, 1.5: 15800, 2.0: 18700,
      3.0: 26500, 5.0: 41200, 10.0: 74500, 15.0: 107000, 20.0: 138000,
      25.0: 170000, 30.0: 199000
    }
    
    // Fill UPS
    matrix['ups'] = {
      0.2: 6000, 0.5: 9000, 1.0: 12200, 1.5: 15300, 2.0: 18000,
      3.0: 25500, 5.0: 39800, 10.0: 72000, 15.0: 103000, 20.0: 133000,
      25.0: 163000, 30.0: 190000
    }
    
    // Fill Aramex
    matrix['aramex'] = {
      0.2: 5800, 0.5: 8500, 1.0: 11500, 1.5: 14300, 2.0: 16900,
      3.0: 24000, 5.0: 37500, 10.0: 67500, 15.0: 96500, 20.0: 125000,
      25.0: 153000, 30.0: 178000
    }
    
    // Fill EMS
    matrix['ems'] = {
      0.2: 4500, 0.5: 6800, 1.0: 9200, 1.5: 11800, 2.0: 13800,
      3.0: 19500, 5.0: 31000, 10.0: 55000, 15.0: 79000, 20.0: 102000,
      25.0: 125000, 30.0: 145000
    }
    
    return matrix
  })

  // History stacks for undo/redo price edits
  const [historyStack, setHistoryStack] = useState<Record<string, Record<number, number>>[]>([])
  const [redoStack, setRedoStack] = useState<Record<string, Record<number, number>>[]>([])
  
  const canUndo = historyStack.length > 0
  const canRedo = redoStack.length > 0

  // 4. Price History Log
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([
    { id: 'h1', date: 'Today, 09:30 AM', admin: 'Admin User', courier: 'DHL Express', zone: 'Zone 1 (Europe)', changes: '12 cells updated', originalMatrix: {} },
    { id: 'h2', date: 'Yesterday, 04:15 PM', admin: 'Admin User', courier: 'FedEx Express', zone: 'Zone 2 (Americas)', changes: '24 cells updated', originalMatrix: {} },
    { id: 'h3', date: 'May 10, 2026, 11:20 AM', admin: 'Manager', courier: 'UPS Express', zone: 'Zone 3 (Middle East)', changes: '18 cells updated', originalMatrix: {} },
  ])

  // 5. Mock Shipments list
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'SPX-8294-0921',
      courier: 'dhl',
      origin: 'Lagos, Nigeria',
      destination: 'London, United Kingdom',
      weight: 1.5,
      packageType: 'Parcel',
      cost: 16500,
      status: 'in_transit',
      insurance: true,
      declaredValue: 200000,
      createdDate: '2026-07-10 10:22 AM',
      estimatedDelivery: '2026-07-14 05:00 PM',
      invoiceId: 'INV-2026-0921',
      senderName: 'Chloe Okafor',
      senderAddress: '4 Victory Street, off Police Post, Eliozu, Port Harcourt',
      recipientName: 'Oliver Smith',
      recipientAddress: '12 Baker Street, London, NW1 6XE, UK',
      history: [
        { status: 'Package Received', location: 'Lagos Hub, Nigeria', time: 'Jul 10, 10:22 AM', completed: true },
        { status: 'Departed Lagos Facility', location: 'Lagos Airport, Nigeria', time: 'Jul 11, 04:15 AM', completed: true },
        { status: 'Arrived at UK Hub', location: 'London Heathrow, UK', time: 'Jul 12, 08:30 AM', completed: true },
        { status: 'Customs Clearance', location: 'London Heathrow, UK', time: 'Jul 12, 10:15 AM', completed: true },
        { status: 'Sorting Facility', location: 'London Hub, UK', time: 'Jul 12, 02:00 PM', completed: false },
        { status: 'Out for Delivery', location: 'London Courier Dispatch', time: '--', completed: false },
        { status: 'Delivered', location: 'London, UK', time: '--', completed: false }
      ]
    },
    {
      id: 'SPX-5021-3910',
      courier: 'fedex',
      origin: 'Port Harcourt, Nigeria',
      destination: 'Toronto, Canada',
      weight: 5.0,
      packageType: 'Heavy Box',
      cost: 41200,
      status: 'customs',
      insurance: true,
      declaredValue: 450000,
      createdDate: '2026-07-08 09:00 AM',
      estimatedDelivery: '2026-07-13 06:00 PM',
      invoiceId: 'INV-2026-3910',
      senderName: 'Chloe Okafor',
      senderAddress: '4 Victory Street, off Police Post, Eliozu, Port Harcourt',
      recipientName: 'Sarah Jenkins',
      recipientAddress: '88 Yonge St, Toronto, ON M4Y 1W9, Canada',
      history: [
        { status: 'Package Received', location: 'Port Harcourt Hub, Nigeria', time: 'Jul 08, 09:00 AM', completed: true },
        { status: 'In Transit', location: 'Lagos Transit Hub, Nigeria', time: 'Jul 09, 11:30 AM', completed: true },
        { status: 'Arrived at destination airport', location: 'Toronto Pearson Airport, Canada', time: 'Jul 11, 01:20 PM', completed: true },
        { status: 'Customs Inspection', location: 'Toronto Border Agency, Canada', time: 'Jul 12, 09:00 AM', completed: true },
        { status: 'Delivered', location: 'Toronto, Canada', time: '--', completed: false }
      ]
    },
    {
      id: 'SPX-1942-8874',
      courier: 'ups',
      origin: 'Lagos, Nigeria',
      destination: 'New York, USA',
      weight: 12.0,
      packageType: 'Crate',
      cost: 72000,
      status: 'delivered',
      insurance: false,
      declaredValue: 120000,
      createdDate: '2026-07-02 02:40 PM',
      estimatedDelivery: '2026-07-06 04:00 PM',
      invoiceId: 'INV-2026-8874',
      senderName: 'Chloe Okafor',
      senderAddress: '4 Victory Street, off Police Post, Eliozu, Port Harcourt',
      recipientName: 'Michael Chang',
      recipientAddress: '450 Broadway, New York, NY 10013, USA',
      history: [
        { status: 'Package Received', location: 'Lagos Facility, Nigeria', time: 'Jul 02, 02:40 PM', completed: true },
        { status: 'Departed Facility', location: 'Lagos Airport, Nigeria', time: 'Jul 03, 03:00 AM', completed: true },
        { status: 'Customs Cleared', location: 'JFK Airport, New York, USA', time: 'Jul 04, 11:15 AM', completed: true },
        { status: 'Sorting Complete', location: 'NY Central Depot, USA', time: 'Jul 05, 08:45 AM', completed: true },
        { status: 'Out for Delivery', location: 'NY Manhattan Hub, USA', time: 'Jul 06, 09:00 AM', completed: true },
        { status: 'Delivered', location: 'New York, USA (Signed by M.Chang)', time: 'Jul 06, 02:18 PM', completed: true }
      ]
    }
  ])

  // 6. Mock Notifications
  const [notifications, setNotifications] = useState<GlobalNotification[]>([
    { id: 'n1', title: 'Payment Received', description: 'Payment for shipment SPX-8294-0921 was processed successfully.', time: '8 mins ago', read: false, type: 'success' },
    { id: 'n2', title: 'Customs Update', description: 'Shipment SPX-5021-3910 in Toronto, Canada has entered Customs check.', time: '15 mins ago', read: false, type: 'warning' },
    { id: 'n3', title: 'Pickup Confirmed', description: 'Courier pickup for parcel booked on Jul 14 has been dispatched.', time: '2 hours ago', read: true, type: 'info' },
  ])

  // 7. Mock Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'ST-9021',
      subject: 'Customs duty clarification for Toronto delivery',
      status: 'open',
      createdDate: 'Jul 11, 2026',
      messages: [
        { sender: 'user', text: 'Hi support, my shipment SPX-5021-3910 is in customs in Toronto. Do I need to pay additional duties?', time: 'Jul 11, 02:30 PM' },
        { sender: 'agent', text: 'Hello Chloe! Spatial Express covers primary brokerage fees. If Canada Customs levies individual VAT or import taxes based on the declared values, they will contact the recipient directly. We will update you as soon as it clears.', time: 'Jul 11, 02:45 PM' }
      ]
    }
  ])

  // --- Functions / Operations ---

  // Price Matrix Edit
  const updatePriceMatrixCell = (courierId: string, weight: number, newPrice: number) => {
    // Save current state to history stack for undo
    const currentMatrixCopy = JSON.parse(JSON.stringify(priceMatrix))
    setHistoryStack(prev => [...prev, currentMatrixCopy])
    setRedoStack([]) // Clear redo stack on new change

    setPriceMatrix(prev => ({
      ...prev,
      [courierId]: {
        ...prev[courierId],
        [weight]: newPrice
      }
    }))

    // Add pricing history item
    const newItem: PriceHistoryItem = {
      id: 'h_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: 'Admin User',
      courier: couriers.find(c => c.id === courierId)?.name || courierId,
      zone: 'Zone 1 (Europe)',
      changes: `Cell ${weight}kg set to ${newPrice.toLocaleString()} NGN`,
      originalMatrix: currentMatrixCopy
    }
    setPriceHistory(prev => [newItem, ...prev])
  }

  // Generate price tiers automatically
  const generatePrices = (basePrice: number, increment: number, roundingRule: number) => {
    const currentMatrixCopy = JSON.parse(JSON.stringify(priceMatrix))
    setHistoryStack(prev => [...prev, currentMatrixCopy])
    setRedoStack([])

    const updatedMatrix = { ...priceMatrix }
    
    // Apply changes to enabled couriers
    couriers.forEach(courier => {
      if (courier.enabled) {
        const rates: Record<number, number> = {}
        let currentPrice = basePrice * (courier.baseRate / 10) // scale by courier base rate
        
        weightTiers.forEach(weight => {
          // Calculate price base + weight increment
          let calculated = currentPrice + (weight * increment)
          
          // Apply rounding rule (e.g., nearest 10, 50, 100)
          if (roundingRule > 0) {
            calculated = Math.round(calculated / roundingRule) * roundingRule
          }
          rates[weight] = calculated
        })
        
        updatedMatrix[courier.id] = rates
      }
    })

    setPriceMatrix(updatedMatrix)

    const newItem: PriceHistoryItem = {
      id: 'h_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      admin: 'Admin User',
      courier: 'All Enabled',
      zone: 'Global Matrix',
      changes: `Matrix generated (Base: ${basePrice}, Incr: ${increment}, Round: ${roundingRule})`,
      originalMatrix: currentMatrixCopy
    }
    setPriceHistory(prev => [newItem, ...prev])
  }

  // Undo/Redo Price Edits
  const undoPriceEdit = () => {
    if (!canUndo) return
    const prev = historyStack[historyStack.length - 1]
    const rest = historyStack.slice(0, -1)
    
    setRedoStack(prevRedo => [...prevRedo, JSON.parse(JSON.stringify(priceMatrix))])
    setPriceMatrix(prev)
    setHistoryStack(rest)
  }

  const redoPriceEdit = () => {
    if (!canRedo) return
    const next = redoStack[redoStack.length - 1]
    const rest = redoStack.slice(0, -1)
    
    setHistoryStack(prevHistory => [...prevHistory, JSON.parse(JSON.stringify(priceMatrix))])
    setPriceMatrix(next)
    setRedoStack(rest)
  }

  // Toggle courier enable/disable status
  const togglePartner = (courierId: string) => {
    setCouriers(prev => prev.map(c => {
      if (c.id === courierId) {
        const nextEnabled = !c.enabled
        return {
          ...c,
          enabled: nextEnabled,
          health: nextEnabled ? 'optimal' : 'offline'
        }
      }
      return c
    }))
  }

  // Update courier priority
  const updatePartnerPriority = (courierId: string, priority: 'high' | 'medium' | 'low') => {
    setCouriers(prev => prev.map(c => 
      c.id === courierId ? { ...c, priority } : c
    ))
  }

  // Add Zone
  const addZone = (name: string, description: string) => {
    const newZone: Zone = {
      id: 'zone-' + (zones.length + 1),
      name,
      description,
      countries: []
    }
    setZones(prev => [...prev, newZone])
  }

  // Rename/edit Zone
  const renameZone = (zoneId: string, name: string, description: string) => {
    setZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, name, description } : z
    ))
  }

  // Delete Zone
  const deleteZone = (zoneId: string) => {
    setZones(prev => prev.filter(z => z.id !== zoneId))
  }

  // Assign country to zone and handle conflicts
  const assignCountryToZone = (country: Country, targetZoneId: string) => {
    // Check if country already exists in ANY zone
    let conflict = false
    let originalZoneName = ''
    let originalZoneId = ''

    zones.forEach(zone => {
      if (zone.id !== targetZoneId && zone.countries.some(c => c.code === country.code)) {
        conflict = true
        originalZoneName = zone.name
        originalZoneId = zone.id
      }
    })

    if (conflict) {
      // Return details so the UI can prompt the modal
      return { conflict, originalZoneName, originalZoneId }
    }

    // Direct move if no conflict
    setZones(prev => prev.map(zone => {
      if (zone.id === targetZoneId) {
        // Add if not already present
        if (!zone.countries.some(c => c.code === country.code)) {
          return { ...zone, countries: [...zone.countries, country] }
        }
      }
      return zone
    }))

    return { conflict: false }
  }

  // Resolve conflict: remove country from source zone and add to target
  const confirmCountryTransfer = (country: Country, sourceZoneId: string, targetZoneId: string) => {
    setZones(prev => prev.map(zone => {
      // Remove from source
      if (zone.id === sourceZoneId) {
        return { ...zone, countries: zone.countries.filter(c => c.code !== country.code) }
      }
      // Add to target
      if (zone.id === targetZoneId) {
        if (!zone.countries.some(c => c.code === country.code)) {
          return { ...zone, countries: [...zone.countries, country] }
        }
      }
      return zone
    }))
  }

  // Remove country
  const removeCountryFromZone = (countryCode: string, zoneId: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, countries: zone.countries.filter(c => c.code !== countryCode) } : zone
    ))
  }

  // Booking schedule pickup
  const bookPickupBooking = (bookingDetails: any) => {
    const courierObj = couriers.find(c => c.id === bookingDetails.courierPreference)
    const costValue = priceMatrix[bookingDetails.courierPreference]?.[1.5] || 15000

    const newShipment: Shipment = {
      id: 'SPX-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
      courier: bookingDetails.courierPreference,
      origin: bookingDetails.pickupAddress,
      destination: 'Pending destination',
      weight: 1.5,
      packageType: bookingDetails.packageDescription || 'Parcel',
      cost: costValue,
      status: 'pending',
      insurance: bookingDetails.insurance,
      declaredValue: 100000,
      createdDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: 'Calculating...',
      invoiceId: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
      senderName: 'Chloe Okafor',
      senderAddress: bookingDetails.pickupAddress,
      recipientName: 'Recipient Name',
      recipientAddress: 'Destination Address',
      history: [
        { status: 'Pickup Scheduled', location: bookingDetails.pickupAddress, time: 'Scheduled for ' + bookingDetails.preferredDate + ' @ ' + bookingDetails.preferredTime, completed: true },
        { status: 'Package Picked Up', location: 'In Transit to Hub', time: '--', completed: false }
      ]
    }

    setShipments(prev => [newShipment, ...prev])

    // Notify user
    const newNotif: GlobalNotification = {
      id: 'n_' + Date.now(),
      title: 'Pickup Booking Confirmed',
      description: `Your pickup for shipment has been scheduled for ${bookingDetails.preferredDate} with ${courierObj?.name}.`,
      time: 'Just now',
      read: false,
      type: 'success'
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  // Complete checkout process
  const processCheckoutPayment = (method: string): Shipment => {
    const courierId = selectedCourierResult?.id || 'dhl'
    const newId = 'SPX-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)
    
    // Create new shipment
    const newShipment: Shipment = {
      id: newId,
      courier: courierId,
      origin: 'Lagos, Nigeria', // hardcoded from calculator default
      destination: calculatorForm.destination + ', General Delivery',
      weight: calculatorForm.weight,
      packageType: calculatorForm.packageType,
      cost: selectedCourierResult?.price || 16500,
      status: 'processing',
      insurance: calculatorForm.insurance,
      declaredValue: calculatorForm.declaredValue,
      createdDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: '3-5 Days',
      invoiceId: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
      senderName: 'Chloe Okafor',
      senderAddress: '4 Victory Street, Port Harcourt, Nigeria',
      recipientName: 'John Doe',
      recipientAddress: calculatorForm.destination + ' Street Address',
      history: [
        { status: 'Payment Completed', location: 'Portal Checkout', time: 'Just now', completed: true },
        { status: 'Package Processed', location: 'Hub Depot', time: 'In Queue', completed: false },
        { status: 'In Transit', location: 'Carrier Route', time: '--', completed: false }
      ]
    }

    setShipments(prev => [newShipment, ...prev])

    // Notification
    const newNotif: GlobalNotification = {
      id: 'n_' + Date.now(),
      title: 'Payment Received',
      description: `Payment of ${newShipment.cost.toLocaleString()} NGN via ${method} for shipment ${newShipment.id} is confirmed.`,
      time: 'Just now',
      read: false,
      type: 'success'
    }
    setNotifications(prev => [newNotif, ...prev])

    // Auto set tracking ID
    setSelectedTrackingId(newId)
    
    return newShipment
  }

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Create new ticket
  const createSupportTicket = (subject: string, messageText: string) => {
    const newTicket: SupportTicket = {
      id: 'ST-' + Math.floor(1000 + Math.random() * 9000),
      subject,
      status: 'open',
      createdDate: 'Today',
      messages: [
        { sender: 'user', text: messageText, time: 'Just now' }
      ]
    }
    setSupportTickets(prev => [newTicket, ...prev])
  }

  // Add message inside support chat
  const addSupportChatMessage = (ticketId: string, text: string) => {
    setSupportTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const nextMessages = [
          ...ticket.messages,
          { sender: 'user', text, time: 'Just now' } as SupportMessage
        ]
        
        // Setup a simulated automated response from an agent
        setTimeout(() => {
          setSupportTickets(latestTickets => latestTickets.map(t => {
            if (t.id === ticketId) {
              return {
                ...t,
                messages: [
                  ...t.messages,
                  { 
                    sender: 'agent', 
                    text: 'Thank you for reaching out. We have logged this query. A logistics coordinator is checking the manifests and will get back to you shortly.', 
                    time: '1m ago' 
                  } as SupportMessage
                ]
              }
            }
            return t
          }))
        }, 1200)

        return {
          ...ticket,
          messages: nextMessages
        }
      }
      return ticket
    }))
  }

  // Load selected shipment details automatically when tracking id changes
  useEffect(() => {
    const matched = shipments.find(s => s.id === selectedTrackingId)
    if (matched) {
      setSelectedShipmentDetail(matched)
    }
  }, [selectedTrackingId, shipments])

  return (
    <LogisticsContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      
      activePortal,
      setActivePortal,
      activeView,
      setActiveView,
      currentUser,
      setCurrentUser,
      customCursorActive,
      setCustomCursorActive,
      
      shipments,
      couriers,
      zones,
      priceMatrix,
      priceHistory,
      notifications,
      supportTickets,
      
      calculatorForm,
      setCalculatorForm,
      calculatorResults,
      setCalculatorResults,
      selectedCourierResult,
      setSelectedCourierResult,
      checkoutStep,
      setCheckoutStep,
      
      updatePriceMatrixCell,
      generatePrices,
      undoPriceEdit,
      redoPriceEdit,
      canUndo,
      canRedo,
      togglePartner,
      updatePartnerPriority,
      addZone,
      renameZone,
      deleteZone,
      assignCountryToZone,
      confirmCountryTransfer,
      removeCountryFromZone,
      bookPickupBooking,
      processCheckoutPayment,
      markNotificationsRead,
      createSupportTicket,
      addSupportChatMessage,
      
      selectedTrackingId,
      setSelectedTrackingId,
      selectedShipmentDetail,
      setSelectedShipmentDetail
    }}>
      {children}
    </LogisticsContext.Provider>
  )
}

export function useLogistics() {
  const context = useContext(LogisticsContext)
  if (context === undefined) {
    throw new Error('useLogistics must be used within a LogisticsProvider')
  }
  return context
}

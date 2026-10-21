import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckIcon, 
  PackageIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CheckCircle2Icon,
  AlertTriangleIcon,
  ClockIcon,
  MapPinIcon,
  InfoIcon,
  ChevronDownIcon,
  RotateCcwIcon,
  BuildingIcon
} from './ui/CustomIcons'
import { cn } from '../lib/utils'
import { TrackingStep, Shipment } from '../context/LogisticsContext'

export interface ProgressStage {
  id: string
  label: string
  subLabel: string
  icon: React.ElementType
  matchStatus: (status: Shipment['status'], history?: TrackingStep[]) => boolean
}

export interface ShipmentProgressTrackerProps {
  status: Shipment['status']
  history?: TrackingStep[]
  trackingId?: string
  courier?: string
  origin?: string
  destination?: string
  estimatedDelivery?: string
  currentLocation?: string
  layout?: 'horizontal' | 'vertical' | 'responsive'
  compact?: boolean
  interactive?: boolean
  className?: string
  onStageClick?: (stageIndex: number, stage: ProgressStage) => void
}

const DEFAULT_STAGES: ProgressStage[] = [
  {
    id: 'booked',
    label: 'Booked',
    subLabel: 'Pickup scheduled & confirmed',
    icon: PackageIcon,
    matchStatus: (s) => ['pending', 'picked_up', 'processing', 'in_transit', 'customs', 'delivered'].includes(s),
  },
  {
    id: 'processing',
    label: 'Sort Facility',
    subLabel: 'Intake, weighing & dispatch',
    icon: BuildingIcon,
    matchStatus: (s) => ['processing', 'in_transit', 'customs', 'delivered'].includes(s),
  },
  {
    id: 'in_transit',
    label: 'In Transit',
    subLabel: 'Air linehaul & intermodal route',
    icon: TruckIcon,
    matchStatus: (s) => ['in_transit', 'customs', 'delivered'].includes(s),
  },
  {
    id: 'customs',
    label: 'Customs',
    subLabel: 'Border inspection & duties',
    icon: ShieldCheckIcon,
    matchStatus: (s) => ['customs', 'delivered'].includes(s),
  },
  {
    id: 'delivered',
    label: 'Delivered',
    subLabel: 'Recipient signature confirmed',
    icon: CheckCircle2Icon,
    matchStatus: (s) => s === 'delivered',
  },
]

export const ShipmentProgressTracker: React.FC<ShipmentProgressTrackerProps> = ({
  status,
  history = [],
  trackingId,
  courier,
  origin,
  destination,
  estimatedDelivery,
  currentLocation,
  layout = 'responsive',
  compact = false,
  interactive = true,
  className,
  onStageClick,
}) => {
  const isException = status === 'cancelled' || status === 'returned'

  // Determine the active stage index (0 to 4)
  const activeStageIndex = useMemo(() => {
    if (status === 'delivered') return 4
    if (status === 'customs') return 3
    if (status === 'in_transit') return 2
    if (status === 'processing') return 1
    if (status === 'picked_up') return 1
    return 0 // 'pending'
  }, [status])

  // Selected stage for inspection (defaults to active stage)
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(activeStageIndex)
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = () => {
    if (!trackingId) return
    navigator.clipboard.writeText(trackingId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Correlate history checkpoints with each stage
  const stageCheckpoints = useMemo(() => {
    return DEFAULT_STAGES.map((stage, idx) => {
      // Find matching steps in history
      const matched = history.filter((step) => {
        const text = (step.status + ' ' + step.location).toLowerCase()
        if (stage.id === 'booked') {
          return text.includes('received') || text.includes('pickup') || text.includes('payment') || text.includes('booked')
        }
        if (stage.id === 'processing') {
          return text.includes('departed') || text.includes('sorting') || text.includes('processed') || text.includes('facility')
        }
        if (stage.id === 'in_transit') {
          return text.includes('transit') || text.includes('airport') || text.includes('flight') || text.includes('linehaul')
        }
        if (stage.id === 'customs') {
          return text.includes('customs') || text.includes('inspection') || text.includes('border') || text.includes('clearance')
        }
        if (stage.id === 'delivered') {
          return text.includes('delivered') || text.includes('out for delivery') || text.includes('dispatch')
        }
        return false
      })

      // Fallback timestamp if no explicit match
      const lastCompleted = matched.filter(m => m.completed).pop()
      return {
        stage,
        events: matched,
        timestamp: lastCompleted ? lastCompleted.time : undefined,
        location: lastCompleted ? lastCompleted.location : undefined,
      }
    })
  }, [history])

  const selectedStageData = stageCheckpoints[selectedStageIdx]

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200 rounded-2xl shadow-xs transition-all overflow-hidden text-left",
        compact ? "p-4" : "p-6 md:p-8",
        className
      )}
    >
      {/* Top Meta Bar (Tracking ID, Courier, ETA) */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <TruckIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tracking Number</span>
                {courier && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {courier}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {trackingId || 'SPX-LIVE-TRANSIT'}
                </span>
                {trackingId && (
                  <button
                    onClick={handleCopyId}
                    title="Copy Tracking ID"
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    {copiedId ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Route & Status Pill */}
          <div className="flex items-center gap-4 text-right">
            {(origin || destination) && (
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Corridor</span>
                <span className="text-xs font-bold text-slate-800">
                  {origin ? origin.split(',')[0] : 'Origin'} → {destination ? destination.split(',')[0] : 'Destination'}
                </span>
              </div>
            )}

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Delivery</span>
              <span className="text-xs md:text-sm font-bold text-slate-900 flex items-center gap-1.5 justify-end tabular-nums">
                <ClockIcon className="w-3.5 h-3.5 text-emerald-600" />
                {estimatedDelivery || 'In Transit'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Exception Banner if cancelled or returned */}
      {isException && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              Shipment {status.toUpperCase()}
            </span>
            <p className="text-amber-700 text-[11px]">
              This manifest has encountered an operational hold ({status}). Contact Spatial Express support for resolution.
            </p>
          </div>
        </div>
      )}

      {/* STEP INDICATOR PIPELINE */}
      <div className="relative py-2">
        {/* Desktop / Horizontal Pipeline View */}
        <div
          className={cn(
            layout === 'vertical' ? 'hidden' : layout === 'horizontal' ? 'block' : 'hidden md:block'
          )}
        >
          <div className="relative flex items-center justify-between">
            {/* Background Base Rail Line */}
            <div className="absolute left-6 right-6 top-6 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />

            {/* Active Animated Fill Line */}
            <motion.div
              className="absolute left-6 top-6 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 origin-left"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (activeStageIndex / (DEFAULT_STAGES.length - 1)) * 100)}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Animated Flowing Light Pulse on Active Line */}
            {activeStageIndex > 0 && activeStageIndex < DEFAULT_STAGES.length - 1 && (
              <motion.div
                className="absolute top-6 -translate-y-1/2 w-8 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent z-1 rounded-full filter drop-shadow(0 0 3px #16a34a)"
                animate={{
                  left: [
                    '1.5rem',
                    `${(activeStageIndex / (DEFAULT_STAGES.length - 1)) * 96}%`,
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* Stages Step Nodes */}
            {DEFAULT_STAGES.map((stage, idx) => {
              const Icon = stage.icon
              const isCompleted = idx < activeStageIndex || status === 'delivered'
              const isActive = idx === activeStageIndex && status !== 'delivered'
              const isPending = idx > activeStageIndex
              const isSelected = selectedStageIdx === idx

              return (
                <div
                  key={stage.id}
                  className="relative z-10 flex flex-col items-center flex-1 cursor-pointer group"
                  onClick={() => {
                    if (interactive) {
                      setSelectedStageIdx(idx)
                      onStageClick?.(idx, stage)
                    }
                  }}
                >
                  {/* Node Circle */}
                  <div className="relative flex items-center justify-center">
                    {/* Active Radar Ripple Animation */}
                    {isActive && (
                      <>
                        <motion.span
                          className="absolute w-12 h-12 rounded-full bg-emerald-500/20"
                          animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        />
                        <motion.span
                          className="absolute w-14 h-14 rounded-full bg-emerald-500/10"
                          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                          transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                        />
                      </>
                    )}

                    {/* Step Icon Badge */}
                    <motion.div
                      whileHover={interactive ? { scale: 1.1 } : undefined}
                      whileTap={interactive ? { scale: 0.95 } : undefined}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 select-none",
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                          : isActive
                          ? "bg-white border-emerald-600 text-emerald-600 shadow-md ring-4 ring-emerald-50"
                          : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-300",
                        isSelected && "ring-2 ring-emerald-500 ring-offset-2"
                      )}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-5 h-5 text-white stroke-[2.5]" />
                      ) : (
                        <Icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                      )}
                    </motion.div>
                  </div>

                  {/* Stage Label & Details */}
                  <div className="text-center mt-3 max-w-[120px]">
                    <div className="flex items-center justify-center gap-1">
                      <p
                        className={cn(
                          "text-xs font-bold leading-tight transition-colors",
                          isActive
                            ? "text-emerald-700 font-extrabold"
                            : isCompleted
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-600"
                        )}
                      >
                        {stage.label}
                      </p>
                      {isActive && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    {!compact && (
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-snug">
                        {stageCheckpoints[idx]?.timestamp || stage.subLabel}
                      </p>
                    )}

                    {isActive && (
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile / Vertical Stepped Pipeline View */}
        <div
          className={cn(
            layout === 'horizontal' ? 'hidden' : layout === 'vertical' ? 'block' : 'block md:hidden'
          )}
        >
          <div className="relative pl-8 space-y-6">
            {/* Vertical Base Rail Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 -translate-x-1/2 z-0" />

            {/* Vertical Animated Progress Line */}
            <motion.div
              className="absolute left-[19px] top-4 w-0.5 bg-emerald-500 -translate-x-1/2 z-0 origin-top"
              initial={{ height: 0 }}
              animate={{
                height: `${Math.min(100, (activeStageIndex / (DEFAULT_STAGES.length - 1)) * 100)}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {DEFAULT_STAGES.map((stage, idx) => {
              const Icon = stage.icon
              const isCompleted = idx < activeStageIndex || status === 'delivered'
              const isActive = idx === activeStageIndex && status !== 'delivered'
              const isPending = idx > activeStageIndex
              const isSelected = selectedStageIdx === idx

              return (
                <div
                  key={stage.id}
                  className="relative z-10 flex items-start gap-4 cursor-pointer group"
                  onClick={() => {
                    if (interactive) {
                      setSelectedStageIdx(idx)
                      onStageClick?.(idx, stage)
                    }
                  }}
                >
                  {/* Node Circle */}
                  <div className="relative -ml-8 flex items-center justify-center shrink-0">
                    {isActive && (
                      <motion.span
                        className="absolute w-10 h-10 rounded-full bg-emerald-500/20"
                        animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all select-none",
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          : isActive
                          ? "bg-white border-emerald-600 text-emerald-600 shadow-sm ring-2 ring-emerald-100"
                          : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-300",
                        isSelected && "ring-2 ring-emerald-500"
                      )}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-4 h-4 text-white stroke-[2.5]" />
                      ) : (
                        <Icon className={cn("w-4 h-4", isActive ? "text-emerald-600" : "text-slate-400")} />
                      )}
                    </div>
                  </div>

                  {/* Stage Text */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isActive
                              ? "text-emerald-700 font-extrabold"
                              : isCompleted
                              ? "text-slate-900"
                              : "text-slate-400"
                          )}
                        >
                          {stage.label}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      {stageCheckpoints[idx]?.timestamp && (
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {stageCheckpoints[idx].timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stage.subLabel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Interactive Micro-Detail Drawer (Shows events/status of selected stage) */}
      {interactive && !compact && selectedStageData && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStageIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/70 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-5 md:px-8 rounded-b-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Stage Details:
                </span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {selectedStageData.stage.label}
                  {selectedStageIdx === activeStageIndex && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {selectedStageData.stage.subLabel}
              </span>
            </div>

            {/* Checkpoint events matching this stage */}
            {selectedStageData.events.length > 0 ? (
              <div className="space-y-2">
                {selectedStageData.events.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          evt.completed ? "bg-emerald-500" : "bg-slate-300"
                        )}
                      />
                      <span className="font-semibold text-slate-900">{evt.status}</span>
                      <span className="text-slate-500 text-[11px]">• {evt.location}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {evt.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 py-1 flex items-center justify-between">
                <span>
                  {selectedStageIdx < activeStageIndex
                    ? 'Stage completed and logged into carrier manifest registry.'
                    : selectedStageIdx === activeStageIndex
                    ? 'Currently processing in this operational phase.'
                    : 'Awaiting completion of upstream transit checkpoints.'}
                </span>
                {currentLocation && selectedStageIdx === activeStageIndex && (
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                    {currentLocation}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
export default ShipmentProgressTracker

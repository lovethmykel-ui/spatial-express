import { cn } from '../lib/utils'

interface GaugeProps {
  score: number // 0-100
  statusLabel: string
  size?: number
}

export default function Gauge({ score, statusLabel, size = 140 }: GaugeProps) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clamped / 100)

  const tone = clamped >= 75 ? 'success' : clamped >= 45 ? 'warning' : 'danger'

  const stroke = {
    success: '#00E676',
    warning: '#FFC107',
    danger: '#FF4D6D',
  }[tone]

  const textColor = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }[tone]

  return (
    <div className="inline-flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold leading-none text-white">{Math.round(clamped)}</span>
          <span className="text-[10px] text-muted mt-1">/100</span>
        </div>
      </div>
      <span className={cn('mt-2 text-sm font-medium tracking-wide font-display uppercase', textColor)}>
        {statusLabel}
      </span>
    </div>
  )
}

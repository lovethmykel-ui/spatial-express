import { Badge } from './ui/Badge'
import type { CheckStatus } from '../lib/audit'

const styles: Record<CheckStatus, { variant: 'success' | 'warning' | 'danger' | 'outline'; label: string }> = {
  good: { variant: 'success', label: 'Good' },
  warning: { variant: 'warning', label: 'Caution' },
  danger: { variant: 'danger', label: 'Risk' },
  unknown: { variant: 'outline', label: 'N/A' },
}

export default function StatusPill({ status }: { status: CheckStatus }) {
  const s = styles[status]
  return <Badge variant={s.variant}>{s.label}</Badge>
}

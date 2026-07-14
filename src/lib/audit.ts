export type CheckStatus = 'good' | 'warning' | 'danger' | 'unknown'

export interface AuditCheck {
  label: string
  status: CheckStatus
  detail: string
}

export interface AuditResult {
  score: number // 0-100, higher = safer
  statusLabel: string
  checks: AuditCheck[]
}

interface AuditInputs {
  liquidityUsd: number | undefined
  pairAgeDays: number
  mintAuthority?: string | null
  freezeAuthority?: string | null
  topHolderPct?: number
  isSolana: boolean
}

export function computeAudit(inputs: AuditInputs): AuditResult {
  const checks: AuditCheck[] = []
  let score = 100

  // Liquidity
  const liq = inputs.liquidityUsd ?? 0
  if (liq < 5_000) {
    checks.push({ label: 'Liquidity', status: 'danger', detail: `$${liq.toLocaleString()} — very thin` })
    score -= 25
  } else if (liq < 25_000) {
    checks.push({ label: 'Liquidity', status: 'warning', detail: `$${liq.toLocaleString()} — low` })
    score -= 12
  } else {
    checks.push({ label: 'Liquidity', status: 'good', detail: `$${liq.toLocaleString()}` })
  }

  // Pair age
  if (inputs.pairAgeDays < 1) {
    checks.push({ label: 'Pair age', status: 'danger', detail: 'Less than 1 day old' })
    score -= 20
  } else if (inputs.pairAgeDays < 7) {
    checks.push({ label: 'Pair age', status: 'warning', detail: `${Math.round(inputs.pairAgeDays)} days old` })
    score -= 8
  } else {
    checks.push({ label: 'Pair age', status: 'good', detail: `${Math.round(inputs.pairAgeDays)} days old` })
  }

  // Mint authority — only checkable on Solana via RPC
  if (inputs.isSolana) {
    if (inputs.mintAuthority === undefined) {
      checks.push({ label: 'Mint authority', status: 'unknown', detail: 'Could not be read' })
    } else if (inputs.mintAuthority === null) {
      checks.push({ label: 'Mint authority', status: 'good', detail: 'Renounced — supply is fixed' })
    } else {
      checks.push({ label: 'Mint authority', status: 'danger', detail: 'Active — supply can still be inflated' })
      score -= 25
    }

    // Freeze authority
    if (inputs.freezeAuthority === undefined) {
      checks.push({ label: 'Freeze authority', status: 'unknown', detail: 'Could not be read' })
    } else if (inputs.freezeAuthority === null) {
      checks.push({ label: 'Freeze authority', status: 'good', detail: 'Renounced — wallets cannot be frozen' })
    } else {
      checks.push({ label: 'Freeze authority', status: 'warning', detail: 'Active — holder wallets could be frozen' })
      score -= 15
    }

    // Holder concentration
    if (inputs.topHolderPct === undefined) {
      checks.push({ label: 'Holder concentration', status: 'unknown', detail: 'Could not be read' })
    } else if (inputs.topHolderPct > 30) {
      checks.push({
        label: 'Holder concentration',
        status: 'danger',
        detail: `Top wallet holds ${inputs.topHolderPct.toFixed(1)}% of supply`,
      })
      score -= 20
    } else if (inputs.topHolderPct > 10) {
      checks.push({
        label: 'Holder concentration',
        status: 'warning',
        detail: `Top wallet holds ${inputs.topHolderPct.toFixed(1)}% of supply`,
      })
      score -= 8
    } else {
      checks.push({
        label: 'Holder concentration',
        status: 'good',
        detail: `Top wallet holds ${inputs.topHolderPct.toFixed(1)}% of supply`,
      })
    }
  } else {
    checks.push({ label: 'Mint / freeze authority', status: 'unknown', detail: 'Only checkable on Solana right now' })
    checks.push({ label: 'Holder concentration', status: 'unknown', detail: 'Only checkable on Solana right now' })
  }

  score = Math.max(0, Math.min(100, score))
  const statusLabel = score >= 75 ? 'Good' : score >= 45 ? 'Caution' : 'High risk'

  return { score, statusLabel, checks }
}

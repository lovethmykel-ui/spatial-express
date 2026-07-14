// Direct Solana RPC calls — no API key required.
// Used to check the two things DexScreener's data can't tell you:
// whether the contract can still mint new supply or freeze holder wallets,
// and how concentrated ownership is among the largest holders.

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`Solana RPC error: ${method}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? 'RPC error')
  return json.result
}

export interface MintAuthorityInfo {
  mintAuthority: string | null // null = renounced, can't mint more supply
  freezeAuthority: string | null // null = renounced, can't freeze holder wallets
  supply: string
  decimals: number
}

export async function fetchMintAuthority(mintAddress: string): Promise<MintAuthorityInfo | null> {
  const result = await rpcCall('getAccountInfo', [
    mintAddress,
    { encoding: 'jsonParsed' },
  ])
  const parsed = result?.value?.data?.parsed?.info
  if (!parsed) return null
  return {
    mintAuthority: parsed.mintAuthority ?? null,
    freezeAuthority: parsed.freezeAuthority ?? null,
    supply: parsed.supply,
    decimals: parsed.decimals,
  }
}

export interface HolderConcentration {
  topHolderPct: number
  top10Pct: number
}

export async function fetchHolderConcentration(
  mintAddress: string,
  totalSupply: string
): Promise<HolderConcentration | null> {
  const result = await rpcCall('getTokenLargestAccounts', [mintAddress])
  const accounts: { amount: string }[] = result?.value ?? []
  if (accounts.length === 0) return null

  const total = Number(totalSupply)
  if (!total) return null

  const amounts = accounts.map((a) => Number(a.amount))
  const topHolderPct = (amounts[0] / total) * 100
  const top10Pct = (amounts.slice(0, 10).reduce((s, n) => s + n, 0) / total) * 100

  return { topHolderPct, top10Pct }
}

// All endpoints here are public, free, and require no API key.
// Gas: direct JSON-RPC calls to each chain's official/public node.
// Prices: CoinGecko simple price endpoint.
// Yield: DefiLlama's public yields pool list, filtered to known staking pools.

const RPC = {
  ethereum: 'https://cloudflare-eth.com',
  base: 'https://mainnet.base.org',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  bsc: 'https://bsc-dataseed.binance.org',
  solana: 'https://api.mainnet-beta.solana.com',
} as const

const TRANSFER_GAS_LIMIT = 21000 // simple native transfer — contract calls cost more

async function rpcCall(url: string, method: string, params: unknown[] = []) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`RPC error: ${method}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? 'RPC error')
  return json.result
}

export interface NativePrices {
  ethereum: number
  binancecoin: number
  solana: number
}

export async function fetchNativePrices(): Promise<NativePrices> {
  // Try CoinGecko first (best free source)
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,solana&vs_currencies=usd'
    )
    if (res.ok) {
      const json = await res.json()
      if (json.ethereum?.usd) {
        return {
          ethereum: json.ethereum.usd,
          binancecoin: json.binancecoin?.usd ?? 0,
          solana: json.solana?.usd ?? 0,
        }
      }
    }
  } catch {
    // CoinGecko failed, try DexScreener
  }

  // Fallback: Use DexScreener search to get prices from live DEX trading data
  try {
    const [ethRes, bnbRes, solRes] = await Promise.all([
      fetch('https://api.dexscreener.com/latest/dex/search?q=WETH%20USDC').then(r => r.json()),
      fetch('https://api.dexscreener.com/latest/dex/search?q=WBNB%20USDT').then(r => r.json()),
      fetch('https://api.dexscreener.com/latest/dex/search?q=SOL%20USDC').then(r => r.json()),
    ])

    const getPrice = (data: any, chain: string) => {
      const pair = (data?.pairs ?? []).find(
        (p: any) => p.chainId === chain && p.priceUsd && (p.volume?.h24 ?? 0) > 100000
      )
      return pair ? Number(pair.priceUsd) * (pair.priceChange ? 1 : 1) : 0
    }

    // For wrapped native tokens, the quote token price IS the native price
    const ethPair = (ethRes?.pairs ?? []).find((p: any) => p.chainId === 'ethereum' && p.baseToken?.symbol === 'WETH' && (p.volume?.h24 ?? 0) > 100000)
    const bnbPair = (bnbRes?.pairs ?? []).find((p: any) => p.chainId === 'bsc' && p.baseToken?.symbol === 'WBNB' && (p.volume?.h24 ?? 0) > 100000)
    const solPair = (solRes?.pairs ?? []).find((p: any) => p.chainId === 'solana' && (p.baseToken?.symbol === 'SOL' || p.baseToken?.symbol === 'WSOL') && (p.volume?.h24 ?? 0) > 100000)

    const prices: NativePrices = {
      ethereum: ethPair ? Number(ethPair.priceUsd) : 0,
      binancecoin: bnbPair ? Number(bnbPair.priceUsd) : 0,
      solana: solPair ? Number(solPair.priceUsd) : 0,
    }

    // Validate we got at least one real price
    if (prices.ethereum > 0 || prices.solana > 0) {
      return prices
    }
  } catch {
    // Both sources failed
  }

  throw new Error('Could not fetch native token prices from any source.')
}

export interface GasEstimate {
  chain: string
  nativeFee: number // in native token
  usdFee: number
}

export async function fetchEvmGasUsd(
  rpcUrl: string,
  label: string,
  nativeUsdPrice: number
): Promise<GasEstimate> {
  const hexGasPrice: string = await rpcCall(rpcUrl, 'eth_gasPrice')
  const gasPriceWei = parseInt(hexGasPrice, 16)
  const feeWei = gasPriceWei * TRANSFER_GAS_LIMIT
  const feeNative = feeWei / 1e18
  return {
    chain: label,
    nativeFee: feeNative,
    usdFee: feeNative * nativeUsdPrice,
  }
}

export async function fetchSolanaFeeUsd(solUsdPrice: number): Promise<GasEstimate> {
  const BASE_FEE_LAMPORTS = 5000 // one signature, fixed protocol fee
  const TYPICAL_COMPUTE_UNITS = 200_000

  let priorityFeeLamports = 0
  try {
    const recent: { prioritizationFee: number }[] = await rpcCall(
      RPC.solana,
      'getRecentPrioritizationFees'
    )
    if (recent?.length) {
      const avgMicroLamportsPerCU =
        recent.reduce((sum, r) => sum + r.prioritizationFee, 0) / recent.length
      priorityFeeLamports = (avgMicroLamportsPerCU * TYPICAL_COMPUTE_UNITS) / 1e6
    }
  } catch {
    // fall back to base fee only if prioritization fee lookup fails
  }

  const totalLamports = BASE_FEE_LAMPORTS + priorityFeeLamports
  const feeNative = totalLamports / 1e9
  return {
    chain: 'Solana',
    nativeFee: feeNative,
    usdFee: feeNative * solUsdPrice,
  }
}

export async function fetchAllGasEstimates(): Promise<GasEstimate[]> {
  const prices = await fetchNativePrices()

  // Use Promise.allSettled so one RPC failure doesn't crash everything
  const promises = [
    fetchEvmGasUsd(RPC.ethereum, 'Ethereum', prices.ethereum),
    fetchEvmGasUsd(RPC.base, 'Base', prices.ethereum),
    fetchEvmGasUsd(RPC.arbitrum, 'Arbitrum', prices.ethereum),
    fetchEvmGasUsd(RPC.bsc, 'BNB Chain', prices.binancecoin),
    fetchSolanaFeeUsd(prices.solana)
  ]

  const results = await Promise.allSettled(promises)
  
  // Return only successful results
  return results
    .filter((r): r is PromiseFulfilledResult<GasEstimate> => r.status === 'fulfilled')
    .map(r => r.value)
}

export interface YieldPool {
  chain: string
  project: string
  symbol: string
  apy: number
}

// DefiLlama's yields endpoint lists thousands of pools. We filter down to a
// small set of well-known liquid staking pools per chain rather than trying
// to rank "best yield", since unfiltered top-APY pools are usually high-risk
// farms, not something to surface as a default comparison.
const TARGET_POOLS: { chain: string; project: string; label: string }[] = [
  { chain: 'Ethereum', project: 'lido', label: 'Ethereum (Lido stETH)' },
  { chain: 'Solana', project: 'marinade-finance', label: 'Solana (Marinade mSOL)' },
  { chain: 'Solana', project: 'jito', label: 'Solana (Jito jitoSOL)' },
  { chain: 'Binance', project: 'lista-dao', label: 'BNB Chain (Lista slisBNB)' },
]

export async function fetchStakingYields(): Promise<YieldPool[]> {
  const res = await fetch('https://yields.llama.fi/pools')
  if (!res.ok) throw new Error('Yield fetch failed')
  const json = await res.json()
  const pools: any[] = json.data ?? []

  const matched: YieldPool[] = []
  for (const target of TARGET_POOLS) {
    const pool = pools.find(
      (p) => p.chain === target.chain && p.project === target.project
    )
    if (pool) {
      matched.push({
        chain: target.label,
        project: target.project,
        symbol: pool.symbol,
        apy: pool.apy ?? 0,
      })
    }
  }
  return matched
}

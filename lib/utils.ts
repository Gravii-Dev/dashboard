export interface PillItem {
  key: string;
  label: string;
}

export const CHAIN_KEYS = ['eth', 'base', 'arb', 'bsc', 'poly', 'avax', 'hl', 'kaia', 'sol'] as const;
export type ChainKey = (typeof CHAIN_KEYS)[number];

export const CHAIN_COLORS: Record<string, string> = {
  eth: '#627eea',
  base: '#0052ff',
  arb: '#28a0f0',
  bsc: '#f0b90b',
  poly: '#8247e5',
  avax: '#e84142',
  hl: '#00d1b2',
  kaia: '#3fbb7a',
  sol: '#9945ff',
};

export const CHAIN_PILL_DATA: PillItem[] = [
  { key: 'all', label: 'All' },
  { key: 'eth', label: 'ETH' },
  { key: 'base', label: 'Base' },
  { key: 'arb', label: 'Arbitrum' },
  { key: 'bsc', label: 'BSC' },
  { key: 'poly', label: 'Polygon' },
  { key: 'avax', label: 'Avalanche' },
  { key: 'hl', label: 'Hyperliquid' },
  { key: 'kaia', label: 'Kaia' },
  { key: 'sol', label: 'Solana' },
];

export const ASSET_PILL_DATA: PillItem[] = [
  { key: 'all', label: 'All' },
  { key: 'stables', label: 'Stables' },
  { key: 'native', label: 'Native' },
  { key: 'others', label: 'Others' },
];

export function toggleSetValue(set: Set<string>, val: string): Set<string> {
  const next = new Set(set);
  if (val === 'all') {
    next.clear();
  } else {
    if (next.has(val)) next.delete(val);
    else next.add(val);
  }
  return next;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

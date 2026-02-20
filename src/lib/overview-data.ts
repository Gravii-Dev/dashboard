import type { BarSectionData } from "@/components/dashboard/BarSection";

const META = "188 users · 38%";

export const VALUE_BY_CHAIN_TVL: BarSectionData[] = [
  {
    chain: "Ethereum",
    chainVariant: "ethereum",
    meta: META,
    segments: [
      { widthPct: 55, color: "var(--chart-1)", label: "Stables" },
      { widthPct: 30, color: "var(--chart-2)", label: "Native" },
      { widthPct: 15, color: "var(--chart-6)", label: "Other" },
    ],
  },
  {
    chain: "BSC",
    chainVariant: "bsc",
    meta: META,
    segments: [
      { widthPct: 50, color: "var(--chart-1)", label: "Stables" },
      { widthPct: 35, color: "var(--chart-2)", label: "Native" },
      { widthPct: 15, color: "var(--chart-6)", label: "Other" },
    ],
  },
  {
    chain: "Base",
    chainVariant: "base",
    meta: META,
    segments: [
      { widthPct: 45, color: "var(--chart-1)", label: "Stables" },
      { widthPct: 35, color: "var(--chart-2)", label: "Native" },
      { widthPct: 20, color: "var(--chart-6)", label: "Other" },
    ],
  },
];

export const VALUE_BY_CHAIN_TIV: BarSectionData[] = [
  {
    chain: "Ethereum",
    chainVariant: "ethereum",
    meta: META,
    segments: [
      { widthPct: 50, color: "var(--chart-3)", label: "Stables" },
      { widthPct: 30, color: "var(--chart-5)", label: "Native" },
      { widthPct: 20, color: "var(--chart-6)", label: "Other" },
    ],
  },
  {
    chain: "BSC",
    chainVariant: "bsc",
    meta: META,
    segments: [
      { widthPct: 48, color: "var(--chart-3)", label: "Stables" },
      { widthPct: 32, color: "var(--chart-5)", label: "Native" },
      { widthPct: 20, color: "var(--chart-6)", label: "Other" },
    ],
  },
  {
    chain: "Base",
    chainVariant: "base",
    meta: META,
    segments: [
      { widthPct: 42, color: "var(--chart-3)", label: "Stables" },
      { widthPct: 38, color: "var(--chart-5)", label: "Native" },
      { widthPct: 20, color: "var(--chart-6)", label: "Other" },
    ],
  },
];

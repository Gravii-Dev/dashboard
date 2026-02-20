import Link from "next/link";
import { DonutCard } from "@/components/dashboard/DonutCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard, KpiTagsCard } from "@/components/dashboard/KpiCard";
import { ValueByChainCard } from "@/components/dashboard/BarSection";
import { VALUE_BY_CHAIN_TVL, VALUE_BY_CHAIN_TIV } from "@/lib/overview-data";

const TIV_TOOLTIP = {
  title: "Total Idle Value",
  body: "Assets sitting in wallet without active deployment. Not staked, lent, or providing liquidity.",
};

export default function DashboardOverviewPage() {
  return (
    <>
      <PageHeader
        title="Gravii Dashboard"
        ctaLabel="Create your campaigns"
        ctaHref="/dashboard/campaigns"
      />

      <div className="grid-4">
        <DonutCard
          title="TVL (Stables)"
          centerLabel="Total"
          centerValue="1,124$"
          segments={[
            { color: "var(--chart-1)", dashArray: "150.8 301.6", dashOffset: "0.0" },
            { color: "var(--chart-2)", dashArray: "90.5 301.6", dashOffset: "-150.8" },
            { color: "var(--chart-3)", dashArray: "42.2 301.6", dashOffset: "-241.3" },
            { color: "var(--chart-4)", dashArray: "18.1 301.6", dashOffset: "-283.5" },
          ]}
          legend={[
            { color: "var(--chart-1)", label: "USDC", value: "50%" },
            { color: "var(--chart-2)", label: "USDT", value: "30%" },
            { color: "var(--chart-3)", label: "DAI", value: "14%" },
            { color: "var(--chart-4)", label: "Others", value: "6%" },
          ]}
        />
        <DonutCard
          title="TVL (Tokens)"
          centerLabel="Total"
          centerValue="1,124$"
          segments={[
            { color: "var(--chart-5)", dashArray: "120.7 301.6", dashOffset: "0.0" },
            { color: "var(--chart-6)", dashArray: "90.5 301.6", dashOffset: "-120.7" },
            { color: "var(--chart-1)", dashArray: "60.3 301.6", dashOffset: "-211.1" },
            { color: "var(--chart-3)", dashArray: "30.2 301.6", dashOffset: "-271.4" },
          ]}
          legend={[
            { color: "var(--chart-5)", label: "ETH", value: "40%" },
            { color: "var(--chart-6)", label: "BNB", value: "30%" },
            { color: "var(--chart-1)", label: "LINK", value: "20%" },
            { color: "var(--chart-3)", label: "Others", value: "10%" },
          ]}
        />
        <DonutCard
          title="TIV (Stables)"
          centerLabel="Total"
          centerValue="1,124$"
          tooltip={TIV_TOOLTIP}
          segments={[
            { color: "var(--chart-2)", dashArray: "135.7 301.6", dashOffset: "0.0" },
            { color: "var(--chart-4)", dashArray: "90.5 301.6", dashOffset: "-135.7" },
            { color: "var(--chart-1)", dashArray: "48.0 301.6", dashOffset: "-226.2" },
            { color: "var(--chart-6)", dashArray: "27.4 301.6", dashOffset: "-274.2" },
          ]}
          legend={[
            { color: "var(--chart-2)", label: "USDC", value: "45%" },
            { color: "var(--chart-4)", label: "USDT", value: "30%" },
            { color: "var(--chart-1)", label: "DAI", value: "16%" },
            { color: "var(--chart-6)", label: "Others", value: "9%" },
          ]}
        />
        <DonutCard
          title="TIV (Tokens)"
          centerLabel="Total"
          centerValue="1,124$"
          tooltip={TIV_TOOLTIP}
          segments={[
            { color: "var(--chart-3)", dashArray: "120.7 301.6", dashOffset: "0.0" },
            { color: "var(--chart-5)", dashArray: "75.4 301.6", dashOffset: "-120.7" },
            { color: "var(--chart-2)", dashArray: "60.3 301.6", dashOffset: "-196.1" },
            { color: "var(--chart-4)", dashArray: "45.2 301.6", dashOffset: "-256.4" },
          ]}
          legend={[
            { color: "var(--chart-3)", label: "ETH", value: "40%" },
            { color: "var(--chart-5)", label: "BNB", value: "25%" },
            { color: "var(--chart-2)", label: "MATIC", value: "20%" },
            { color: "var(--chart-4)", label: "Others", value: "15%" },
          ]}
        />
      </div>

      <div className="grid-2-half">
        <ValueByChainCard
          title="Value by chain (TVL) – Top 3 chains"
          sections={VALUE_BY_CHAIN_TVL}
        />
        <ValueByChainCard
          title="Value by chain (TIV) – Top 3 chains"
          sections={VALUE_BY_CHAIN_TIV}
        />
      </div>

      <div className="grid-4">
        <KpiCard title="Avg. Monthly Trading Volume (Per wallet)" value="$12,010" />
        <KpiCard title="Avg. Monthly Tx Count" value="72" />
        <KpiCard title="Avg. Monthly Payment Amount" value="$2,327" />
        <KpiCard title="Avg. Monthly Payment Count" value="32" />
      </div>

      <div className="grid-4">
        <KpiCard title="Active wallets (7d)" value="301,012" />
        <KpiCard title="Active traders (7d)" value="12,010" />
        <KpiCard title="Active Protocol Users" value="8,001" />
        <KpiCard title="Cross-chain Users" value="1,777" />
      </div>

      <div className="grid-4">
        <KpiTagsCard
          title="Top 3 Interacted Protocols"
          tags={["Pendle Finance", "Pendle Finance", "Curve"]}
        />
        <KpiTagsCard
          title="Top 3 Funding Sources"
          tags={["Binance", "OKX", "Bybit"]}
        />
        <KpiCard title="Net NFT Worth (Total)" value="$12,772,030" />
        <KpiCard title="Sybil rate" value="37%" />
      </div>
    </>
  );
}

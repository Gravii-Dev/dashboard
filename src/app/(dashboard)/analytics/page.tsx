"use client";

import { useState } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { Card, CardTitle } from "@/components/dashboard/Card";
import { DonutCard } from "@/components/dashboard/DonutCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  ANALYTICS_CHAINS,
  GROUP_DATA,
  GROUP_LABELS,
  type AnalyticsGroupKey,
} from "@/lib/analytics-data";
import styles from "./AnalyticsPage.module.css";

export default function AnalyticsPage() {
  const [chain, setChain] = useState("All");
  const [group, setGroup] = useState<AnalyticsGroupKey>("top5");
  const d = GROUP_DATA[group];

  return (
    <>
      <PageHeaderPlain title="User Analytics" />

      <div className="chain-tabs">
        {ANALYTICS_CHAINS.map((c) => (
          <span
            key={c}
            role="button"
            tabIndex={0}
            className={`chain-tab ${chain === c ? "active" : ""}`}
            onClick={() => setChain(c)}
            onKeyDown={(e) => e.key === "Enter" && setChain(c)}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid-5">
        <KpiCard title="Total Users" value="301,012" valueStyle={{ fontSize: "1.5rem" }} />
        <KpiCard title="Avg Stablecoin Portfolio" value="$3,820" valueStyle={{ fontSize: "1.5rem" }} />
        <KpiCard title="Avg Native Token Portfolio" value="$2,940" valueStyle={{ fontSize: "1.5rem" }} />
        <KpiCard title="Avg Other Tokens Portfolio" value="$1,670" valueStyle={{ fontSize: "1.5rem" }} />
        <KpiCard 
          title="Avg Idle Value (TIV)" 
          titleAsHtml 
          value="$4,280" 
          valueStyle={{ fontSize: "1.5rem" }} 
        />
      </div>

      <div className="group-bar">
        <div className="group-pills">
          {(Object.keys(GROUP_DATA) as AnalyticsGroupKey[]).map((k) => (
            <span
              key={k}
              role="button"
              tabIndex={0}
              className={`gpill ${group === k ? "active" : ""}`}
              onClick={() => setGroup(k)}
              onKeyDown={(e) => e.key === "Enter" && setGroup(k)}
              data-group={k}
            >
              {GROUP_LABELS[k]}
            </span>
          ))}
        </div>
        <div className="group-summary">{GROUP_LABELS[group]} · {d.users.toLocaleString()} users · Avg Portfolio {d.portfolio}</div>
      </div>

      <div className="grid-2-half">
        <DonutCard
          title="Asset Allocation"
          centerLabel="Split"
          centerValue={d.portfolio}
          segments={[
            { color: "var(--chart-1)", value: 45 },
            { color: "var(--chart-5)", value: 35 },
            { color: "var(--chart-6)", value: 20 },
          ]}
          legend={[
            { color: "var(--chart-1)", label: "Stables", value: "45%" },
            { color: "var(--chart-5)", label: "Native", value: "35%" },
            { color: "var(--chart-6)", label: "Others", value: "20%" },
          ]}
        />
        <DonutCard
          title="Funding Sources"
          centerLabel="Source"
          centerValue="Top 3"
          segments={[
            { color: "var(--chart-2)", value: 55 },
            { color: "var(--chart-3)", value: 30 },
            { color: "var(--chart-4)", value: 15 },
          ]}
          legend={[
            { color: "var(--chart-2)", label: "CEX", value: "55%" },
            { color: "var(--chart-3)", label: "Bridge", value: "30%" },
            { color: "var(--chart-4)", label: "Wallet", value: "15%" },
          ]}
        />
      </div>

      <div className="grid-2-half">
        <Card>
          <CardTitle glow>DeFi Engagement</CardTitle>
          <div className="quad-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="quad-item"><div className="quad-label">Avg DeFi TVL</div><div className="quad-value">{d.defiTvl}</div></div>
            <div className="quad-item"><div className="quad-label">Unclaimed Rewards</div><div className="quad-value">{d.rewards}</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="quad-label" style={{ marginBottom: 6 }}>DeFi Category Split</div>
            <div className="analytics-bar-label" style={{ fontSize: 10 }}><span>LP <b>35%</b></span><span>Lending <b>28%</b></span><span>Staking <b>25%</b></span><span>Vault <b>12%</b></span></div>
            <div className={styles.barTrack} style={{ height: 20, marginTop: 4 }}>
              <div className={styles.barSegment} style={{ width: "35%", background: "var(--chart-1)" }}></div>
              <div className={styles.barSegment} style={{ width: "28%", background: "var(--chart-2)" }}></div>
              <div className={styles.barSegment} style={{ width: "25%", background: "var(--chart-3)" }}></div>
              <div className={styles.barSegment} style={{ width: "12%", background: "var(--chart-5)" }}></div>
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle glow>NFT Holdings</CardTitle>
          <div className="quad-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="quad-item"><div className="quad-label">Avg NFT Count</div><div className="quad-value">{d.nftCount}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Portfolio Value</div><div className="quad-value">{d.nftVal}</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="quad-label" style={{ marginBottom: 6 }}>Top Collections</div>
            <div className={styles.kpiTags}><span className={styles.kpiTag}>BAYC</span><span className={styles.kpiTag}>Azuki</span><span className={styles.kpiTag}>Pudgy Penguins</span></div>
          </div>
        </Card>
      </div>

      <div className="grid-2-half">
        <Card>
          <CardTitle glow>Gas Spending</CardTitle>
          <div className="triple-grid">
            <div className="quad-item"><div className="quad-label">Avg Total Gas</div><div className="quad-value">{d.gasTotal}</div></div>
            <div className="quad-item"><div className="quad-label">Avg 30d Gas</div><div className="quad-value">{d.gas30}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Gas/Tx</div><div className="quad-value">{d.gasTx}</div></div>
          </div>
        </Card>
        <Card>
          <CardTitle glow>Transfer Patterns</CardTitle>
          <div className="triple-grid">
            <div className="quad-item"><div className="quad-label">Avg Inflow <span style={{ color: "var(--accent-teal)" }}>▲</span></div><div className="quad-value">{d.txIn}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Outflow <span style={{ color: "var(--accent-red)" }}>▼</span></div><div className="quad-value">{d.txOut}</div></div>
            <div className="quad-item"><div className="quad-label">Unique Counterparts</div><div className="quad-value">{d.counterparts}</div></div>
          </div>
        </Card>
      </div>

      <div className="grid-2-half">
        <Card>
          <CardTitle glow>Trading Summary</CardTitle>
          <div className="quad-grid">
            <div className="quad-item"><div className="quad-label">Avg Lifetime Vol</div><div className="quad-value">{d.ltVol}</div></div>
            <div className="quad-item"><div className="quad-label">Avg 30d Vol</div><div className="quad-value">{d.vol30}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Trade Size</div><div className="quad-value">{d.tradeSize}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Swaps (30d)</div><div className="quad-value">{d.swaps}</div></div>
          </div>
        </Card>
        <Card>
          <CardTitle glow>Most Used DEX Protocols</CardTitle>
          <div className={styles.rankList}>
            <div className={styles.rankItem}><span className={styles.rankName}>Pendle Finance</span><div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: "72%", background: "var(--chart-1)" }}></div></div><span className={styles.rankVal}>72%</span></div>
            <div className={styles.rankItem}><span className={styles.rankName}>Pendle Finance</span><div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: "48%", background: "var(--chart-2)" }}></div></div><span className={styles.rankVal}>48%</span></div>
            <div className={styles.rankItem}><span className={styles.rankName}>PancakeSwap</span><div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: "35%", background: "var(--chart-3)" }}></div></div><span className={styles.rankVal}>35%</span></div>
            <div className={styles.rankItem}><span className={styles.rankName}>Curve</span><div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: "22%", background: "var(--chart-5)" }}></div></div><span className={styles.rankVal}>22%</span></div>
            <div className={styles.rankItem}><span className={styles.rankName}>SushiSwap</span><div className={styles.rankBarTrack}><div className={styles.rankBar} style={{ width: "15%", background: "var(--chart-6)" }}></div></div><span className={styles.rankVal}>15%</span></div>
          </div>
        </Card>
      </div>

      <div className="grid-2-half">
        <Card>
          <CardTitle glow>Wallet Type Distribution <span className={styles.infoIcon}>ⓘ<div className={styles.infoTooltip}><strong>Wallet classification based on chain activity:</strong><br /><strong>Fresh</strong> — Recently created, no significant on-chain activity<br /><strong>Kaia Only</strong> — Active exclusively on Kaia chain<br /><strong>EVM Only</strong> — Active on a single EVM chain<br /><strong>Multi-chain</strong> — Active across 2 or more chains</div></span></CardTitle>
          <div className="analytics-bar-label"><span>Fresh <b>{d.wFresh}%</b></span><span>Kaia Only <b>{d.wKaia}%</b></span><span>EVM Only <b>{d.wEvm}%</b></span><span>Multi-chain <b>{d.wMulti}%</b></span></div>
          <div className={styles.barTrack} style={{ height: 24, marginTop: 8 }}>
            <div className={styles.barSegment} style={{ width: `${d.wFresh}%`, background: "var(--chart-4)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.wKaia}%`, background: "var(--chart-3)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.wEvm}%`, background: "var(--chart-1)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.wMulti}%`, background: "var(--chart-2)" }}></div>
          </div>
        </Card>
        <Card>
          <CardTitle glow>Spending Tier Distribution</CardTitle>
          <div className="analytics-bar-label"><span>Whale <b>{d.sWhale}%</b></span><span>High <b>{d.sHigh}%</b></span><span>Med <b>{d.sMed}%</b></span><span>Low <b>{d.sLow}%</b></span><span>Inactive <b>{d.sInact}%</b></span></div>
          <div className={styles.barTrack} style={{ height: 24, marginTop: 8 }}>
            <div className={styles.barSegment} style={{ width: `${d.sWhale}%`, background: "var(--accent-amber)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.sHigh}%`, background: "var(--accent-orange)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.sMed}%`, background: "var(--chart-1)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.sLow}%`, background: "var(--chart-2)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.sInact}%`, background: "var(--text-muted)" }}></div>
          </div>
        </Card>
      </div>

      <div className="grid-2-half">
        <Card>
          <CardTitle glow>Activity Profile</CardTitle>
          <div className="quad-grid">
            <div className="quad-item"><div className="quad-label">Avg Tx/Week</div><div className="quad-value">{d.txWeek}</div></div>
            <div className="quad-item"><div className="quad-label">Most Active Hour</div><div className="quad-value">{d.activeHr}</div></div>
            <div className="quad-item"><div className="quad-label">Most Active Day</div><div className="quad-value">{d.activeDay}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Wallet Age</div><div className="quad-value">{d.walletAge}</div></div>
          </div>
        </Card>
        <Card>
          <CardTitle glow>User Activity Status</CardTitle>
          <div className="analytics-bar-label"><span>Active 7d <b>{d.act7}%</b></span><span>Active 30d <b>{d.act30}%</b></span><span>Active 90d <b>{d.act90}%</b></span><span>Inactive 90d+ <b>{d.inact}%</b></span></div>
          <div className={styles.barTrack} style={{ height: 24, marginTop: 8 }}>
            <div className={styles.barSegment} style={{ width: `${d.act7}%`, background: "var(--accent-teal)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.act30}%`, background: "var(--chart-1)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.act90}%`, background: "var(--accent-amber)" }}></div>
            <div className={styles.barSegment} style={{ width: `${d.inact}%`, background: "var(--accent-red)" }}></div>
          </div>
          <div className={styles.barLegend} style={{ marginTop: 8 }}>
            <span className={styles.barLegendItem}><span className={styles.barLegendDot} style={{ background: "var(--accent-teal)" }}></span>5,724 users</span>
            <span className={styles.barLegendItem}><span className={styles.barLegendDot} style={{ background: "var(--chart-1)" }}></span>3,913 users</span>
            <span className={styles.barLegendItem}><span className={styles.barLegendDot} style={{ background: "var(--accent-amber)" }}></span>2,559 users</span>
            <span className={styles.barLegendItem}><span className={styles.barLegendDot} style={{ background: "var(--accent-red)" }}></span>2,860 users</span>
          </div>
        </Card>
      </div>
    </>
  );
}

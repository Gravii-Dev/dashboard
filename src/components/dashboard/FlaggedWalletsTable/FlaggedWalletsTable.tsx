"use client";

import type { ReactNode } from "react";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import type { FlaggedRow } from "@/lib/risk-data";
import styles from "./FlaggedWalletsTable.module.css";

type Props = {
  title: ReactNode;
  rows: FlaggedRow[];
  riskFilter: string;
  sortBy: "newest" | "oldest";
  onRiskFilterChange: (v: string) => void;
  onSortByChange: (v: "newest" | "oldest") => void;
};

export function FlaggedWalletsTable({
  title,
  rows,
  riskFilter,
  sortBy,
  onRiskFilterChange,
  onSortByChange,
}: Props) {
  return (
    <>
      <div className={styles.header}>
        {title}
        <div className={styles.filters}>
          <select
            className={styles.filter}
            value={riskFilter}
            onChange={(e) => onRiskFilterChange(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
          <select
            className={styles.filter}
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Wallet Address</th>
            <th>Risk Level</th>
            <th>Cluster</th>
            <th>Flagged</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className={styles.mono}>{row.addr}</td>
              <td>
                <RiskBadge label={row.risk} variant={row.risk} />
              </td>
              <td>{row.cluster}</td>
              <td>{row.time} hours ago</td>
              <td>
                <button type="button" className={styles.btnBlock}>
                  Block
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

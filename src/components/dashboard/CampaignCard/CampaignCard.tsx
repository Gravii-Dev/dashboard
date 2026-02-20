import styles from "./CampaignCard.module.css";
import { cn } from "@/lib/utils";

export type CampaignStatus = "draft" | "live" | "ended";

export type CampaignItem = {
  partner: string;
  name: string;
  type: string;
  status: CampaignStatus;
  target: string;
  dates: string;
};

export function CampaignCard({ campaign }: { campaign: CampaignItem }) {
  const { partner, name, type, status, target, dates } = campaign;
  return (
    <div className={styles.card} data-status={status}>
      <div className={styles.cardTop}>
        <div>
          <div className={styles.partner}>{partner}</div>
          <div className={styles.name}>{name}</div>
        </div>
        <div className={styles.badges}>
          <span className={styles.typeBadge}>{type}</span>
          <span className={cn(styles.statusBadge, styles[status])}>{status}</span>
        </div>
      </div>
      <div className={styles.meta}>
        <span>Target: {target}</span>
        <span>{dates}</span>
      </div>
    </div>
  );
}

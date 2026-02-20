import styles from "./InfoTooltip.module.css";

export function InfoTooltip({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <span className={styles.infoIcon}>
      ⓘ
      <div className={styles.infoTooltip}>
        <strong>{title}</strong> — {body}
      </div>
    </span>
  );
}

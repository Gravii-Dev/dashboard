interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  title = "No data yet",
  message = "There's nothing to display right now.",
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "var(--text-muted)",
        }}
      >
        ∅
      </div>
      <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 500 }}>
        {title}
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 320 }}>
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 8,
            padding: "8px 20px",
            background: "var(--cta-bg)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            color: "white",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

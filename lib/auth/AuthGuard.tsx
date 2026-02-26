"use client";

import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, authEnabled, signIn } = useAuth();

  if (!authEnabled) return <>{children}</>;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
          color: "var(--text-secondary)",
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
          gap: 24,
        }}
      >
        <h1
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Gravii Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Sign in to access the dashboard
        </p>
        <button
          onClick={signIn}
          style={{
            padding: "12px 32px",
            background: "var(--cta-bg)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

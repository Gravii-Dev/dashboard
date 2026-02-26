"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? "";

const TamboProviderInner = dynamic(
  () => import("./TamboProviderInner"),
  { ssr: false },
);

export default function TamboWrapper({ children }: { children: ReactNode }) {
  if (!TAMBO_API_KEY) {
    return <>{children}</>;
  }

  return <TamboProviderInner>{children}</TamboProviderInner>;
}

"use client";

import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "./components";
import { tamboTools } from "./tools";
import type { ReactNode } from "react";

const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? "";

export default function TamboProviderInner({ children }: { children: ReactNode }) {
  return (
    <TamboProvider
      apiKey={TAMBO_API_KEY}
      userKey="gravii-dashboard-user"
      components={tamboComponents}
      tools={tamboTools}
    >
      {children}
    </TamboProvider>
  );
}

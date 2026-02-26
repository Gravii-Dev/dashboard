import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar/Sidebar";
import QueryProvider from "@/lib/queries/provider";
import ToastProvider from "@/components/Toast/ToastProvider";
import AuthProvider from "@/lib/auth/AuthContext";
import AuthGuard from "@/lib/auth/AuthGuard";
import TamboWrapper from "@/lib/tambo/TamboWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Gravii Dashboard",
  description: "Web3 Analytics and Campaign Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body>
        <AuthProvider>
          <QueryProvider>
            <TamboWrapper>
              <ToastProvider>
                <AuthGuard>
                  <Sidebar />
                  <main className="main">{children}</main>
                </AuthGuard>
              </ToastProvider>
            </TamboWrapper>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

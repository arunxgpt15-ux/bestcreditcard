"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/src/contexts/AuthContext";

export type ProvidersProps = { children: ReactNode };

export function Providers({ children }: ProvidersProps) {
  return <NuqsAdapter><ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange><AuthProvider>{children}</AuthProvider></ThemeProvider></NuqsAdapter>;
}

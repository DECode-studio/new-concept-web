import type { Metadata } from "next";
import "@/styles/globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "New Concept",
  description: "Role-based management system for New Concept language centers.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

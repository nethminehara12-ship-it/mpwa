import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managerial Support Platform for Mental Health",
  applicationName: "WardWell",
  description: "Practical mental-health support guidance for middle-level hospital managers.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WardWell",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#0f294b",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono, Space_Grotesk, Work_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/widget-preview.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

// Used only by the redesigned /dashboard section, alongside DM Sans.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-dashboard-display",
  subsets: ["latin", "latin-ext"],
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

// Used only by the redesigned /dashboard section (see dashboard/layout.tsx),
// not applied globally — the marketing pages and widget keep Work Sans.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Wycenik.io: generator kalkulatorów wycen",
  description: "Osadzalny kalkulator wyceny dla Twojej strony WWW. Bez kodu, w 5 minut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${bricolage.variable} ${workSans.variable} ${plexMono.variable} ${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}

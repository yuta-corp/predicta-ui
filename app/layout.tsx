import { ClerkProvider } from "@clerk/nextjs"
import { Geist_Mono, Instrument_Sans } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { LocationSharingProvider } from "@/components/location-sharing-provider"
import { CookieConsent } from "@/components/consent/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Une seule famille pour toute l'interface (Instrument Sans).
// Monospace réservé au contenu réellement technique (code, JSON).
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://predicta-ui.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Predicta — Trafic en temps réel à Antananarivo",
    template: "%s | Predicta",
  },
  description:
    "Voyez les embouteillages d'Antananarivo en temps réel avant de partir. Consultez l'état des routes, choisissez votre itinéraire et gagnez du temps au quotidien.",
  keywords: [
    "trafic Antananarivo",
    "embouteillage Tana",
    "état routes Antananarivo",
    "temps réel trafic Madagascar",
    "prévoir trafic Tana",
    "itinéraire Antananarivo",
    "Predicta",
  ],
  authors: [{ name: "Predicta" }],
  creator: "Predicta",
  publisher: "Predicta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_MG",
    url: SITE_URL,
    siteName: "Predicta",
    title: "Predicta — Trafic en temps réel à Antananarivo",
    description:
      "Voyez les embouteillages d'Antananarivo en temps réel avant de partir. Consultez l'état des routes et choisissez la meilleure option.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Predicta — La carte du trafic d'Antananarivo en temps réel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Predicta — Trafic en temps réel à Antananarivo",
    description:
      "Voyez les embouteillages d'Antananarivo en temps réel avant de partir.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#f2f4e9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        instrument.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body>
        <ClerkProvider>
          <LocationSharingProvider>
            <ThemeProvider defaultTheme="light">
              {children}
              <Toaster />
            </ThemeProvider>
            <CookieConsent />
            <Analytics />
          </LocationSharingProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
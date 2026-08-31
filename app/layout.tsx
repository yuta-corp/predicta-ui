import { Geist_Mono, Instrument_Sans } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/consent/cookie-consent"
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

export const metadata: Metadata = {
  title: "Predicta — The living map of Antananarivo",
  description:
    "Le trafic d'Antananarivo en temps réel. La ville est vivante : explorez les quartiers, observez les flux, construisez avec l'API.",
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
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}

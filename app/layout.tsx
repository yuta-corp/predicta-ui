import "./globals.css"
import type { Metadata } from "next"
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
})
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Predicta — Trafic Antananarivo en direct",
  description:
    "Carte du trafic en temps réel d'Antananarivo. Évitez les bouchons, gagnez du temps.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

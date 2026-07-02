import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

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
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

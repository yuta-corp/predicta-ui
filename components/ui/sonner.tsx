"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toasts globaux (sonner) — thème synchronisé avec next-themes.
 * Centrés en bas, au-dessus de la barre basse de la carte (offset), avec un
 * bouton de fermeture et des couleurs riches pour les erreurs.
 */
function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme()
  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      position="bottom-center"
      offset={96}
      mobileOffset={80}
      closeButton
      richColors
      {...props}
    />
  )
}

export { Toaster }
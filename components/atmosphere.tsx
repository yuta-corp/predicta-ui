// Atmosphère : grain film + vignette + scrims. Donne profondeur à la carte
// et fait respirer le HUD par-dessus un fond chargé. Purement décoratif.
export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* scrim haut : ancre le bandeau marque/recherche */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--background)]/70 to-transparent" />
      {/* scrim bas : ancre stats/légende */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--background)]/80 to-transparent" />
      {/* vignette : concentre l'œil au centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 55%, var(--background) 130%)",
          opacity: 0.7,
        }}
      />
      {/* grain film animé — texture argentique subtile */}
      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay animate-[grain_0.6s_steps(4)_infinite] [background-size:180px_180px]" style={{ backgroundImage: "var(--grain)" }} />
    </div>
  )
}

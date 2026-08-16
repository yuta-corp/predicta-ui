import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background text-foreground">
      <div className="max-w-md px-6 text-center">
        <p className="font-mono text-[12px] tabular-nums text-primary">
          47.5240° E · 18.9090° S
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Cette route n'existe pas.
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
          La page que vous cherchez n'est pas dans le réseau. Revenez à la
          carte vivante d'Antananarivo.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-sm bg-primary px-4 py-2.5 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Explorer la carte
        </Link>
      </div>
    </main>
  )
}

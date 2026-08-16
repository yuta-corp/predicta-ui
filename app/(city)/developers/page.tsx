import Link from "next/link"
import type { ReactNode } from "react"

const BASE_URL = "https://api.predicta.mg"

function Code({ children, label }: { children: string; label?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-md border border-border/80 bg-black/30">
      {label && (
        <p className="border-b border-border/60 px-4 py-1.5 font-mono text-[10.5px] text-muted-foreground">
          {label}
        </p>
      )}
      <pre className="overflow-x-auto whitespace-pre-wrap break-words bg-muted/50 px-4 py-3 font-mono text-[11.5px] leading-relaxed text-foreground/80">
        {children}
      </pre>
    </div>
  )
}

function Endpoint({
  method,
  path,
  summary,
  children,
}: {
  method: "GET" | "PUT"
  path: string
  summary: string
  children?: ReactNode
}) {
  return (
    <section className="my-6">
      <h3 className="flex flex-wrap items-baseline gap-x-3 font-mono text-[14px] font-medium text-foreground">
        <span className="text-primary">{method}</span>
        <span>{path}</span>
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/80">{summary}</p>
      {children}
    </section>
  )
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-3 mt-10 text-[17px] font-semibold tracking-tight">
      {children}
    </h2>
  )
}

const NAV = [
  ["demarrage", "Démarrage"],
  ["authentification", "Authentification"],
  ["trafic", "Trafic"],
  ["quartiers", "Quartiers"],
  ["geojson", "GeoJSON"],
  ["fraicheur", "Fraîcheur & erreurs"],
  ["limites", "Limites"],
] as const

export default function DevelopersPage() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto h-full overflow-y-auto overscroll-contain bg-background/95">
        <div className="mx-auto flex max-w-5xl gap-12 px-6 py-10 lg:px-10">
          <aside className="sticky top-10 hidden w-48 shrink-0 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Documentation
            </p>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Sommaire">
              {NAV.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
            <Link
              href="/developers/explorer"
              className="mt-6 inline-block rounded-sm bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ouvrir l'explorateur GeoJSON
            </Link>
          </aside>

          <article className="min-w-0 flex-1 pb-20">
            <header className="border-b border-border/70 pb-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                Predicta API · v1.0.0
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Construire avec le trafic de Tana
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-foreground/80">
                L'API Predicta expose le trafic temps réel d'Antananarivo en
                GeoJSON (RFC 7946), converti depuis des tuiles vectorielles.
                Trois points d'entrée trafic, un catalogue de quartiers, une
                clé par application. Aucune persistance : chaque appel est un
                instantané best-effort de la ville.
              </p>
            </header>

            <H2 id="demarrage">Démarrage</H2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              L'API est accessible à l'URL suivante. Chaque requête (hors{" "}
              <code className="font-mono text-primary">/ping</code>)
              exige une clé API dans l'en-tête <code className="font-mono text-primary">X-API-Key</code>.
            </p>
            <Code label="curl">{`curl ${BASE_URL}/ping`}</Code>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              Dans cette application, le navigateur ne contacte jamais l'API
              directement : un proxy Next.js (<code className="font-mono text-primary">/api/predicta/*</code>)
              détient la clé côté serveur et relaie la fraîcheur via les
              en-têtes <code className="font-mono text-primary">X-Predicta-*</code>.
            </p>

            <H2 id="authentification">Authentification</H2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              Une clé API est attribuée à chaque application enregistrée.
              Les clés sont des secrets : elles ne doivent jamais être
              embarquées dans un client public, ni commitées. En cas de clé
              absente ou invalide, l'API répond{" "}
              <code className="font-mono text-primary">401</code>.
            </p>
            <Code label="requête authentifiée">{`curl -H "X-API-Key: pk_live_••••••••" \\
  ${BASE_URL}/quartiers?q=ana`}</Code>

            <H2 id="trafic">Trafic</H2>
            <Endpoint method="GET" path="/traffic" summary="État du trafic live de toute la ville (13 tuiles, ~50 Mo en pratique). Réservé aux usages rares : préférez le quartier ou la zone.">
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                Toujours 200 en cas de résultat partiel (en-tête{" "}
                <code className="font-mono text-primary">X-Predicta-Partial</code>) ;
                <code className="font-mono text-primary">401</code> si la clé manque.
              </p>
            </Endpoint>
            <Endpoint method="PUT" path="/traffic/zone" summary="Trafic autour d'un centroïde (disque, 2 tuiles attendues). Le corps porte le centroïde, nom du lieu au plus proche.">
              <Code label="body">{`{ "name": "Analakely", "lon": 47.52688, "lat": -18.90793 }`}</Code>
            </Endpoint>
            <Endpoint method="GET" path="/traffic/quartier/{quartierId}" summary="Trafic précis d'un quartier (grille polygonale, 1 à 4 tuiles). Réponse mise en cache 45 s (stale-while-revalidate).">
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                En-têtes : <code className="font-mono text-primary">X-Predicta-Age</code> (ms, si servi du
                cache), <code className="font-mono text-primary">X-Predicta-Fallback</code> (repli disque
                centroïde non filtré), <code className="font-mono text-primary">X-Predicta-Partial</code>.
                <code className="font-mono text-primary">404</code> si le quartier est inconnu.
              </p>
            </Endpoint>

            <H2 id="quartiers">Quartiers</H2>
            <Endpoint method="GET" path="/quartiers?q=" summary="Recherche de quartiers (insensible à la casse, tri alphabétique). q vide ou absent renvoie les 372 quartiers.">
              <Code label="réponse">{`[ { "name": "Analakely", "lon": 47.52688, "lat": -18.90793 } ]`}</Code>
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                L'identifiant du quartier (clé de{" "}
                <code className="font-mono text-primary">/traffic/quartier</code>)
                n'est pas exposé ici : il est présent sur chaque segment trafic,
                dans <code className="font-mono text-primary">properties.quartierId</code>.
                Le catalogue complet (avec ids) est embarqué dans l'application.
              </p>
            </Endpoint>

            <H2 id="geojson">GeoJSON</H2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              Les réponses trafic sont des FeatureCollections. Un segment est
              une ligne (LineString ou MultiLineString) portant la vitesse
              observée et le ratio de congestion.
            </p>
            <Code label="feature">{`{
  "type": "Feature",
  "properties": {
    "name": "Avenue de l'Indépendance",
    "quartierId": "rel_999999",
    "speed": 32,
    "rate": 0.9
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [ [47.526, -18.909], [47.529, -18.907] ]
  }
}`}</Code>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              <code className="font-mono text-primary">rate</code> est le ratio
              vitesse observée / vitesse libre (signal de congestion, non
              dérivable de la vitesse seule). Les propriétés{" "}
              <code className="font-mono text-primary">name</code> et{" "}
              <code className="font-mono text-primary">quartierId</code> sont
              optionnelles : la source peut ne pas les fournir pour certains
              segments.
            </p>

            <H2 id="fraicheur">Fraîcheur &amp; erreurs</H2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              L'API est best-effort : si une tuile échoue, elle est ignorée et
              la réponse reste un GeoJSON valide, signalé par{" "}
              <code className="font-mono text-primary">X-Predicta-Partial</code>.
              Le cache mémoire du quartier sert la donnée pendant sa
              revalidation (<code className="font-mono text-primary">X-Predicta-Age</code>).
              L'application traduit ces états en texte — jamais en badges :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-foreground/80">
              <li>Trafic actualisé il y a 14 s</li>
              <li>Certaines routes manquent en ce moment.</li>
              <li>Connexion au trafic impossible — nouvelle tentative.</li>
            </ul>

            <H2 id="limites">Limites &amp; confidentialité</H2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              L'API ne persiste rien et ne fournit ni historique, ni ETA, ni
              prédiction : chaque appel est un instantané. Les géométries
              proviennent d'OpenStreetMap (© OpenStreetMap contributors).
              Les clés sont la seule barrière d'authentification — toute
              logique d'autorisation doit être vérifiée côté serveur.
            </p>

            <div className="mt-10 border-t border-border/70 pt-6">
              <Link
                href="/developers/explorer"
                className="rounded-sm bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ouvrir l'explorateur GeoJSON
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

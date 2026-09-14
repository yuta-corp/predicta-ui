# Predicta

**Predicta** est l'application de **trafic routier en temps réel pour Antananarivo** (Madagascar) : voyez les embouteillages avant de partir, choisissez votre itinéraire et accédez à des fonctionnalités sociales (amis, partage de position, notifications).

L'app est entièrement en français (`fr_MG`).

## Fonctionnalités

### Carte de trafic temps réel (`/map`)
- Affichage de l'état du trafic rue par rue : **Fluide** · **Modéré** · **Dense** · **Indisponible** (données MVT envoyées par l'API Predicta, rafraîchies toutes les 45 s).
- **Panneau de détail d'une route** : nom, quartier, vitesse et niveau de congestion en cliquant sur un segment.
- **Recherche de quartiers** (⌘K / Ctrl+K) avec recentrage automatique sur la carte.
- **Index des quartiers** (`/quartiers`) : 372 quartiers regroupés par lettre, filtrables.
- **Votre position** sur la carte (géolocalisation du navigateur, uniquement en local) avec suivi automatique de la caméra.
- Suivi de fraîcheur des données (« Trafic actualisé il y a X s »), mode clair/sombre, bascule des bâtiments 3D.

### Amis (`/friends`)
- Demande d'ami (recherche par pseudo ou nom), acceptation/refus, liste et suppression.
- Pseudonyme unique (3–20 caractères). Comptes synchronisés avec Clerk (webhook + resynchronisation à la demande).

### Partage de position (opt-in)
- Partage **explicitement ciblé** : seuls les amis que vous autorisez vous voient, ou via un **lien secret à durée limitée** (24 h) accessible sur `/share/[token]`.
- Publication toutes les 30 s pendant le partage ; positions de plus de 5 minutes ignorées. Les autorisations sont mémorisées d'une session à l'autre.
- Position des amis rendue sur la carte (cercle de précision + fiche).

### Notifications
- **Dans l'app** : flux SSE (`/api/notifications`) — demandes d'ami, acceptations, début de partage de position.
- **Web Push** : notifications natives même lorsque l'app est fermée (clés VAPID, abonnement par navigateur).

### Autres pages
- **Landing** (`/`) : vitrine animée avec la carte en fond.
- **Statut** (`/status`) : disponibilité des services de l'API en temps réel.
- Pages légales : mentions légales, CGU, CGV (aucune offre commerciale à ce jour), confidentialité, centre de confidentialité, cookies (consentement des cookies avec catégories).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **MapLibre GL** pour la carte, **shadcn/ui** + Tailwind CSS 4 pour l'UI
- **Clerk** pour l'authentification (`@clerk/nextjs`, middleware via `proxy.ts` — convention Next 16)
- **Prisma ORM 7** + PostgreSQL (driver `@prisma/adapter-pg`)
- **web-push** (VAPID), **zustand** pour les stores globaux, **sonner** pour les toasts

## Architecture

- **Server actions plutôt que routes API** : amis, partage de position et pseudonyme passent par des server actions (`lib/actions/*`) avec `auth()` de `@clerk/nextjs/server`.
- **Proxy `/api/predicta/*`** : seul intermédiaire qui détient la `API_KEY` côté serveur ; il route vers l'API upstream et traduit les entêtes de fraîcheur (`X-Predicta-Age/-Partial/-Fallback`). Les tuiles vectorielles sont chargées directement par le navigateur depuis `NEXT_PUBLIC_API_URL`. **Aucune donnée de trafic n'est persistée** dans cette app.
- **Modèle de données** (`prisma/schema.prisma`) :
  - `User` — miroir local des comptes Clerk.
  - `Friendship` — `pending → accepted | declined`, unique par paire.
  - `LocationShare` — une ligne par utilisateur (upsert toutes les 30 s pendant le partage).
  - `LocationShareViewer` — « qui peut me voir » (amis explicitement autorisés).
  - `LocationShareLink` — liens de partage secrets (jeton, expiration 24 h).
  - `PushSubscription` — abonnements Web Push, un par navigateur.
- **Confidentialité** : la géolocalisation n'est traitée que dans le navigateur. Les positions ne sont lisibles que par les amis autorisés (ou via un lien secret) et jamais stockées côté upstream.

## Mise en route

### 1. Variables d'environnement

```bash
cp .env.example .env
```

Renseignez ensuite :

```
NEXT_PUBLIC_SITE_URL=https://predicta.mg
API_URL=...            # URL de l'API Predicta (serveur uniquement)
API_KEY=...            # clé API app (serveur uniquement, jamais NEXT_PUBLIC)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SIGNING_SECRET=...   # Clerk Dashboard → Webhooks → Signing secret

DATABASE_URL=postgresql://...      # Neon, Supabase, RDS…

NEXT_PUBLIC_VAPID_PUBLIC_KEY=...   # Web Push (voir .env.example pour la génération)
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@predicta.mg
```

### 2. Installer, générer le client Prisma et appliquer la base

```bash
pnpm install
pnpm db:migrate    # ou pnpm db:deploy sur une base existante
```

### 3. Webhook Clerk

Dans le Dashboard Clerk, créez un webhook vers `https://votre-app.com/api/webhooks/clerk` avec les événements `user.created`, `user.updated`, `user.deleted` et utilisez le **Signing secret** comme `CLERK_WEBHOOK_SIGNING_SECRET`. Le webhook maintient la table `users` synchronisée avec Clerk ; les server actions se resynchronisent aussi à la demande.

### 4. Web Push

Générez des clés VAPID (voir `.env.example`) et servez le service worker `/public/sw.js`.

### 5. Lancer

```bash
pnpm dev
```

## Scripts

| Script             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Serveur de développement                        |
| `pnpm build`       | Build de production (inclut `prisma migrate deploy`) |
| `pnpm lint`        | ESLint                                          |
| `pnpm typecheck`   | Vérification TypeScript (sans émission)         |
| `pnpm test`        | Tests unitaires Vitest                          |
| `pnpm db:generate` | Générer le client Prisma                        |
| `pnpm db:migrate`  | Créer et appliquer une migration de développement |
| `pnpm db:deploy`   | Appliquer les migrations en attente             |
| `pnpm db:push`     | Pousser le schéma sans migration                |
| `pnpm generate:quartiers` | Régénérer le catalogue des quartiers (`lib/data/quartiers.ts`) |

## Composants UI

Les composants shadcn/ui vivent dans `components/ui` ; pour en ajouter :

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from "@/components/ui/button";
```
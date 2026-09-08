# Predicta UI Enhancement Design

## Objectif
Ajouter à Predicta (Next.js) : auth Clerk, partage de localisation en temps réel entre amis (façon Snapchat Map), et un système d'amis (façon Facebook : demande → acceptation → liste).

## 1. Clerk
- Suivre https://clerk.com/docs/nextjs/getting-started/quickstart comme source de vérité absolue
- Installer/configurer Clerk (vérifier App Router vs Pages Router).
- Vérifier s'il existe déjà un système d'auth à remplacer.
- Synchroniser les users Clerk avec la DB locale (webhook au sign-up).

## 2. Partage de localisation
- Opt-in explicite, visible uniquement par les amis acceptés.
- Mise à jour périodique de la position (fréquence à définir).
- Affichage sur carte (lib à choisir : Mapbox/Google Maps/Leaflet).
- Bouton pour désactiver le partage à tout moment.

## 3. Système d'amis
- Demande → accepter/refuser → liste d'amis → suppression.
- Statuts : pending / accepted / declined.
- L'accès à la position (point 2) dépend du statut "accepted".

## Contraintes
- Respecter la stack existante (repo à analyser avant de coder).
- Modèles à créer : User, Friendship, LocationShare (+ migrations si besoin).

## Clarifications obtenues lors du brainstorming
- Framework carte à utiliser : maplibre-gl (déjà installé, on le garde).
- Système d'auth actuel à remplacer : aucun (le projet n'a pas d'authentication système).
- Fréquence de mise à jour de la position acceptable : toutes les 30 secondes (recommandé).

---

## Architecture
- Use Clerk for authentication via `@clerk/nextjs`; add ClerkMiddleware to protect routes.
- Add new Next.js API routes under `app/api/friends/*` and `app/api/location/*` that proxy to backend endpoints (to be created in predictaapi).
- Use maplibre-gl for map rendering; friend locations shown as custom markers with popups.
- Location sharing: when user enables sharing, client sends periodic updates (every 30s) to backend via POST /location/update; backend stores latest location per user.
- To fetch friends' locations, client polls GET /location/friends (or uses websocket if we add later) every 30s.
- Friendship model: status pending/accepted/declined; endpoints for sending request, accepting, rejecting, listing friends, removing friend.
- All new endpoints require Clerk authentication (via middleware checking session).

## Data Model
- **User** (extended from Clerk): 
  - `id` (Clerk user ID, PK)
  - `createdAt`, `updatedAt`
  - Optional: `displayName`, `profileImageUrl` (synced via Clerk webhook on user creation/update)
- **Friendship**:
  - `id` (PK)
  - `requesterId` (FK -> User.id)
  - `addresseeId` (FK -> User.id)
  - `status`: enum('pending', 'accepted', 'declined')
  - `createdAt`, `updatedAt`
  - Unique constraint on (requesterId, addresseeId) to prevent duplicate requests
- **LocationShare**:
  - `id` (PK)
  - `userId` (FK -> User.id)
  - `latitude`, `longitude`
  - `accuracy` (optional, in meters)
  - `updatedAt` (timestamp of last update)
  - `expiresAt` (optional, auto‑expire after inactivity; e.g., 5 minutes after last update)
  - Index on `userId` for fast lookup

## Key Flows
1. **Authentication**
   - User visits any protected route → Clerk middleware redirects to sign-in if no session.
   - Sign‑up / sign‑in via Clerk hosted page (email/password, social, etc.).
   - On successful sign‑in, Clerk provides session token; backend routes verify via middleware.
   - Clerk webhook creates/updates local `User` record (id, displayName, profileImageUrl).

2. **Enable / Disable Location Sharing**
   - User toggles “Share my location” in settings UI.
   - When enabled:
     - Client requests permission for geolocation (browser API).
     - On success, starts `setInterval` (30 s) to get current position.
     - Each position is sent to `POST /api/location/update` (proxy to backend) with `{ latitude, longitude, accuracy }`.
     - Backend upserts `LocationShare` row for the user, sets `updatedAt = now()`, `expiresAt = now() + 5 min`.
   - When disabled:
     - Client clears interval.
     - Sends `DELETE /api/location/share` (or sets a flag) to remove the row.
   - Map UI: own location shown as a distinct marker (if sharing enabled).

3. **Friendship Flow**
   - **Send request**: Viewing another user’s profile (or search) → click “Add friend”.
     - `POST /api/friends/request` with `{ addresseeId }`.
     - Backend creates `Friendship` with status = `pending`.
   - **Receive request**: Notification bell shows pending requests.
     - Click to view list; each request has “Accept” / “Reject”.
     - Accept: `POST /api/friends/accept` with `{ requestId }` → updates status to `accepted`.
     - Reject: `POST /api/friends/reject` → status = `declined` (or delete).
   - **Friends list**: `GET /api/friends/list` returns accepted friendships (both directions) with user info.
   - **Remove friend**: `DELETE /api/friends/{friendshipId}`.
   - Only friends with status `accepted` can see each other’s shared location.

4. **View Friends on Map**
   - When map is open, client polls `GET /api/location/friends` every 30 s (or reuses location‑share interval).
   - Backend returns latest `LocationShare` for all friends of the current user (where status = `accepted`).
   - Each friend’s location rendered as a marker on maplibre‑gl; clicking shows popup with name and last‑updated time.
   - If a friend has not shared location or their share expired, no marker is shown.

5. **Privacy & Safety**
   - Location sharing is opt‑in; explicit toggle with clear label “Share my location with friends”.
   - UI shows a banner/icon when sharing is active (e.g., a pulsing dot on the user’s own marker).
   - User can disable sharing at any time; backend immediately stops updating and can delete the row.
   - No location data is shared with non‑friends or the public.

## Error Handling
- **Authentication errors** (401 from backend): redirect to sign‑in page; show toast “Session expired, please sign in again”.
- **API errors** (non‑2xx responses from proxied routes): 
  - Log error to console (dev) or to error‑tracking service (prod).
  - Show user‑friendly toast using `sonner`: e.g., “Unable to update location, please try again”.
  - For 400/422 (validation errors) display inline form errors if applicable.
- **Location permission denied**: when user clicks “Share my location” but browser denies geolocation, show toast “Location access denied. Enable it in browser settings to share.”
- **Network failures**: wrap `fetch` calls with timeout and retry logic (max 2 retries with exponential backoff); on persistent failure show toast “No internet connection”.
- **Invalid friend request** (e.g., requesting self, already friends): backend returns 400 with error code; frontend shows appropriate message.
- **Stale location data**: if a friend’s `LocationShare` is older than `expiresAt`, treat as not sharing and hide marker.
- **Global error boundary**: Next.js `error.tsx` catches unexpected errors and shows fallback UI.
-- Pseudo unique des utilisateurs.
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- Autorisations de visibilité du partage (qui peut me voir).
CREATE TABLE "location_share_viewers" (
    "shareUserId" TEXT NOT NULL,
    "viewerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_share_viewers_pkey" PRIMARY KEY ("shareUserId","viewerUserId")
);

-- CreateIndex
CREATE INDEX "location_share_viewers_viewerUserId_idx" ON "location_share_viewers"("viewerUserId");

-- AddForeignKey
ALTER TABLE "location_share_viewers" ADD CONSTRAINT "location_share_viewers_shareUserId_fkey" FOREIGN KEY ("shareUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_share_viewers" ADD CONSTRAINT "location_share_viewers_viewerUserId_fkey" FOREIGN KEY ("viewerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Liens de partage externes.
CREATE TABLE "location_share_links" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "location_share_links_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "location_share_links_userId_idx" ON "location_share_links"("userId");

-- AddForeignKey
ALTER TABLE "location_share_links" ADD CONSTRAINT "location_share_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
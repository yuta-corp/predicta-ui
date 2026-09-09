-- Add a fixed "startedAt" timestamp to LocationShare: set when a sharing
-- session begins (insert or stale restart), never advanced by the periodic
-- position upsert. Used to detect "a friend just started sharing" exactly,
-- without re-notifying on every 30s position refresh.

ALTER TABLE "location_shares" ADD COLUMN "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill: existing active rows are treated as having started when last updated.
UPDATE "location_shares" SET "startedAt" = "updatedAt";
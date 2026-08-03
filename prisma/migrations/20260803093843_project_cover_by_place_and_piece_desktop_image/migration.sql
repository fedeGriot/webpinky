-- AlterTable
ALTER TABLE "Project" ADD COLUMN "coverImageListingUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "coverImageHeroUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "coverImageCarouselUrl" TEXT;

-- Backfill: la portada única que ya estaba cargada sirve como punto de
-- partida para los 3 lugares nuevos, hasta que se re-suba el recorte
-- específico de cada uno desde el panel.
UPDATE "Project"
SET
  "coverImageListingUrl" = "coverImageUrl",
  "coverImageHeroUrl" = "coverImageUrl",
  "coverImageCarouselUrl" = "coverImageUrl"
WHERE "coverImageUrl" IS NOT NULL;

ALTER TABLE "Project" DROP COLUMN "coverImageUrl";

-- AlterTable
ALTER TABLE "ProjectPiece" ADD COLUMN "imageDesktopUrl" TEXT;

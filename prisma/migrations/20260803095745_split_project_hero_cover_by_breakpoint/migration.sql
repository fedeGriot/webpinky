-- AlterTable
ALTER TABLE "Project" ADD COLUMN "coverImageHeroMobileUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "coverImageHeroDesktopUrl" TEXT;

-- Backfill: la imagen única de la ficha que ya estaba cargada sirve como
-- punto de partida para mobile y desktop, hasta que se re-suba el recorte
-- específico de cada breakpoint desde el panel.
UPDATE "Project"
SET
  "coverImageHeroMobileUrl" = "coverImageHeroUrl",
  "coverImageHeroDesktopUrl" = "coverImageHeroUrl"
WHERE "coverImageHeroUrl" IS NOT NULL;

ALTER TABLE "Project" DROP COLUMN "coverImageHeroUrl";

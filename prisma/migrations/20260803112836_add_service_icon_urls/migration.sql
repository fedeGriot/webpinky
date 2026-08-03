-- AlterTable
ALTER TABLE "Service" ADD COLUMN "iconAccentUrl" TEXT;
ALTER TABLE "Service" ADD COLUMN "iconUrl" TEXT;

-- Backfill: estos 6 servicios ya tenían ilustraciones reales como archivos
-- estáticos en public/icons/{services,services-accent}/{slug}.png, elegidas
-- a mano por slug en src/components/service-icon.tsx antes de que este campo
-- existiera. Sin este backfill, al pasar a usar iconUrl/iconAccentUrl como
-- fuente de verdad estos 6 servicios se quedarían sin ilustración (fallback
-- al emoji) hasta que alguien los volviera a subir a mano desde el panel.
UPDATE "Service" SET "iconUrl" = '/icons/services/' || "slug" || '.png',
                     "iconAccentUrl" = '/icons/services-accent/' || "slug" || '.png'
WHERE "slug" IN (
  'estrategia-consultoria',
  'creatividad-contenido',
  'performance-medios',
  'branding-diseno',
  'produccion-audiovisual',
  'tecnologia-automatizacion'
);

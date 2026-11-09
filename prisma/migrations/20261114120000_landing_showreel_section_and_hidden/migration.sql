-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Landing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "navLabel" TEXT NOT NULL,
    "sectionOrderJson" TEXT NOT NULL DEFAULT '[]',
    "hiddenSectionsJson" TEXT NOT NULL DEFAULT '[]',
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroBody" TEXT NOT NULL,
    "heroCtaLabel" TEXT NOT NULL,
    "showreelUrl" TEXT,
    "showreelTitle" TEXT NOT NULL DEFAULT '',
    "showreelBody" TEXT NOT NULL DEFAULT '',
    "clientsTitle" TEXT NOT NULL,
    "clientsBody" TEXT NOT NULL,
    "painTitle" TEXT NOT NULL,
    "painIntro" TEXT NOT NULL,
    "painPointsJson" TEXT NOT NULL DEFAULT '[]',
    "servicesTitle" TEXT NOT NULL,
    "servicesIntro" TEXT NOT NULL,
    "servicesJson" TEXT NOT NULL DEFAULT '[]',
    "casesTitle" TEXT NOT NULL,
    "casesIntro" TEXT NOT NULL,
    "caseProjectIdsJson" TEXT NOT NULL DEFAULT '[]',
    "casesShowVideo" BOOLEAN NOT NULL DEFAULT false,
    "methodTitle" TEXT NOT NULL,
    "methodIntro" TEXT NOT NULL,
    "methodStepsJson" TEXT NOT NULL DEFAULT '[]',
    "formatsTitle" TEXT NOT NULL DEFAULT '',
    "formatsIntro" TEXT NOT NULL DEFAULT '',
    "formatsJson" TEXT NOT NULL DEFAULT '[]',
    "partnerTitle" TEXT NOT NULL,
    "partnerBody" TEXT NOT NULL,
    "partnerPointsJson" TEXT NOT NULL DEFAULT '[]',
    "testimonialsTitle" TEXT NOT NULL,
    "testimonialIdsJson" TEXT NOT NULL DEFAULT '[]',
    "faqTitle" TEXT NOT NULL,
    "faqsJson" TEXT NOT NULL DEFAULT '[]',
    "ctaEyebrow" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaBody" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Landing" ("caseProjectIdsJson", "casesIntro", "casesShowVideo", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "formatsIntro", "formatsJson", "formatsTitle", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "sectionOrderJson", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialIdsJson", "testimonialsTitle", "updatedAt", "showreelUrl") SELECT "caseProjectIdsJson", "casesIntro", "casesShowVideo", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "formatsIntro", "formatsJson", "formatsTitle", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "sectionOrderJson", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialIdsJson", "testimonialsTitle", "updatedAt", "heroVideoUrl" FROM "Landing";
DROP TABLE "Landing";
ALTER TABLE "new_Landing" RENAME TO "Landing";
CREATE UNIQUE INDEX "Landing_slug_key" ON "Landing"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Producción Audiovisual: el showreel pasa a ser una sección propia después
-- del carrusel de marcas (con título y texto), sin casos de éxito ni
-- metodología por ahora, y el CTA sin la frase de la propuesta.
UPDATE "Landing" SET
  "sectionOrderJson" = '["clients", "showreel", "pain", "services", "formats", "testimonials", "faq", "cases", "method", "partner"]',
  "hiddenSectionsJson" = '["cases", "method", "partner"]',
  "showreelTitle" = 'Nuestro trabajo *en movimiento*',
  "showreelBody" = 'Una selección de spots, campañas y contenidos que produjimos para marcas de distintas industrias. Dale play y mirá cómo trabajamos.',
  "caseProjectIdsJson" = '[]',
  "ctaBody" = 'Completá el formulario con algunos datos de tu proyecto y coordinamos una reunión para entender qué necesitás.'
WHERE "slug" = 'produccion-audiovisual';


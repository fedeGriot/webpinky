-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "company" TEXT NOT NULL,
    "videoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Landing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "navLabel" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroBody" TEXT NOT NULL,
    "heroCtaLabel" TEXT NOT NULL,
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
    "methodTitle" TEXT NOT NULL,
    "methodIntro" TEXT NOT NULL,
    "methodStepsJson" TEXT NOT NULL DEFAULT '[]',
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
INSERT INTO "new_Landing" ("caseProjectIdsJson", "casesIntro", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialsTitle", "updatedAt") SELECT "caseProjectIdsJson", "casesIntro", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialsTitle", "updatedAt" FROM "Landing";
DROP TABLE "Landing";
ALTER TABLE "new_Landing" RENAME TO "Landing";
CREATE UNIQUE INDEX "Landing_slug_key" ON "Landing"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;


-- El testimonio que hasta ahora salía de la cita del proyecto de Cinnabon
-- pasa a ser un testimonio propio (con nombre, cargo y empresa editables
-- desde el admin) y queda elegido en la landing de Marketing Digital.
INSERT INTO "Testimonial" ("id", "order", "quote", "authorName", "authorRole", "company", "videoUrl", "updatedAt")
SELECT 'testimonial_cinnabon', 0, "quoteText", COALESCE(NULLIF("quoteAuthor", ''), "clientName"), NULL, "clientName", NULL, CURRENT_TIMESTAMP
FROM "Project"
WHERE "slug" = 'cinnabon-lanzamiento-uruguay' AND "quoteText" IS NOT NULL AND "quoteText" <> '';

UPDATE "Landing" SET "testimonialIdsJson" = '["testimonial_cinnabon"]'
WHERE "slug" = 'marketing-digital' AND EXISTS (SELECT 1 FROM "Testimonial" WHERE "id" = 'testimonial_cinnabon');

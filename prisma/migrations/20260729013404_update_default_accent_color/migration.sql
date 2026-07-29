-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT '#D90B91',
    "summary" TEXT NOT NULL,
    "resultBadge" TEXT NOT NULL,
    "resultLabel" TEXT NOT NULL,
    "challengeTitle" TEXT NOT NULL,
    "challengeBody" TEXT NOT NULL,
    "solutionTitle" TEXT NOT NULL,
    "solutionBody" TEXT NOT NULL,
    "quoteText" TEXT,
    "quoteAuthor" TEXT,
    "servicesTagsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("accentColor", "category", "challengeBody", "challengeTitle", "clientName", "coverImageUrl", "createdAt", "featured", "heroHeadline", "id", "industry", "order", "quoteAuthor", "quoteText", "resultBadge", "resultLabel", "servicesTagsJson", "slug", "solutionBody", "solutionTitle", "summary", "title", "updatedAt", "year") SELECT "accentColor", "category", "challengeBody", "challengeTitle", "clientName", "coverImageUrl", "createdAt", "featured", "heroHeadline", "id", "industry", "order", "quoteAuthor", "quoteText", "resultBadge", "resultLabel", "servicesTagsJson", "slug", "solutionBody", "solutionTitle", "summary", "title", "updatedAt", "year" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

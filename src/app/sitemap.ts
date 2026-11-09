import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { getPublishedLandings } from "@/lib/data";

// Sin esto, Next intenta pre-renderizar /sitemap.xml en build time, y ahí
// consulta la base — en Railway el volumen persistente (/data, donde vive
// la base SQLite) recién se monta en runtime, no durante el build, así que
// el build fallaba con "Cannot open database because the directory does
// not exist". force-dynamic hace que se genere en cada request en runtime,
// como el resto de las páginas del sitio.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, landings] = await Promise.all([
    prisma.project.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    }),
    getPublishedLandings(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/quienes-somos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/que-hacemos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/proyectos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/proyectos/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const landingRoutes: MetadataRoute.Sitemap = landings.map((landing) => ({
    url: `${SITE_URL}/servicios/${landing.slug}`,
    lastModified: landing.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...landingRoutes, ...projectRoutes];
}

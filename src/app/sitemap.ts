import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { order: "asc" },
  });

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

  return [...staticRoutes, ...projectRoutes];
}

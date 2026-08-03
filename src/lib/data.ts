import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return settings;
}

export async function getHeroContent() {
  const hero = await prisma.heroContent.findUnique({ where: { id: "singleton" } });
  if (!hero) return null;
  return { ...hero, rotatingWords: JSON.parse(hero.rotatingWordsJson) as string[] };
}

export async function getAboutContent() {
  return prisma.aboutContent.findUnique({ where: { id: "singleton" } });
}

export async function getClients() {
  return prisma.client.findMany({ orderBy: { order: "asc" } });
}

export async function getServices() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return services.map((s) => ({ ...s, bullets: JSON.parse(s.bulletsJson) as string[] }));
}

export async function getServiceBySlug(slug: string) {
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return null;
  return { ...service, bullets: JSON.parse(service.bulletsJson) as string[] };
}

export async function getProcessSteps() {
  return prisma.processStep.findMany({ orderBy: { order: "asc" } });
}

export async function getValues() {
  return prisma.value.findMany({ orderBy: { order: "asc" } });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { order: "asc" } });
}

export async function getStats(context: string) {
  return prisma.stat.findMany({ where: { context }, orderBy: { order: "asc" } });
}

function mapProject<
  T extends { servicesTagsJson: string },
>(project: T) {
  const { servicesTagsJson, ...rest } = project;
  return { ...rest, servicesTags: JSON.parse(servicesTagsJson) as string[] };
}

export async function getFeaturedProjects() {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
  return projects.map(mapProject);
}

export async function getAllProjects() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return projects.map(mapProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      stats: { orderBy: { order: "asc" } },
      pieces: { orderBy: { order: "asc" } },
    },
  });
  if (!project) return null;
  return mapProject(project);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      stats: { orderBy: { order: "asc" } },
      pieces: { orderBy: { order: "asc" } },
    },
  });
  if (!project) return null;
  return mapProject(project);
}

export async function getNextProject(order: number) {
  const next = await prisma.project.findFirst({
    where: { order: { gt: order } },
    orderBy: { order: "asc" },
  });
  if (next) return mapProject(next);
  const first = await prisma.project.findFirst({ orderBy: { order: "asc" } });
  return first ? mapProject(first) : null;
}

export async function getPreviousProject(order: number) {
  const previous = await prisma.project.findFirst({
    where: { order: { lt: order } },
    orderBy: { order: "desc" },
  });
  if (previous) return mapProject(previous);
  const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });
  return last ? mapProject(last) : null;
}

export async function getMeetingRequests() {
  return prisma.meetingRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMeetingRequestById(id: string) {
  return prisma.meetingRequest.findUnique({ where: { id } });
}

// select explícito: nunca traer passwordHash a una vista de admin.
export async function getAdminUsers() {
  return prisma.adminUser.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

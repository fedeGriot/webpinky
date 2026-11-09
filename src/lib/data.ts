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

// --- Landings de servicio ---

export type LandingItem = { title: string; body: string };
/** service: slug del servicio cuya animación se muestra. */
export type LandingServiceItem = LandingItem & { href?: string; tagline?: string; service?: string };
export type LandingFaq = { question: string; answer: string };

// Un JSON roto (editado a mano en la base, por ejemplo) no tiene que tirar
// abajo la página entera: esa sección queda vacía y no se muestra.
function parseList<T>(json: string): T[] {
  try {
    const value = JSON.parse(json);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function mapLanding<T extends {
  painPointsJson: string;
  servicesJson: string;
  caseProjectIdsJson: string;
  methodStepsJson: string;
  partnerPointsJson: string;
  testimonialProjectIdsJson: string;
  faqsJson: string;
}>(landing: T) {
  const {
    painPointsJson,
    servicesJson,
    caseProjectIdsJson,
    methodStepsJson,
    partnerPointsJson,
    testimonialProjectIdsJson,
    faqsJson,
    ...rest
  } = landing;
  return {
    ...rest,
    painPoints: parseList<LandingItem>(painPointsJson),
    services: parseList<LandingServiceItem>(servicesJson),
    caseProjectIds: parseList<string>(caseProjectIdsJson),
    methodSteps: parseList<LandingItem>(methodStepsJson),
    partnerPoints: parseList<LandingItem>(partnerPointsJson),
    testimonialProjectIds: parseList<string>(testimonialProjectIdsJson),
    faqs: parseList<LandingFaq>(faqsJson),
  };
}

export async function getAllLandings() {
  return prisma.landing.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}

export async function getPublishedLandings() {
  return prisma.landing.findMany({
    where: { published: true },
    select: { slug: true, navLabel: true, updatedAt: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getLandingBySlug(slug: string) {
  const landing = await prisma.landing.findUnique({ where: { slug } });
  return landing ? mapLanding(landing) : null;
}

export type LandingData = NonNullable<Awaited<ReturnType<typeof getLandingBySlug>>>;

export async function getLandingById(id: string) {
  const landing = await prisma.landing.findUnique({ where: { id } });
  return landing ? mapLanding(landing) : null;
}

/**
 * Casos de una landing: los elegidos en el admin, en su orden, completados
 * con proyectos destacados hasta llegar a `min` (por si se eligieron menos o
 * se borró alguno), así la sección nunca queda con uno o dos casos sueltos.
 */
export async function getLandingCases(ids: string[], min = 3) {
  const chosen = await getProjectsByIds(ids);
  if (chosen.length >= min) return chosen;
  const used = new Set(chosen.map((p) => p.id));
  const featured = (await getFeaturedProjects()).filter((p) => !used.has(p.id));
  return [...chosen, ...featured.slice(0, min - chosen.length)];
}

/** Proyectos por ID respetando el orden elegido en la landing. */
export async function getProjectsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const projects = await prisma.project.findMany({ where: { id: { in: ids } } });
  const byId = new Map(projects.map((p) => [p.id, mapProject(p)]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

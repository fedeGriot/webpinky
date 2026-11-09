import "server-only";
import { prisma } from "@/lib/prisma";

// Lectura y validación del formulario de /admin/landings, separada de las
// server actions para que solo ellas queden expuestas como endpoints.

// Tope defensivo: nada en este CMS necesita legítimamente un campo de texto
// de más de 20k caracteres; esto solo frena payloads patológicos.
const MAX_TEXT_LENGTH = 20_000;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_CASES = 4;

export function formStr(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim().slice(0, MAX_TEXT_LENGTH);
}

export function parseSlug(formData: FormData) {
  const slug = formStr(formData, "slug");
  if (!SLUG_RE.test(slug)) {
    throw new Error("El slug solo puede tener minúsculas, números y guiones (ej: marketing-digital).");
  }
  return slug;
}

// Las listas llegan como JSON desde ListEditor / ProjectPicker. Se rearman
// acá con solo las claves esperadas y como texto plano, así nada que no sea
// lo que el formulario manda termina guardado en la base.
function parseJsonArray(formData: FormData, key: string): unknown[] {
  try {
    const value = JSON.parse(String(formData.get(key) ?? "[]"));
    return Array.isArray(value) ? value : [];
  } catch {
    throw new Error(`La lista "${key}" no tiene un formato válido.`);
  }
}

function cleanItems<K extends string>(formData: FormData, key: string, fields: readonly K[], required: K) {
  return parseJsonArray(formData, key)
    .map((raw) => {
      const item = (raw ?? {}) as Record<string, unknown>;
      return Object.fromEntries(
        fields.map((f) => [f, String(item[f] ?? "").trim().slice(0, MAX_TEXT_LENGTH)]),
      ) as Record<K, string>;
    })
    .filter((item) => item[required].length > 0);
}

// Links de los servicios: solo rutas internas (/que-hacemos#..., /servicios/...)
// o http(s), para no terminar guardando un href tipo javascript: en un <a>.
function cleanHref(href: string) {
  if (!href) return undefined;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    if (url.protocol === "http:" || url.protocol === "https:") return href;
  } catch {}
  throw new Error(`El link "${href}" no es válido: usá una ruta del sitio (ej. /que-hacemos) o una URL http(s).`);
}

async function parseProjectIds(formData: FormData, key: string, max?: number) {
  const ids = [...new Set(parseJsonArray(formData, key).map(String))].slice(0, max);
  if (ids.length === 0) return [];
  const existing = await prisma.project.findMany({ where: { id: { in: ids } }, select: { id: true } });
  const valid = new Set(existing.map((p) => p.id));
  return ids.filter((id) => valid.has(id));
}

export async function landingFieldsFromForm(formData: FormData) {
  const serviceSlugs = new Set((await prisma.service.findMany({ select: { slug: true } })).map((s) => s.slug));
  const services = cleanItems(formData, "servicesJson", ["title", "tagline", "body", "bullets", "service", "href"], "title").map(
    ({ href, service, ...rest }) => ({
      ...rest,
      // Animación: solo un servicio existente; cualquier otro valor se descarta.
      ...(serviceSlugs.has(service) ? { service } : {}),
      ...(cleanHref(href) ? { href: cleanHref(href) } : {}),
    }),
  );
  return {
    slug: parseSlug(formData),
    navLabel: formStr(formData, "navLabel"),
    published: formData.get("published") === "on",
    seoTitle: formStr(formData, "seoTitle"),
    seoDescription: formStr(formData, "seoDescription"),
    heroEyebrow: formStr(formData, "heroEyebrow"),
    heroTitle: formStr(formData, "heroTitle"),
    heroBody: formStr(formData, "heroBody"),
    heroCtaLabel: formStr(formData, "heroCtaLabel"),
    clientsTitle: formStr(formData, "clientsTitle"),
    clientsBody: formStr(formData, "clientsBody"),
    painTitle: formStr(formData, "painTitle"),
    painIntro: formStr(formData, "painIntro"),
    painPointsJson: JSON.stringify(cleanItems(formData, "painPointsJson", ["title", "body"], "title")),
    servicesTitle: formStr(formData, "servicesTitle"),
    servicesIntro: formStr(formData, "servicesIntro"),
    servicesJson: JSON.stringify(services),
    casesTitle: formStr(formData, "casesTitle"),
    casesIntro: formStr(formData, "casesIntro"),
    caseProjectIdsJson: JSON.stringify(await parseProjectIds(formData, "caseProjectIdsJson", MAX_CASES)),
    methodTitle: formStr(formData, "methodTitle"),
    methodIntro: formStr(formData, "methodIntro"),
    methodStepsJson: JSON.stringify(cleanItems(formData, "methodStepsJson", ["title", "body"], "title")),
    partnerTitle: formStr(formData, "partnerTitle"),
    partnerBody: formStr(formData, "partnerBody"),
    partnerPointsJson: JSON.stringify(cleanItems(formData, "partnerPointsJson", ["title", "body"], "title")),
    testimonialsTitle: formStr(formData, "testimonialsTitle"),
    testimonialProjectIdsJson: JSON.stringify(await parseProjectIds(formData, "testimonialProjectIdsJson")),
    faqTitle: formStr(formData, "faqTitle"),
    faqsJson: JSON.stringify(cleanItems(formData, "faqsJson", ["question", "answer"], "question")),
    ctaEyebrow: formStr(formData, "ctaEyebrow"),
    ctaTitle: formStr(formData, "ctaTitle"),
    ctaBody: formStr(formData, "ctaBody"),
  };
}


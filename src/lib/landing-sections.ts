/**
 * Secciones de una landing que se pueden reordenar (el hero va siempre
 * primero y el contacto siempre al final). La consultoría SEO propone un
 * orden distinto según el servicio — en Producción audiovisual, por ejemplo,
 * el portafolio va antes de los puntos de dolor —, así que cada landing
 * guarda el suyo en sectionOrderJson. Una sección sin contenido no se
 * muestra, aunque esté en la lista.
 */
export const LANDING_SECTIONS = {
  clients: "Marcas que confían",
  pain: "Puntos de dolor",
  services: "Servicios y alcance",
  cases: "Casos de éxito / portafolio",
  method: "Metodología",
  formats: "Formatos y canales",
  partner: "Growth partner",
  testimonials: "Testimonios",
  faq: "Preguntas frecuentes",
} as const;

export type LandingSectionKey = keyof typeof LANDING_SECTIONS;

export const DEFAULT_SECTION_ORDER = Object.keys(LANDING_SECTIONS) as LandingSectionKey[];

/**
 * El orden guardado, sin claves desconocidas ni repetidas, y con las que
 * falten agregadas al final (por ejemplo, una sección nueva que se sume al
 * sitio después de haber ordenado una landing).
 */
export function normalizeSectionOrder(order: unknown[]): LandingSectionKey[] {
  const known = order.filter((k): k is LandingSectionKey => typeof k === "string" && k in LANDING_SECTIONS);
  const unique = [...new Set(known)];
  return [...unique, ...DEFAULT_SECTION_ORDER.filter((k) => !unique.includes(k))];
}

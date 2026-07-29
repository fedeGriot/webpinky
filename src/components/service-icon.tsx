const SLUGS_WITH_ICON = new Set([
  "estrategia-consultoria",
  "creatividad-contenido",
  "performance-medios",
  "branding-diseno",
  "produccion-audiovisual",
  "tecnologia-automatizacion",
]);

export function ServiceIcon({
  slug,
  fallback,
  className = "h-9 w-9",
  variant = "base",
}: {
  slug: string;
  fallback?: string;
  className?: string;
  variant?: "base" | "accent";
}) {
  if (!SLUGS_WITH_ICON.has(slug)) {
    return <span className="text-2xl">{fallback ?? "✦"}</span>;
  }
  const folder = variant === "accent" ? "services-accent" : "services";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/icons/${folder}/${slug}.png`} alt="" className={`${className} object-contain`} />
  );
}

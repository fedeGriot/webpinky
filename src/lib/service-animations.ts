// Animaciones de /que-hacemos, por slug de servicio. Archivos en
// public/videos/servicios/ (recortados y comprimidos a partir de los
// originales 1920×1080). Un servicio sin entrada acá sigue mostrando su ícono.
const SLUGS = [
  "estrategia-consultoria",
  "creatividad-contenido",
  "performance-medios",
  "branding-diseno",
  "produccion-audiovisual",
  "tecnologia-automatizacion",
] as const;

export function getServiceAnimation(slug: string) {
  if (!(SLUGS as readonly string[]).includes(slug)) return null;
  return { src: `/videos/servicios/${slug}.mp4`, poster: `/videos/servicios/${slug}.jpg` };
}

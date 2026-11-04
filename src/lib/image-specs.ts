/**
 * Medida y peso máximo de cada lugar del admin donde se sube una imagen.
 *
 * Las imágenes tienen que llegar ya optimizadas (auditoría SEO): el servidor
 * igual las re-comprime a WebP como red de seguridad, pero partir de un
 * archivo pesado implica una doble compresión (pérdida de calidad), formularios
 * lentos y depender del servidor para algo que se resuelve al exportar.
 *
 * Los pesos máximos son los de una foto con mucho detalle exportada a la
 * medida exacta en JPG/WebP calidad ~80, con margen. ImageInput los aplica
 * antes de enviar el formulario: si un archivo los supera, no se puede subir.
 */
export type ImageSpec = {
  width: number;
  height: number;
  maxKB: number;
  /** Necesita fondo transparente (PNG o WebP) en vez de foto (JPG o WebP). */
  transparent?: boolean;
  /** Texto de formato cuando no alcanza con foto / transparente. */
  format?: string;
};

export const IMAGE_SPECS = {
  projectListing: { width: 1150, height: 1440, maxKB: 450 },
  projectHeroMobile: { width: 760, height: 770, maxKB: 250 },
  projectHeroDesktop: { width: 3600, height: 1090, maxKB: 900 },
  projectCarousel: { width: 760, height: 1350, maxKB: 300 },
  pieceMobile: { width: 760, height: 1350, maxKB: 300 },
  pieceDesktop: { width: 1180, height: 2100, maxKB: 600 },
  clientLogo: { width: 400, height: 200, maxKB: 60, transparent: true },
  // Las fotos actuales son PNG recortadas en círculo (con transparencia); una
  // foto cuadrada también sirve porque el sitio la recorta igual.
  teamPhoto: { width: 400, height: 400, maxKB: 150, transparent: true, format: "JPG, WebP o PNG" },
  serviceIcon: { width: 500, height: 500, maxKB: 150, transparent: true },
} satisfies Record<string, ImageSpec>;

/** Tope duro en el servidor, por si un archivo llega sin pasar por ImageInput. */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Mismos tipos que acepta el servidor (src/lib/uploads.ts). */
export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/webp,image/png,image/gif";

export function formatSize(spec: ImageSpec) {
  return `${spec.width}×${spec.height}px`;
}

export function formatKB(bytes: number) {
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.round(kb)} KB`;
}

export function formatFormat(spec: ImageSpec) {
  if (spec.format) return spec.format;
  return spec.transparent ? "PNG o WebP con fondo transparente" : "JPG o WebP";
}

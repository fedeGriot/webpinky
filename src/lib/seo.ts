export const SITE_NAME = "Pinky — The Fit Agency";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pinky.com.uy";
export const SITE_DESCRIPTION =
  "Agencia de publicidad integral con base en Montevideo. Combinamos estrategia, creatividad y performance para impulsar el crecimiento de las marcas que confían en nosotros.";

// Meta descriptions de las páginas fijas (auditoría SEO): 70–160 caracteres,
// dentro de los 960px que muestra Google y terminando en un llamado a la
// acción. Validadas con serpWidth (src/lib/serp-length.ts). SITE_DESCRIPTION
// queda para los datos estructurados, donde no corresponde un CTA.
export const PAGE_DESCRIPTIONS = {
  home: "Agencia de publicidad integral en Montevideo: estrategia, creatividad y performance para que tu marca crezca. Hablemos de tu próximo proyecto.",
  quienesSomos:
    "Desde 2010 acompañamos a más de 500 marcas a crecer. Te contamos nuestra historia, el equipo y los clientes. Conocé quiénes somos.",
  queHacemos:
    "Estrategia, creatividad, performance, branding, producción audiovisual y tecnología bajo un mismo techo. Descubrí cómo hacemos crecer tu marca.",
  proyectos:
    "Casos de éxito de Pinky: estrategia, creatividad y performance aplicados a marcas reales de Uruguay y la región. Conocé nuestros proyectos.",
  contacto:
    "Contanos qué necesita tu marca y coordinamos una reunión para escalar tus ventas y mejorar tu performance digital. Completá el formulario.",
} as const;

// CTA del respaldo automático de las fichas de proyecto (de más largo a más
// corto: se usa el primero que entra en los límites).
export const PROJECT_DESCRIPTION_CTAS = ["Conocé el caso completo.", "Conocé el caso.", "Ver caso."];

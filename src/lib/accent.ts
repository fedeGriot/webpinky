/**
 * Convención de los textos editables del admin: lo que va entre *asteriscos*
 * se muestra en color de acento (ej. "Casos de *marketing digital*"). Estas
 * funciones son puras para poder usarlas tanto al renderizar como al armar
 * metadata o JSON-LD, donde los asteriscos no tienen que aparecer.
 */
export type AccentSegment = { text: string; accent: boolean };

export function splitAccent(text: string): AccentSegment[] {
  return text
    .split(/\*([^*]+)\*/g)
    .map((chunk, i) => ({ text: chunk, accent: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

export function stripAccent(text: string) {
  return text.replace(/\*/g, "");
}

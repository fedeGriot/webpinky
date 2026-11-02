// Ancho de texto tal como lo muestra Google en los resultados (Arial: títulos a
// 20px, descripciones a 14px). Google corta por píxeles, no por caracteres:
// el límite recomendado es 600px para el título y 960px para la descripción.
// Tabla medida con canvas.measureText("100px Arial"); se usa en el servidor
// (armar descripciones) y en el admin (contador en vivo), sin depender de canvas.

export const TITLE_MAX_PX = 600;
export const TITLE_FONT_PX = 20;
export const DESCRIPTION_MAX_PX = 960;
export const DESCRIPTION_FONT_PX = 14;
export const DESCRIPTION_MIN_CHARS = 70;
export const DESCRIPTION_MAX_CHARS = 160;

// Ancho de cada carácter a 100px.
const WIDTH_AT_100PX: Record<string, number> = {
  " ": 27.78, "!": 27.78, '"': 35.5, "#": 55.62, $: 55.62, "%": 88.92, "&": 66.7, "'": 19.09,
  "(": 33.3, ")": 33.3, "*": 38.92, "+": 58.4, ",": 27.78, "-": 33.3, ".": 27.78, "/": 27.78,
  ":": 27.78, ";": 27.78, "<": 58.4, "=": 58.4, ">": 58.4, "?": 55.62, "@": 101.51,
  "[": 27.78, "\\": 27.78, "]": 27.78, "^": 46.92, _: 55.62, "`": 33.3, "{": 33.4, "|": 25.98,
  "}": 33.4, "~": 58.4,
  A: 66.7, B: 66.7, C: 72.22, D: 72.22, E: 66.7, F: 61.08, G: 77.78, H: 72.22, I: 27.78, J: 50,
  K: 66.7, L: 55.62, M: 83.3, N: 72.22, O: 77.78, P: 66.7, Q: 77.78, R: 72.22, S: 66.7, T: 61.08,
  U: 72.22, V: 66.7, W: 94.38, X: 66.7, Y: 66.7, Z: 61.08,
  a: 55.62, b: 55.62, c: 50, d: 55.62, e: 55.62, f: 27.78, g: 55.62, h: 55.62, i: 22.22, j: 22.22,
  k: 50, l: 22.22, m: 83.3, n: 55.62, o: 55.62, p: 55.62, q: 55.62, r: 33.3, s: 50, t: 27.78,
  u: 55.62, v: 50, w: 72.22, x: 50, y: 50, z: 50,
  á: 55.62, é: 55.62, í: 27.78, ó: 55.62, ú: 55.62, Á: 66.7, É: 66.7, Í: 27.78, Ó: 77.78, Ú: 72.22,
  ñ: 55.62, Ñ: 72.22, ü: 55.62, Ü: 72.22, "¿": 61.08, "¡": 33.3, "°": 39.99, "—": 100, "–": 55.62,
  "“": 33.3, "”": 33.3, "‘": 22.22, "’": 22.22, "…": 100, "·": 33.3, "€": 55.62,
};
for (let d = 0; d <= 9; d++) WIDTH_AT_100PX[String(d)] = 55.62;
const FALLBACK_WIDTH = 55.62; // promedio: caracteres fuera de la tabla

export function serpWidth(text: string, fontPx: number): number {
  let width = 0;
  for (const ch of text) width += WIDTH_AT_100PX[ch] ?? FALLBACK_WIDTH;
  return Math.round((width * fontPx) / 100);
}

export function fitsDescription(text: string): boolean {
  return text.length <= DESCRIPTION_MAX_CHARS && serpWidth(text, DESCRIPTION_FONT_PX) <= DESCRIPTION_MAX_PX;
}

/**
 * Meta description a partir de un texto largo (ej. el resumen de un proyecto)
 * + un llamado a la acción al final, entre 70 y 160 caracteres y dentro de
 * 960px. Es el respaldo cuando el proyecto no tiene una descripción escrita a
 * mano en el admin.
 *
 * 1. El texto completo con el primer CTA que entre (de más largo a más corto).
 * 2. Si no entra, recorta por oración, después por frase (coma, punto y coma,
 *    dos puntos) y como último recurso por palabra — siempre que el resultado
 *    llegue al mínimo, para no quedar con una descripción de 4 palabras.
 */
export function buildMetaDescription(text: string, ctas: string[]): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const cta = ctas[0];
  const ensurePeriod = (s: string) => s.replace(/[\s,;:—–-]+$/, "").replace(/([^.!?…])$/, "$1.");
  const valid = (d: string) => d.length >= DESCRIPTION_MIN_CHARS && fitsDescription(d);

  for (const candidate of ctas) {
    const full = `${ensurePeriod(clean)} ${candidate}`;
    if (valid(full)) return full;
  }

  const longestPrefix = (parts: string[], sep: string, finish: (s: string) => string) => {
    let best = "";
    let acc = "";
    for (const part of parts) {
      acc = acc ? `${acc}${sep}${part}` : part;
      const candidate = `${finish(acc)} ${cta}`;
      if (!fitsDescription(candidate)) break;
      best = candidate;
    }
    return valid(best) ? best : null;
  };

  return (
    longestPrefix(clean.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [], " ", (s) => s) ??
    longestPrefix(clean.split(/(?<=[,;:])\s+/), " ", ensurePeriod) ??
    longestPrefix(clean.split(" "), " ", (s) => `${s.replace(/[\s,;:.]+$/, "")}…`) ??
    `${ensurePeriod(clean)} ${cta}`.slice(0, DESCRIPTION_MAX_CHARS)
  );
}

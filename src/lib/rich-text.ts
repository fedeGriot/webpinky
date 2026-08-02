// Heurística: si el valor guardado no tiene ninguna etiqueta, es texto plano
// de antes del editor WYSIWYG (o un registro que un admin todavía no volvió
// a guardar con él) — se convierte a párrafos para que se vea bien desde el
// primer momento. La usan tanto el editor (src/components/admin/rich-text-editor.tsx)
// como el render público (src/components/rich-text-content.tsx).
export function plainTextToHtml(value: string): string {
  if (!value) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Para metadata (title/description de SEO, JSON-LD) y previews truncadas con
// line-clamp: ahí nunca hay que mostrar las etiquetas HTML del editor.
export function stripHtml(html: string): string {
  return html
    .replace(/<(p|br|li)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

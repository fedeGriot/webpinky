import DOMPurify from "isomorphic-dompurify";

// Allowlist mínima: solo lo que el editor WYSIWYG (RichTextEditor) puede
// producir. Nada de atributos, links, imágenes ni scripts — si en algún
// momento se necesita más, hay que ampliar esto Y la barra de herramientas
// del editor a la vez, no por separado.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "h3", "h4", "ul", "ol", "li"];

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] });
}

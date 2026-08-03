import { plainTextToHtml } from "@/lib/rich-text";
import { sanitizeRichText } from "@/lib/sanitize";

/**
 * Renderiza contenido guardado desde RichTextEditor. Ya se sanitiza al
 * guardarse (ver src/lib/sanitize.ts), pero se vuelve a sanitizar acá antes
 * de inyectarlo como HTML — no por desconfiar del contenido actual, sino
 * como red de seguridad: si algún campo nuevo llegara a usar este
 * componente sin pasar por sanitizeRichText en su server action, esto sigue
 * cortando cualquier tag/atributo fuera de la allowlist antes de que llegue
 * al DOM. El costo (DOMPurify corre una vez más) es despreciable.
 * `className` es para color/tamaño de texto base (varía según el bloque);
 * este componente solo aporta los estilos estructurales de las etiquetas
 * que el editor puede producir.
 */
export function RichTextContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`[&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-white [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-white [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_p+p]:mt-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(plainTextToHtml(html)) }}
    />
  );
}

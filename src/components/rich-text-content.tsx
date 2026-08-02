import { plainTextToHtml } from "@/lib/rich-text";

/**
 * Renderiza contenido guardado desde RichTextEditor (ya sanitizado al
 * guardarse — ver src/lib/sanitize.ts). `className` es para color/tamaño de
 * texto base (varía según el bloque); este componente solo aporta los
 * estilos estructurales de las etiquetas que el editor puede producir.
 */
export function RichTextContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`[&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-white [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-white [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_p+p]:mt-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: plainTextToHtml(html) }}
    />
  );
}

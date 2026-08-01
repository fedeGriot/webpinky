/**
 * Inserta un bloque <script type="application/ld+json"> de forma segura.
 * Escapa "<" para que un valor con "</script>" (ej. contenido cargado desde
 * el CMS) no pueda cortar el tag y escapar hacia el HTML de la página.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

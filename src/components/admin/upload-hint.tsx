export type UploadSize = {
  /** Solo cuando la misma imagen se usa en más de un lugar con medidas
   * distintas (ej. portada de proyecto). Si no se pasa, la medida vale para
   * el único lugar donde se usa esta imagen. */
  label?: string;
  mobile: string;
  /** Si no se pasa, la medida es la misma en mobile y escritorio (no hace
   * falta mostrar "Mobile:" para una imagen que no cambia por responsive). */
  desktop?: string;
};

/**
 * Texto simple debajo de un <input type="file"> con la medida exacta para
 * subir esa imagen — calculada mirando el CSS real donde se renderiza, no
 * genérica. Cuando el tamaño en pantalla cambia según el ancho de la
 * ventana, se listan las dos opciones (mobile/escritorio); cuando la misma
 * imagen se usa en más de un lugar del sitio, cada lugar tiene su propia
 * línea con sus propias medidas.
 */
export function UploadHint({ sizes, format, note }: { sizes: UploadSize[]; format: string; note?: string }) {
  return (
    <div className="mt-1 flex flex-col gap-0.5 text-xs text-white/40">
      {sizes.map((s, i) => (
        <p key={i}>
          {s.label ? `${s.label}: ` : ""}
          {s.desktop ? (
            <>
              Mobile <span className="text-white/70">{s.mobile}</span> · Escritorio{" "}
              <span className="text-white/70">{s.desktop}</span>
            </>
          ) : (
            <span className="text-white/70">{s.mobile}</span>
          )}
        </p>
      ))}
      <p>
        {format}
        {note ? ` — ${note}` : ""}
      </p>
    </div>
  );
}

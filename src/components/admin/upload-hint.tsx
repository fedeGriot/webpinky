/**
 * Ayuda chica debajo de un <input type="file"> con la medida/formato óptimo
 * para esa imagen puntual (calculado mirando el CSS real donde se
 * renderiza cada una — no son medidas genéricas).
 */
export function UploadHint({ size, format, note }: { size: string; format: string; note?: string }) {
  return (
    <p className="mt-1 text-xs text-white/40">
      {size} · {format}
      {note ? ` — ${note}` : ""}
    </p>
  );
}

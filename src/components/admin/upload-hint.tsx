export type UploadSpot = {
  /** Dónde aparece esta imagen en el sitio. */
  where: string;
  /** Tamaño/relación de aspecto en ESE lugar puntual. */
  size: string;
};

/**
 * Ayuda debajo de un <input type="file"> que explica dónde se usa esa
 * imagen puntual y con qué medida en cada lugar (calculado mirando el CSS
 * real donde se renderiza cada una — no son medidas genéricas). Cuando la
 * misma imagen se recorta distinto según dónde aparece (o según mobile vs.
 * escritorio), `spots` lista cada caso por separado en vez de dar una sola
 * medida ambigua.
 */
export function UploadHint({
  spots,
  format,
  note,
}: {
  spots: UploadSpot[];
  format: string;
  note?: string;
}) {
  return (
    <div className="mt-1.5 max-w-md rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
      <p className="mb-1 font-semibold uppercase tracking-wide text-white/40">Dónde se usa</p>
      <ul className="flex flex-col gap-0.5">
        {spots.map((spot) => (
          <li key={spot.where}>
            {spot.where}: <span className="text-white/70">{spot.size}</span>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 border-t border-white/10 pt-1.5">
        Formato: <span className="text-white/70">{format}</span>
        {note ? ` — ${note}` : ""}
      </p>
    </div>
  );
}

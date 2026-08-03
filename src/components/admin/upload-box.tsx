/**
 * Casilla de subida de imagen individual: un recuadro clickeable (con la
 * imagen actual de fondo si ya hay una cargada, o un ícono + "Subir imagen"
 * si todavía no) y debajo el nombre del lugar donde se usa + la medida
 * exacta para esa casilla. Se usa una por cada tamaño/lugar que necesite su
 * propio recorte (portada, piezas), en vez de un solo campo con una lista de
 * medidas al lado.
 */
export function UploadBox({
  name,
  title,
  size,
  currentUrl,
}: {
  name: string;
  title: string;
  size: string;
  currentUrl?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="group relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white/10 transition hover:bg-white/15">
        {currentUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span
          className={
            currentUrl
              ? "absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
              : "flex flex-col items-center gap-1.5 text-xs font-semibold text-white/70"
          }
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Subir imagen
        </span>
        <input name={name} type="file" accept="image/*" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      </label>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-white/40">{size}</p>
      </div>
    </div>
  );
}

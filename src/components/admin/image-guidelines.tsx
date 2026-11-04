/**
 * Guía corta para exportar imágenes antes de subirlas al admin. Va plegada
 * arriba de cada grupo de casillas: la medida y el peso de cada casilla ya
 * están debajo de ella; acá va el cómo.
 */
export function ImageGuidelines() {
  return (
    <details className="group rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70">
      <summary className="cursor-pointer select-none font-semibold text-white marker:text-white/40">
        Cómo preparar las imágenes antes de subirlas
      </summary>
      <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-xs leading-relaxed text-white/60">
        <li>
          <strong className="text-white/80">Medida exacta.</strong> Exportá cada imagen a la medida que indica su casilla.
          Más grande no se ve mejor (solo pesa más y hace más lenta la web); más chica se ve pixelada.
        </li>
        <li>
          <strong className="text-white/80">Formato.</strong> Fotos y piezas en JPG o WebP. PNG solo cuando hace falta
          fondo transparente (logos, ilustraciones); WebP también admite transparencia y pesa menos.
        </li>
        <li>
          <strong className="text-white/80">Compresión.</strong> Calidad entre 75 y 85: a simple vista es igual al
          original y pesa varias veces menos. Desde Photoshop: Exportar como → JPG, calidad 80. Desde Figma: exportar
          en 1x a la medida indicada.
        </li>
        <li>
          <strong className="text-white/80">Peso máximo.</strong> Cada casilla indica su máximo. Si el archivo lo supera,
          el admin no lo deja subir: pasalo por{" "}
          <a href="https://squoosh.app" target="_blank" rel="noreferrer" className="underline hover:text-white">
            Squoosh
          </a>{" "}
          (WebP o MozJPEG, calidad 80) o por{" "}
          <a href="https://tinypng.com" target="_blank" rel="noreferrer" className="underline hover:text-white">
            TinyPNG
          </a>{" "}
          si es PNG.
        </li>
        <li>
          El sitio igual las convierte a WebP como respaldo, pero partir de un archivo pesado implica comprimir dos
          veces y perder calidad.
        </li>
      </ul>
    </details>
  );
}

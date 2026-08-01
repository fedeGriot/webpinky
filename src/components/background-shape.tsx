const SHAPES = {
  "01": "/graficos/formas/forma-01.svg",
  "02": "/graficos/formas/forma-02.svg",
  "03": "/graficos/formas/forma-03.svg",
  "08": "/graficos/formas/forma-08.svg",
  "09": "/graficos/formas/forma-09.svg",
} as const;

/**
 * Gráficos de fondo con textura de puntos, provistos por Pinky (carpeta
 * Gráficos > Formas). Cada página usa una forma distinta para no repetir
 * siempre el mismo gráfico a lo largo del sitio.
 */
export function BackgroundShape({
  shape,
  className = "",
}: {
  shape: keyof typeof SHAPES;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SHAPES[shape]}
      alt=""
      aria-hidden="true"
      className={`shape-drift pointer-events-none absolute select-none ${className}`}
    />
  );
}

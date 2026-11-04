import { formatFormat, formatSize, type ImageSpec } from "@/lib/image-specs";

/**
 * Texto simple debajo de un input de imagen con la medida exacta, el peso
 * máximo y el formato para esa imagen — calculados mirando el CSS real donde
 * se renderiza, no genéricos (ver IMAGE_SPECS).
 */
export function UploadHint({ spec, note }: { spec: ImageSpec; note?: string }) {
  return (
    <p className="text-xs text-white/40">
      <span className="text-white/70">
        {formatSize(spec)} · máx. {spec.maxKB} KB
      </span>{" "}
      · {formatFormat(spec)}
      {note ? ` — ${note}` : ""}
    </p>
  );
}

import Image from "next/image";

/**
 * Portada de un proyecto en formato listado (4:5): la imagen de listado si
 * está cargada, o un degradé con el color de acento del proyecto y una
 * trama de puntos si no. Se usa en /proyectos y en los casos de las landings.
 */
export function ProjectCover({
  project,
  sizes,
  loading,
  fetchPriority,
}: {
  project: { clientName: string; accentColor: string; coverImageListingUrl?: string | null };
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "auto";
}) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-2xl"
      style={
        project.coverImageListingUrl
          ? undefined
          : { background: `linear-gradient(150deg, ${project.accentColor}, ${project.accentColor}99)` }
      }
    >
      {project.coverImageListingUrl ? (
        <Image
          src={project.coverImageListingUrl}
          alt={project.clientName}
          fill
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(#fff 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />
      )}
    </div>
  );
}

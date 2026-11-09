import Image from "next/image";
import { VideoLightboxTrigger } from "@/components/video-lightbox";
import { getYouTubeId } from "@/lib/youtube";

type Testimonial = {
  quote: string;
  authorName: string;
  authorRole: string | null;
  company: string;
  videoUrl: string | null;
};

/**
 * Testimonio de un cliente: el texto (o un extracto, si es en video) con
 * nombre, cargo y empresa. Si tiene video de YouTube, arriba va la miniatura
 * con el mismo botón de play que abre el reproductor de las fichas de
 * proyecto; si el video está en otro lado, un link que lo abre aparte.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const videoId = testimonial.videoUrl ? getYouTubeId(testimonial.videoUrl) : null;
  const attribution = [testimonial.authorRole, testimonial.company].filter(Boolean).join(" · ");

  return (
    <figure>
      {videoId && (
        <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl bg-black">
          {/* hqdefault existe para cualquier video (maxresdefault no siempre);
              viene en 4:3 con franjas negras, que el object-cover recorta. */}
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <VideoLightboxTrigger videoId={videoId} label={`Ver el testimonio de ${testimonial.authorName}`} />
        </div>
      )}
      <blockquote className="border-l-2 border-accent pl-6" style={{ fontFamily: "var(--font-serif)" }}>
        <p className="text-2xl italic leading-snug text-white">&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-4 pl-6">
        <p className="font-bold text-white">{testimonial.authorName}</p>
        {attribution && <p className="text-sm text-white/50">{attribution}</p>}
        {testimonial.videoUrl && !videoId && (
          <a
            href={testimonial.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-bold text-accent transition hover:text-white"
          >
            Ver el testimonio en video ↗
          </a>
        )}
      </figcaption>
    </figure>
  );
}

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/** Extrae el ID de un video de YouTube a partir de las formas de URL más
 * comunes (watch?v=, youtu.be/, embed/, shorts/). Devuelve null si la URL
 * no es de YouTube o no se puede reconocer el ID. */
export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return YOUTUBE_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id && YOUTUBE_ID_RE.test(id) ? id : null;
      }
      const match = parsed.pathname.match(/^\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }

    return null;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeId(url) !== null;
}

/**
 * Miniatura de mejor calidad disponible: maxresdefault (1280×720) no existe
 * para todos los videos, así que se chequea y si no está se usa hqdefault
 * (480×360, siempre presente). El chequeo queda cacheado un día.
 */
export async function getYouTubeThumbnail(videoId: string): Promise<string> {
  const maxres = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  try {
    const res = await fetch(maxres, { method: "HEAD", next: { revalidate: 86400 } });
    if (res.ok) return maxres;
  } catch {}
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

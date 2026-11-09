import { splitAccent } from "@/lib/accent";

/**
 * Renderiza un texto con la convención *acento* (ver src/lib/accent.ts).
 * `underline` agrega la pincelada rosa debajo del tramo destacado, como en
 * los H1 del resto del sitio.
 */
export function AccentText({ text, underline = false }: { text: string; underline?: boolean }) {
  return (
    <>
      {splitAccent(text).map((segment, i) =>
        !segment.accent ? (
          segment.text
        ) : underline ? (
          <span key={i} className="relative inline-block text-accent">
            {segment.text}
            <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
          </span>
        ) : (
          <span key={i} className="text-accent">
            {segment.text}
          </span>
        ),
      )}
    </>
  );
}

import Image from "next/image";

export function ServiceIcon({
  iconUrl,
  iconAccentUrl,
  fallback,
  className = "h-9 w-9",
  variant = "base",
}: {
  iconUrl?: string | null;
  iconAccentUrl?: string | null;
  fallback?: string;
  className?: string;
  variant?: "base" | "accent";
}) {
  const url = variant === "accent" ? iconAccentUrl : iconUrl;
  if (!url) {
    return <span className="text-2xl">{fallback ?? "✦"}</span>;
  }
  // width/height = el mayor tamaño en que se muestra (251px en ¿Qué hacemos?);
  // el tamaño real lo da className. next/image sirve 1x/2x de eso en vez del
  // PNG original de 500px (~120–140 KB).
  return <Image src={url} alt="" width={256} height={256} className={`${className} object-contain`} />;
}

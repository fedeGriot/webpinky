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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className={`${className} object-contain`} />
  );
}

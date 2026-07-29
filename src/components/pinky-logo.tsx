export function PinkyLogo({ size = "md", subtext = true }: { size?: "sm" | "md"; subtext?: boolean }) {
  const heightClass = size === "sm" ? "h-[31px]" : "h-[36px]";

  // Logo oficial (PNG blanco, fondo transparente) provisto por Pinky.
  return subtext ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/pinky-agency-white.png"
      alt="Pinky — The Fit Agency"
      className={`${heightClass} w-auto`}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo/pinky-white.png" alt="Pinky" className={`${heightClass} w-auto`} />
  );
}

import Image from "next/image";

const PALETTE = [
  "#D90B91",
  "#E89B52",
  "#4B8B9F",
  "#8C6FBF",
  "#C77D3E",
  "#5C9E6F",
  "#B5548A",
  "#3E7CB1",
];

export function TeamAvatar({
  initial,
  index,
  title,
  photoUrl,
}: {
  initial: string;
  index: number;
  title?: string;
  photoUrl?: string | null;
}) {
  if (photoUrl) {
    return (
      // 96px en pantalla: next/image sirve 96/192px (1x/2x) en AVIF/WebP en
      // vez del PNG original (200–460 KB cada foto).
      <Image
        src={photoUrl}
        alt={title ?? initial}
        title={title}
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover shadow-lg shadow-black/30"
      />
    );
  }

  const color = PALETTE[index % PALETTE.length];
  return (
    <span
      className="flex h-24 w-24 items-center justify-center rounded-full text-lg font-bold text-white"
      style={{ background: `linear-gradient(155deg, ${color}, ${color}99)` }}
      title={title}
    >
      {initial}
    </span>
  );
}

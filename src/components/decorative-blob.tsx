"use client";

import { useId } from "react";

const BLOB_PATH =
  "M 380 180 C 430 230 420 320 370 380 C 320 440 230 445 170 395 C 100 340 80 250 140 190 C 200 120 320 120 380 180 Z";

export function DecorativeBlob({
  className = "",
  color = "#D90B91",
  opacity = 0.6,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  const uid = useId();
  const gradId = `blobGrad-${uid}`;
  const dotsId = `blobDots-${uid}`;
  const maskId = `blobMask-${uid}`;

  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 500 500"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="70%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <pattern id={dotsId} x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.2" fill={color} opacity="0.85" />
        </pattern>
        <mask id={maskId}>
          <path fill="white" d={BLOB_PATH} />
        </mask>
      </defs>
      <rect width="500" height="500" fill={`url(#${dotsId})`} mask={`url(#${maskId})`} />
      <path fill={`url(#${gradId})`} d={BLOB_PATH} opacity={opacity} />
    </svg>
  );
}

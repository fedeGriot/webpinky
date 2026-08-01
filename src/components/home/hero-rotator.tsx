"use client";

import { useEffect, useState } from "react";

export function HeroRotator({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="relative inline-block min-h-[1em] min-w-[280px] align-top text-accent sm:min-w-[420px]">
      {words.map((word, i) => (
        <span
          key={word}
          className="absolute left-0 top-0 whitespace-nowrap transition-all duration-500"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="relative inline-block">{word}</span>
        </span>
      ))}
    </span>
  );
}

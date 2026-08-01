"use client";

import { useEffect, useRef } from "react";

type ClientItem = { id: string; name: string; logoUrl: string | null };

const CYCLE_SECONDS = 40;
const HOVER_SLOWDOWN = 4;

export function ClientsMarquee({ clients }: { clients: ClientItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const baseSpeedRef = useRef(0);
  const halfWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || clients.length === 0) return;

    // Ojo con esto: leer scrollWidth fuerza al navegador a recalcular el
    // layout (reflow síncrono) porque depende del tamaño real ya
    // renderizado. Hacerlo una sola vez acá (por resize) en vez de en cada
    // frame del rAF de abajo evita ese costo 60 veces por segundo, que es lo
    // que generaba el tironeo/temblor al scrollear.
    function measure() {
      halfWidthRef.current = track!.scrollWidth / 2;
      baseSpeedRef.current = halfWidthRef.current / CYCLE_SECONDS;
      targetSpeedRef.current = baseSpeedRef.current;
    }
    measure();
    window.addEventListener("resize", measure);

    let rafId: number;
    let lastTime: number | null = null;

    function step(time: number) {
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(dt * 4, 1);
      offsetRef.current += speedRef.current * dt;

      const halfWidth = halfWidthRef.current;
      if (halfWidth > 0 && offsetRef.current >= halfWidth) {
        offsetRef.current -= halfWidth;
      }
      track!.style.transform = `translateX(-${offsetRef.current}px)`;
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, [clients.length]);

  if (clients.length === 0) return null;

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => {
        targetSpeedRef.current = baseSpeedRef.current / HOVER_SLOWDOWN;
      }}
      onMouseLeave={() => {
        targetSpeedRef.current = baseSpeedRef.current;
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-14 py-2">
        {[...clients, ...clients].map((client, i) => (
          <div key={`${client.id}-${i}`} className="flex h-16 w-[150px] shrink-0 items-center justify-center">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logoUrl}
                alt={client.name}
                className="h-full w-full object-contain brightness-0 invert opacity-70 transition hover:opacity-100"
              />
            ) : (
              <span className="whitespace-nowrap text-lg font-extrabold uppercase tracking-tight text-white/70">
                {client.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

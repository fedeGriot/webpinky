"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ServiceIcon } from "@/components/service-icon";

// Página temporal para comparar opciones de animación en los gráficos de
// servicio de ¿Qué hacemos?. No está enlazada desde ningún lado del sitio ni
// listada en el sitemap — es solo para decidir, se borra después.

const SLUGS = ["estrategia-consultoria", "creatividad-contenido", "performance-medios"];

function BounceInDemo() {
  const [replayKey, setReplayKey] = useState(0);
  return (
    <div>
      <button
        type="button"
        onClick={() => setReplayKey((k) => k + 1)}
        className="mb-6 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-white"
      >
        Reintentar animación ↻
      </button>
      <div className="flex flex-wrap gap-10">
        {SLUGS.map((slug, i) => (
          <motion.div
            key={`${slug}-${replayKey}`}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 15, delay: i * 0.12 }}
          >
            <ServiceIcon slug={slug} variant="accent" className="h-40 w-40" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BreatheDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      {SLUGS.map((slug, i) => (
        <div key={slug} className="icon-breathe" style={{ animationDelay: `${i * 0.6}s` }}>
          <ServiceIcon slug={slug} variant="accent" className="h-40 w-40" />
        </div>
      ))}
    </div>
  );
}

function HoverLiftDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      {SLUGS.map((slug) => (
        <div key={slug} className="group flex h-48 w-40 items-end justify-center">
          <ServiceIcon
            slug={slug}
            variant="accent"
            className="h-40 w-40 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:drop-shadow-[0_18px_18px_rgba(217,11,145,0.35)]"
          />
        </div>
      ))}
    </div>
  );
}

function HoverTwistDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      {SLUGS.map((slug) => (
        <div key={slug} className="group flex h-40 w-40 items-center justify-center">
          <ServiceIcon
            slug={slug}
            variant="accent"
            className="h-40 w-40 transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}

export default function DemoAnimacionesServiciosPage() {
  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-white sm:px-14">
      <style>{`
        @keyframes icon-breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.06) rotate(2deg); }
        }
        .icon-breathe {
          animation: icon-breathe 5s ease-in-out infinite;
        }
      `}</style>

      <h1 className="mb-2 text-3xl font-extrabold">Demo: animaciones para los gráficos de servicio</h1>
      <p className="mb-16 max-w-2xl text-white/60">
        Página temporal, no forma parte del sitio público — es solo para comparar y elegir.
      </p>

      <section className="mb-20">
        <h2 className="mb-2 text-xl font-bold text-accent">1. Entrada con rebote</h2>
        <p className="mb-6 max-w-xl text-sm text-white/50">
          En el sitio real se dispararía al entrar en pantalla durante el scroll (una vez por
          servicio). Acá usá el botón para repetirla las veces que quieras.
        </p>
        <BounceInDemo />
      </section>

      <section className="mb-20">
        <h2 className="mb-2 text-xl font-bold text-accent">2. Respiración continua</h2>
        <p className="mb-6 max-w-xl text-sm text-white/50">
          Loop infinito y sutil (escala + rotación leve), sin necesidad de interacción — se ve
          "vivo" todo el tiempo.
        </p>
        <BreatheDemo />
      </section>

      <section className="mb-20">
        <h2 className="mb-2 text-xl font-bold text-accent">3. Hover con levante</h2>
        <p className="mb-6 max-w-xl text-sm text-white/50">Pasá el mouse por encima de cada gráfico.</p>
        <HoverLiftDemo />
      </section>

      <section className="mb-20">
        <h2 className="mb-2 text-xl font-bold text-accent">4. Hover con giro sutil</h2>
        <p className="mb-6 max-w-xl text-sm text-white/50">Pasá el mouse por encima de cada gráfico.</p>
        <HoverTwistDemo />
      </section>
    </main>
  );
}

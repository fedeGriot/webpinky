import type { NextConfig } from "next";

// CSP sin nonces (recomendación oficial de Next.js para apps que no los necesitan):
// https://nextjs.org/docs/app/guides/content-security-policy#without-nonces
// 'unsafe-inline' en script-src es requerido porque Next.js inyecta el payload de
// React Server Components vía <script> inline; no hay dangerouslySetInnerHTML ni
// eval en el código de la app, así que el riesgo real que esto habilita es bajo.
const isDev = process.env.NODE_ENV === "development";
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-src https://www.youtube.com https://www.youtube-nocookie.com;
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  // Por defecto Next.js manda "X-Powered-By: Next.js" en cada respuesta —
  // no es una falla explotable por sí sola, pero es fingerprinting gratis
  // de la tecnología del backend que no cuesta nada evitar.
  poweredByHeader: false,
  images: {
    // Todas las imágenes son same-origin (subidas del CMS en public/uploads,
    // o assets estáticos en public/) — no hace falta remotePatterns.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;

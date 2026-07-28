import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fuentes auto-hospedadas (descargadas de Google Fonts) en vez de next/font/google:
// evita que el servidor de dev/build dependa de red para compilar el layout raíz.
const nunito = localFont({
  src: "./fonts/nunito-variable.woff2",
  variable: "--font-nunito",
  weight: "400 900",
  display: "swap",
});

const caveat = localFont({
  src: "./fonts/caveat-700.woff2",
  variable: "--font-caveat",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pinky — The Fit Agency",
  description:
    "Agencia de publicidad integral con base en Montevideo. Combinamos estrategia, creatividad y performance para impulsar el crecimiento de las marcas que confían en nosotros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">{children}</body>
    </html>
  );
}

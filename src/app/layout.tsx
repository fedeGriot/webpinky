import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fuentes auto-hospedadas (descargadas de Google Fonts) en vez de next/font/google:
// evita que el servidor de dev/build dependa de red para compilar el layout raíz.
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
    { path: "./fonts/poppins-800.woff2", weight: "800" },
    { path: "./fonts/poppins-900.woff2", weight: "900" },
  ],
  variable: "--font-poppins",
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
    <html lang="es" className={`${poppins.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">{children}</body>
    </html>
  );
}

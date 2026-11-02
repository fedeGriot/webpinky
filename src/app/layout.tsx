import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, PAGE_DESCRIPTIONS } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getSiteSettings } from "@/lib/data";

// Fuentes auto-hospedadas (descargadas de Google Fonts) en vez de next/font/google:
// evita que el servidor de dev/build dependa de red para compilar el layout raíz.
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
    { path: "./fonts/poppins-800.woff2", weight: "800" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — Pinky` },
  description: PAGE_DESCRIPTIONS.home,
  applicationName: "Pinky",
  keywords: [
    "agencia de publicidad Montevideo",
    "agencia de publicidad Uruguay",
    "marketing digital Uruguay",
    "estrategia de marca",
    "growth partner",
    "Pinky The Fit Agency",
  ],
  authors: [{ name: "Pinky. The Fit Agency" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: PAGE_DESCRIPTIONS.home,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: PAGE_DESCRIPTIONS.home,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // try/catch (no force-dynamic ni nada por el estilo): el layout raíz
  // envuelve TODA página, incluidas las que sí se pre-renderizan en build
  // (ej. /_not-found) — en ese momento el volumen con la base de datos
  // (/data) todavía no está montado en Railway, así que esta consulta
  // fallaría y tiraría abajo el build entero. El contactPoint del JSON-LD
  // es un enriquecimiento, no algo crítico: si falla, se omite sin más.
  const settings = await getSiteSettings().catch(() => null);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "AdvertisingAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "Pinky. The Fit Agency",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/pinky-agency-white.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2010",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gabriel Pereira 2828",
      addressLocality: "Montevideo",
      addressCountry: "UY",
    },
    sameAs: [
      "https://www.instagram.com/pinkyuy/",
      "https://www.linkedin.com/company/pinkyuy/",
      "https://www.youtube.com/user/pinkyComUy",
    ],
    ...(settings
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: settings.phone1,
            email: settings.email,
            contactType: "customer service",
          },
        }
      : {}),
  };

  // Qué sitio es (auditoría SEO: además de quién es la empresa). Sin
  // SearchAction: el sitio no tiene buscador interno.
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Pinky. The Fit Agency",
    alternateName: "Pinky",
    description: SITE_DESCRIPTION,
    inLanguage: "es-UY",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <html lang="es-UY" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

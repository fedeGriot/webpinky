import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — Pinky` },
  description: SITE_DESCRIPTION,
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
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "AdvertisingAgency",
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

  return (
    <html lang="es-UY" className={`${poppins.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">
        <JsonLd data={organizationJsonLd} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

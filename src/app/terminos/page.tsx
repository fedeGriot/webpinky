import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso del sitio web de Pinky, The Fit Agency.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/terminos" },
};

// Ver nota en src/app/contacto/page.tsx: SiteNav/SiteFooter consultan la
// base, y en build time (Railway) el volumen persistente todavía no está
// montado.
export const dynamic = "force-dynamic";

export default async function TerminosPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteNav />
      <main>
        <section className="px-6 py-20 sm:px-14 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Legal</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              Términos y condiciones
            </h1>
            <p className="mt-4 text-sm text-white/40">Última actualización: agosto de 2026.</p>

            <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed text-white/70">
              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">1. Aceptación de los términos</h2>
                <p>
                  Al acceder y utilizar este sitio web, propiedad de Pinky, The Fit Agency ({settings?.address}),
                  aceptás los presentes términos y condiciones. Si no estás de acuerdo con alguno de ellos, te
                  pedimos que no continúes utilizando el sitio.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">2. Uso del sitio</h2>
                <p>
                  Este sitio tiene como objetivo brindar información sobre los servicios de Pinky y permitir el
                  contacto con potenciales clientes. Te comprometés a utilizarlo de forma lícita, sin afectar su
                  disponibilidad ni el uso que otras personas puedan hacer de él, y sin intentar acceder a áreas
                  restringidas o vulnerar su seguridad.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">3. Propiedad intelectual</h2>
                <p>
                  Los textos, imágenes, logotipos, diseños y demás contenidos publicados en este sitio son
                  propiedad de Pinky o de sus clientes, y están protegidos por las leyes de propiedad intelectual
                  vigentes. No está permitida su reproducción, distribución o uso comercial sin autorización
                  previa por escrito.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">4. Enlaces a sitios de terceros</h2>
                <p>
                  Este sitio puede incluir enlaces a redes sociales u otros sitios de terceros. Pinky no se
                  responsabiliza por el contenido, las políticas de privacidad ni las prácticas de esos sitios
                  externos.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">5. Limitación de responsabilidad</h2>
                <p>
                  Hacemos lo posible para que la información publicada sea precisa y esté actualizada, pero no
                  garantizamos la ausencia de errores. El uso de este sitio es bajo tu propia responsabilidad y
                  Pinky no será responsable por daños derivados de su uso.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">6. Modificaciones</h2>
                <p>
                  Podemos actualizar estos términos en cualquier momento para reflejar cambios en el sitio o en
                  la normativa aplicable. La versión vigente será siempre la publicada en esta página.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">7. Ley aplicable</h2>
                <p>
                  Estos términos se rigen por las leyes de la República Oriental del Uruguay. Cualquier
                  controversia relacionada con el uso de este sitio se someterá a los tribunales competentes de
                  Montevideo.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">8. Contacto</h2>
                <p>
                  Ante cualquier consulta sobre estos términos, podés escribirnos a{" "}
                  <a href={`mailto:${settings?.email}`} className="text-accent hover:text-white">
                    {settings?.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

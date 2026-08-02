import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Pinky, The Fit Agency recopila, usa y protege tus datos personales.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacidad" },
};

// Ver nota en src/app/contacto/page.tsx: SiteNav/SiteFooter consultan la
// base, y en build time (Railway) el volumen persistente todavía no está
// montado.
export const dynamic = "force-dynamic";

export default async function PrivacidadPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteNav />
      <main>
        <section className="px-6 py-20 sm:px-14 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Legal</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              Política de privacidad
            </h1>
            <p className="mt-4 text-sm text-white/40">Última actualización: agosto de 2026.</p>

            <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed text-white/70">
              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">1. Qué información recopilamos</h2>
                <p>
                  Cuando completás el formulario de contacto de este sitio, recopilamos los datos que nos
                  proporcionás voluntariamente: nombre y apellido, email, teléfono, empresa, sitio web y cargo.
                  No recopilamos datos sensibles ni información de navegación más allá de lo necesario para el
                  funcionamiento básico del sitio.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">2. Para qué usamos tu información</h2>
                <p>
                  Usamos estos datos exclusivamente para responder tu consulta, coordinar una reunión y
                  evaluar una eventual propuesta de trabajo conjunto. No utilizamos tu información para fines
                  distintos a los que motivaron el contacto.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">3. Con quién compartimos tu información</h2>
                <p>
                  No vendemos, alquilamos ni compartimos tus datos personales con terceros ajenos a Pinky, salvo
                  que sea necesario para prestar el servicio solicitado (por ejemplo, herramientas de correo
                  electrónico que utilizamos para gestionar las consultas) o que la ley nos obligue a hacerlo.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">4. Cookies</h2>
                <p>
                  Este sitio puede utilizar cookies técnicas necesarias para su correcto funcionamiento. No
                  utilizamos cookies de seguimiento publicitario de terceros.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">5. Seguridad de la información</h2>
                <p>
                  Adoptamos medidas razonables para proteger tus datos personales contra accesos no autorizados,
                  pérdida o alteración. Sin embargo, ningún sistema es completamente infalible, y no podemos
                  garantizar la seguridad absoluta de la información transmitida por internet.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">6. Tus derechos</h2>
                <p>
                  De acuerdo con la Ley N.º 18.331 de Protección de Datos Personales de la República Oriental
                  del Uruguay, tenés derecho a acceder, rectificar y solicitar la eliminación de tus datos
                  personales en cualquier momento. Para ejercer estos derechos, podés escribirnos a{" "}
                  <a href={`mailto:${settings?.email}`} className="text-accent hover:text-white">
                    {settings?.email}
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">7. Cambios a esta política</h2>
                <p>
                  Podemos actualizar esta política de privacidad periódicamente. La versión vigente será siempre
                  la publicada en esta página.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-extrabold text-white">8. Contacto</h2>
                <p>
                  Ante cualquier consulta sobre el tratamiento de tus datos personales, podés escribirnos a{" "}
                  <a href={`mailto:${settings?.email}`} className="text-accent hover:text-white">
                    {settings?.email}
                  </a>{" "}
                  o comunicarte al {settings?.phone1}.
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

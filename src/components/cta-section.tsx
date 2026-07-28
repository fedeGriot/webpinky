import { getSiteSettings } from "@/lib/data";

export async function CtaSection({
  eyebrow,
  titleLine1,
  titleAccent,
}: {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
}) {
  const settings = await getSiteSettings();

  return (
    <section id="contacto" className="relative overflow-hidden px-6 py-24 text-center sm:px-14">
      <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white/40">{eyebrow}</p>
      <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
        {titleLine1} <span className="text-accent">{titleAccent}</span>
      </h2>
      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href="mailto:hola@pinky.com.uy?subject=Quiero%20hablar%20con%20Pinky"
          className="rounded-full bg-accent px-8 py-4 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          Solicitá una reunión →
        </a>
        {settings && (
          <p className="text-sm text-white/50">
            o escribinos a{" "}
            <a href={`mailto:${settings.email}`} className="font-semibold text-white/70 hover:text-white">
              {settings.email}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

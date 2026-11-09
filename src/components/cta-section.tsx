import { Reveal } from "@/components/reveal";
import { FillButton } from "@/components/fill-button";
import { SectionEyebrow } from "@/components/section-eyebrow";

export function CtaSection({
  eyebrow,
  titleLine1,
  titleAccent,
  body,
  spacingClassName = "pb-24 pt-14",
}: {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  /** Texto opcional debajo del título (ej. qué pasa después del contacto). */
  body?: string;
  spacingClassName?: string;
}) {
  return (
    <section
      id="contacto"
      className={`relative overflow-hidden px-6 text-center sm:px-14 ${spacingClassName}`}
    >
      <Reveal>
        <SectionEyebrow className="mb-4">{eyebrow}</SectionEyebrow>
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          {titleLine1} <span className="text-accent">{titleAccent}</span>
        </h2>
        {body && <p className="mx-auto mt-6 max-w-xl text-lg text-white">{body}</p>}
        <div className="mt-8 flex justify-center">
          <FillButton href="/contacto" className="bg-accent px-8 py-4 text-sm">
            Solicitá una reunión →
          </FillButton>
        </div>
      </Reveal>
    </section>
  );
}

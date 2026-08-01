import { Reveal } from "@/components/reveal";
import { FillButton } from "@/components/fill-button";

export function CtaSection({
  eyebrow,
  titleLine1,
  titleAccent,
  spacingClassName = "pb-24 pt-14",
}: {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  spacingClassName?: string;
}) {
  return (
    <section
      id="contacto"
      className={`relative overflow-hidden px-6 text-center sm:px-14 ${spacingClassName}`}
    >
      <Reveal>
        <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white/40">{eyebrow}</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          {titleLine1} <span className="text-accent">{titleAccent}</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <FillButton href="/contacto" className="bg-accent px-8 py-4 text-sm">
            Solicitá una reunión →
          </FillButton>
        </div>
      </Reveal>
    </section>
  );
}

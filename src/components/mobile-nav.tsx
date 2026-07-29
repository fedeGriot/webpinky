"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

export function MobileNav({ links, active }: { links: NavLink[]; active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-[2px] w-6 rounded-full bg-white transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[73px] z-40 bg-ink transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-7 px-6">
          {links.map((link, i) => {
            const key = link.href === "/" ? "home" : link.href.replace("/", "");
            const isActive = active === key;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-3xl font-extrabold transition-all duration-300 ${
                  isActive ? "text-accent" : "text-white"
                } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

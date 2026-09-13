import type { ReactNode } from "react";

/** Titled page section and anchor target. */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-6 last:mb-0 lg:mb-24 lg:scroll-mt-12">
      <h2 className="mb-8 border-b border-border pb-2 text-sm font-bold tracking-widest uppercase">{title}</h2>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  );
}

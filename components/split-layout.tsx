import type { ReactNode } from "react";

/** 2 columns on wide screens with a sticky sidebar; one column on narrow screens. */
export function SplitLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 wrap-break-word sm:px-12 lg:flex lg:gap-16 lg:px-24 lg:py-0">
      <header className="lg:sticky lg:top-0 lg:h-screen lg:w-2/5 lg:shrink-0 lg:overflow-y-auto lg:py-16 lg:[scrollbar-width:none]">
        {sidebar}
      </header>
      <main className="min-w-0 pt-16 lg:w-3/5 lg:py-16">{children}</main>
    </div>
  );
}

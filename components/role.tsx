import type { ReactNode } from "react";

/** Team, position, or degree within an Organization. */
export function Role({ title, dates, children }: { title: string; dates?: string; children?: ReactNode }) {
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
        <h4 className="font-medium">{title}</h4>
        {dates && <p className="text-sm text-muted lg:shrink-0">{dates}</p>}
      </div>
      {children && <div className="mt-2 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

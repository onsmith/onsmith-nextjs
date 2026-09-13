import type { ReactNode } from "react";

/** Employer or school with optional location and date range. */
export function Organization({
  name,
  location,
  dates,
  children,
}: {
  name: string;
  location?: string;
  dates?: string;
  children?: ReactNode;
}) {
  return (
    <article>
      <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
        <h3 className="text-lg font-semibold">
          {name}
          {location && <span className="font-normal text-muted">, {location}</span>}
        </h3>
        {dates && <p className="text-sm text-muted lg:shrink-0">{dates}</p>}
      </div>
      {children && <div className="mt-4 flex flex-col gap-6">{children}</div>}
    </article>
  );
}

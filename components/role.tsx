import type { ReactNode } from "react";

/** Position or degree within an Organization. */
export function Role({
  title,
  team,
  location,
  dates,
  children,
}: {
  title: string;
  team?: string;
  location?: string;
  dates?: string;
  children?: ReactNode;
}) {
  const details = [location, dates].filter(Boolean).join(" · ");
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
        <h4 className="font-medium">{team ? `${team} — ${title}` : title}</h4>
        {details && <p className="text-sm text-muted lg:shrink-0">{details}</p>}
      </div>
      {children && <div className="mt-2 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

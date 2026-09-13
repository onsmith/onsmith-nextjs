import type { ReactNode } from "react";
import { MapPinIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

/** Identity block: headshot, name, role, location, contact links with the toggle, summary, and section links. */
export function Profile({
  name,
  role,
  location,
  headshot,
  summary,
  contacts,
  nav,
}: {
  name: string;
  role: string;
  location: string;
  headshot: string;
  summary: string;
  contacts: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
        <img
          src={headshot}
          alt={`Headshot of ${name}`}
          width={480}
          height={480}
          className="size-16 shrink-0 rounded-full lg:size-40"
        />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">{name}</h1>
          <p className="mt-1 text-lg font-medium lg:mt-3 lg:text-xl">{role}</p>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-muted">
        <MapPinIcon className="size-4 shrink-0" />
        {location}
      </p>
      <div className="flex items-center gap-4">
        {contacts}
        <ThemeToggle />
      </div>
      <p className="max-w-md leading-relaxed">{summary}</p>
      {nav}
    </div>
  );
}

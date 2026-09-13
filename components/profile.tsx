import type { ReactNode } from "react";
import { FileIcon, MapPinIcon } from "@/components/icons";

/** Identity block: headshot, name, role, location, contact links, summary, resume button, and section links. */
export function Profile({
  name,
  role,
  location,
  headshot,
  summary,
  contacts,
  resume,
  nav,
}: {
  name: string;
  role: string;
  location: string;
  headshot: string;
  summary: string;
  contacts: ReactNode;
  resume: string;
  nav?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:gap-4">
      <div className="flex flex-col items-start gap-4 lg:gap-6">
        <img
          src={headshot}
          alt={`Headshot of ${name}`}
          width={480}
          height={480}
          className="size-24 rounded-full lg:size-40"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{name}</h1>
          <p className="mt-2 text-lg font-medium lg:mt-3 lg:text-xl">{role}</p>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-muted">
        <MapPinIcon className="size-4 shrink-0" />
        {location}
      </p>
      {contacts}
      <p className="max-w-md leading-relaxed">{summary}</p>
      <a
        href={resume}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-muted px-3 py-2 text-sm font-semibold text-fg hover:bg-surface hover:no-underline"
      >
        <FileIcon className="size-4" />
        Resume
      </a>
      {nav}
    </div>
  );
}

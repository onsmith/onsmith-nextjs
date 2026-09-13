import type { ReactNode } from "react";

/** Optional summary line followed by a bullet list. Children must be `<li>` elements, which may contain links. */
export function Highlights({ summary, children }: { summary?: ReactNode; children?: ReactNode }) {
  return (
    <div className="leading-relaxed">
      {summary && <p>{summary}</p>}
      {children && <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-muted">{children}</ul>}
    </div>
  );
}

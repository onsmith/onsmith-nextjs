/** In-page links to sections; hidden on narrow screens. */
export function SectionNav({ sections }: { sections: { id: string; title: string }[] }) {
  return (
    <nav aria-label="Sections" className="mt-8 hidden lg:block">
      <ul className="flex flex-col gap-3">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-sm font-semibold tracking-widest text-muted uppercase hover:text-fg">
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

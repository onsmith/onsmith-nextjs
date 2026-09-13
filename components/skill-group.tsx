/** Labeled list of skills. */
export function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted">{label}</h3>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="rounded-full bg-surface px-3 py-1 text-sm">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

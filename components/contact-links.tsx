import { EmailLink } from "@/components/email-link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { decodeEmail } from "@/lib/email";

/** Icon links to LinkedIn, GitHub, and email, plus the no-JavaScript email fallback. `email` is the output of `encodeEmail`. */
export function ContactLinks({ linkedin, github, email }: { linkedin: string; github: string; email: string }) {
  const address = decodeEmail(email);
  const domainStart = address.lastIndexOf("@") + 1;
  return (
    <div>
      <ul className="flex items-center gap-4">
        <li>
          <a href={linkedin} aria-label="LinkedIn" className="flex text-logo hover:opacity-70">
            <LinkedInIcon className="size-6" />
          </a>
        </li>
        <li>
          <a href={github} aria-label="GitHub" className="flex text-logo hover:opacity-70">
            <GitHubIcon className="size-6" />
          </a>
        </li>
        <li>
          <EmailLink address={address} />
        </li>
      </ul>
      <noscript>
        <p id="email" className="mt-2 text-sm">
          {address.slice(0, domainStart)}
          <span className="hidden">mail.</span>
          {address.slice(domainStart)}
        </p>
      </noscript>
    </div>
  );
}

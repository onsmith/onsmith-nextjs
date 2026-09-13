import { useEffect, useState } from "react";
import { MailIcon } from "@/components/icons";

/** Email icon link that points at the address only after hydration, and at `#email` before. */
export function EmailLink({ address }: { address: string }) {
  const [href, setHref] = useState("#email");
  useEffect(() => {
    setHref(`mailto:${address}`);
  }, [address]);
  return (
    <a href={href} aria-label="Email" className="flex">
      <MailIcon className="size-6" />
    </a>
  );
}

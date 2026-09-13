import { MoonIcon, SunIcon } from "@/components/icons";

/** Light and dark theme toggle, handled by the inline theme script and shown only when JavaScript runs. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      data-theme-toggle=""
      aria-label="Toggle dark theme"
      className="hidden size-9 cursor-pointer items-center justify-center rounded-md text-muted hover:text-fg js:inline-flex"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </button>
  );
}

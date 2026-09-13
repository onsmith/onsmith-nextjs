/** Source of the inline <head> script that applies the stored theme and handles toggle clicks. */
export const themeScript = `(${applyTheme})()`;

// Serialized with Function.prototype.toString, so it may reference only document, localStorage, and matchMedia.
function applyTheme() {
  const root = document.documentElement;
  root.setAttribute("data-js", "");
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    }
  } catch {}
  document.addEventListener("click", (event) => {
    const target = event.target as Element | null;
    if (!target?.closest?.("[data-theme-toggle]")) {
      return;
    }
    const current =
      root.getAttribute("data-theme") ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  });
}

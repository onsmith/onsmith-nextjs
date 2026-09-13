import assert from "node:assert/strict";
import test from "node:test";
import { themeScript } from "./theme.ts";

type Setup = {
  stored?: string;
  dark?: boolean;
  readThrows?: boolean;
  writeThrows?: boolean;
  click?: "toggle" | "outside";
};

function run({ stored, dark = false, readThrows = false, writeThrows = false, click }: Setup) {
  const attributes = new Map<string, string>();
  const storage = new Map<string, string>();
  if (stored !== undefined) {
    storage.set("theme", stored);
  }
  let onClick: ((event: unknown) => void) | undefined;

  const document = {
    documentElement: {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) => void attributes.set(name, value),
    },
    addEventListener: (type: string, listener: (event: unknown) => void) => {
      if (type === "click") {
        onClick = listener;
      }
    },
  };
  const localStorage = {
    getItem: (key: string) => {
      if (readThrows) throw new Error("storage blocked");
      return storage.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (writeThrows) throw new Error("storage blocked");
      storage.set(key, value);
    },
  };
  const matchMedia = (query: string) => ({ matches: dark && query === "(prefers-color-scheme: dark)" });

  new Function("document", "localStorage", "matchMedia", themeScript)(document, localStorage, matchMedia);
  if (click) {
    const target = {
      closest: (selector: string) => (click === "toggle" && selector === "[data-theme-toggle]" ? target : null),
    };
    onClick?.({ target });
  }
  return { theme: attributes.get("data-theme"), js: attributes.has("data-js"), saved: storage.get("theme") };
}

const cases: { name: string; setup: Setup; theme?: string; saved?: string }[] = [
  { name: "stored dark applies dark", setup: { stored: "dark" }, theme: "dark", saved: "dark" },
  { name: "stored unknown value is ignored", setup: { stored: "blue" }, theme: undefined, saved: "blue" },
  { name: "failed storage read applies nothing", setup: { readThrows: true }, theme: undefined },
  { name: "click with nothing stored and a dark OS stores light", setup: { dark: true, click: "toggle" }, theme: "light", saved: "light" },
  { name: "click with stored light on a dark OS stores dark", setup: { stored: "light", dark: true, click: "toggle" }, theme: "dark", saved: "dark" },
  { name: "click still flips the theme when storage writes fail", setup: { writeThrows: true, click: "toggle" }, theme: "dark" },
  { name: "click outside the toggle changes nothing", setup: { stored: "dark", click: "outside" }, theme: "dark", saved: "dark" },
];

for (const { name, setup, theme, saved } of cases) {
  test(`themeScript: ${name}`, () => {
    const result = run(setup);
    assert.equal(result.js, true);
    assert.equal(result.theme, theme);
    assert.equal(result.saved, saved);
  });
}

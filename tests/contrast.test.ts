import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../styles/globals.css", import.meta.url), "utf8");

function tokens(blockStart: string): Map<string, string> {
  const start = css.indexOf(blockStart);
  assert.notEqual(start, -1, `styles/globals.css has no "${blockStart}" block`);
  const block = css.slice(start, css.indexOf("}", start));
  return new Map(Array.from(block.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6});/gi), ([, name, hex]) => [name, hex]));
}

// WCAG 2.2 relative luminance: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const themes = [
  ["light", tokens("@theme {")],
  ["dark", tokens("@variant dark {")],
] as const;

for (const [theme, colors] of themes) {
  for (const text of ["fg", "muted", "accent"]) {
    for (const background of ["bg", "surface"]) {
      test(`${theme} ${text} on ${background} meets 4.5:1`, () => {
        const foregroundHex = colors.get(text);
        const backgroundHex = colors.get(background);
        assert.ok(foregroundHex && backgroundHex, `missing --color-${text} or --color-${background}`);
        assert.ok(contrast(foregroundHex, backgroundHex) >= 4.5);
      });
    }
  }
}

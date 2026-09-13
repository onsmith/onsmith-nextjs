# onsmith.com

The source for [www.onsmith.com](https://www.onsmith.com), a single static page built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com) and served by [GitHub Pages](https://pages.github.com).

## Setup

Install [Node.js 24](https://nodejs.org), then run `npm ci` to install the locked dependencies.

## Edit content

All page text lives in [pages/index.tsx](pages/index.tsx), written as JSX elements in the same order as the resume.

- To add a role, copy a `<Role>` element inside the matching `<Organization>` and edit its props and bullets.
- To change the email address, edit the plain address in `getStaticProps`. The page ships it only in encoded form.

## Preview

`npm run dev` serves the page at http://localhost:3000 and reloads it on every edit.

To preview the exact files that deploy, build the site and serve the `out/` folder:

```bash
npm run build
npm run check
python3 -m http.server --directory out
```

Then open http://localhost:8000.

## Update the resume

1. Build the resume from LaTeX with the phone number and email address removed.
2. Replace `public/resume.pdf` with the new PDF.
3. Copy any changed bullets into `pages/index.tsx`.
4. Run `npm run build` and `npm run check`. The check fails if the PDF's links or metadata contain an email address or phone number, but it cannot read the PDF's visible text, so open the PDF and confirm neither appears.

## Deploy

Pushing to `main` runs the [deploy workflow](.github/workflows/ghpages-deploy.yml). It runs the unit tests, builds the site, runs the output check, and publishes `out/` to the `gh-pages` branch, which GitHub Pages serves. If any step fails, the workflow stops before publishing and the current site stays up.

To roll back a bad deploy, revert its commit on `gh-pages` and push, then commit the fix to `main`.

## Checks

- `npm test` runs unit tests for the email encoding, the theme script, and color contrast.
- `npm run check` scans the build output for email addresses, phone numbers, image location metadata, and a missing or misplaced theme script.

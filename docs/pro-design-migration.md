# Pro design migration

Goal: make pastaui.com look and feel like pro.pastaui.com. Same shell, same tokens, same page
anatomy. Free stays free: no auth, no gating, MIT, GitHub link, and a Get Pro card instead of an
upgrade card.

## Target

- **Shell.** Dark sidebar on the left (brand, theme toggle, quick links, grouped nav, footer card),
  content in an inset rounded scroll area on the right. Mobile gets the brand menu, search button,
  and a drawer. Same markup and classes as Pro's `landing-shell.tsx`.
- **Tokens.** Manrope, Pro colour scale (shell, surface, code tray tokens), typography utilities
  (`heading-text-*`, `paragraph-text-*`, `card-text-*`, `sidebar-text-*`). Keep `card-heading` and
  `metadata-label` because the AI components use them.
- **Home.** A grid of component tiles with live inline previews, no hero, no marketing sections.
- **Component page.** Pro's variant page anatomy: name and description row, preview frame, then
  Usage, Install, Source, and Props sections using the tray and code panel styles.
- **Installation.** Pro's numbered steps with `InstallPanel` and `CodePanel`.
- **Search.** Pro's command palette with grouped results and keyboard navigation.
- **Motion.** Router view transitions with the scoped content fade.

## Keep

- URLs: `/`, `/docs/installation`, `/docs/component/<slug>`, marketing pages, redirects, llms.txt,
  sitemap, robots.
- The AI component sources, previews, catalog, and registry build.
- A dev-only editor in the bottom-right corner. It is now Pro's design inspector, ported to
  `src/site/dev`, replacing the old page editor. It is excluded from production builds.

## Phases

1. Foundation: styles, theme provider and toggle, logo mark, focus ring, code panels, package
   managers helper. Add `@fontsource-variable/manrope`.
2. Shell: landing shell, sidebar nav, brand menu, sidebar footer, search palette and index,
   pathless `_shell` layout route.
3. Pages: home grid, component page, installation page, marketing pages, 404.
4. Cleanup: delete the old header, hero, footer, docs layout, pro CTA, showcase, example tabs and
   installation card. Update sitemap and llms.txt if paths change. Run `pnpm check`.

## Done when

`pnpm typecheck`, `pnpm lint`, and `pnpm format:check` pass, every route renders inside the shell,
and no file under `src/components/landing` or the old docs layout remains.

## Status (2026-09-29)

All four phases are in. `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass. `pnpm format:check`
still fails on files that were already unformatted before the migration; none of the new files are
in that list.

Not yet checked in a browser:

- Home tiles render each preview inline inside a 16:10 frame. Large previews such as the research
  report and AI sidebar are clipped by the frame. If that looks wrong, swap those tiles for a
  screenshot or a scaled iframe like Pro's category grid.
- The mobile drawer and search palette were ported unchanged from Pro and should behave the same.

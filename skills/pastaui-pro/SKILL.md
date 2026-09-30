---
name: pastaui-pro
description: Sign up for Pasta UI Pro and install its premium React blocks and components with the shadcn CLI. Use when the user wants to add a Pasta UI Pro block (hero, pricing, FAQ, dashboard and more), set up the @pastaui-pro registry, or fix a registry install error.
---

# Pasta UI Pro

Pasta UI Pro is a paid library of React 19 + Tailwind CSS v4 blocks and components. They install as editable source code through a private shadcn registry, authenticated with a personal token.

## Rules for agents

- You cannot sign in, pay or create a token for the user. Ask them to do those steps in their browser, then continue.
- Never print, log or commit the token. It belongs in `.env.local` only, and `.env.local` must be gitignored.
- Install only the items the user asked for, using the exact names listed below.

## 1. Sign up

1. Open https://pro.pastaui.com/sign-in and continue with Google.
2. Choose a plan at https://pro.pastaui.com/pricing:
   - Annual: $149 / year (Updates while active)
   - Lifetime: $199 once (Pay once, keep it forever)
3. Complete checkout. Access is active as soon as payment succeeds.

One license covers one person, for unlimited personal and commercial projects. Terms: https://pro.pastaui.com/terms

## 2. Create a registry token

1. Open https://pro.pastaui.com/account while signed in.
2. Under Registry access, create a token and copy it. It is shown once.
3. If a token leaks, regenerate it on the same page.

## 3. Set up the project

The project needs React and Tailwind CSS. If `components.json` does not exist yet, initialise shadcn first:

```bash
pnpm dlx shadcn@latest init
```

Add the token to `.env.local` (create the file if needed):

```bash
PASTAUI_PRO_TOKEN=pastaui_pro_xxxxxxxxxxxx
```

Register the private registry in `components.json`, merging with any existing `registries` key:

```json
{
  "registries": {
    "@pastaui-pro": {
      "url": "https://pro.pastaui.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${PASTAUI_PRO_TOKEN}"
      }
    }
  }
}
```

The shadcn CLI reads `PASTAUI_PRO_TOKEN` from the environment and sends it with every request.

## 4. Install a component

```bash
pnpm dlx shadcn@latest add @pastaui-pro/<name>
```

Other package managers:

```bash
npx shadcn@latest add @pastaui-pro/<name>
yarn dlx shadcn@latest add @pastaui-pro/<name>
bunx --bun shadcn@latest add @pastaui-pro/<name>
```

Several items at once:

```bash
pnpm dlx shadcn@latest add @pastaui-pro/hero-section-01 @pastaui-pro/pricing-card-02
```

Files are written into the project under `components/` (blocks in `components/blocks/`). Import them and edit freely; the source is the user's to change.

## Troubleshooting

- **401 Missing registry token**: `PASTAUI_PRO_TOKEN` is not set. Check `.env.local` and restart the terminal or dev server.
- **401 Invalid registry token**: the token was revoked or mistyped. Create a new one at https://pro.pastaui.com/account.
- **403 Plan not active**: the plan expired or was cancelled. Renew at https://pro.pastaui.com/pricing.
- **404 No item named …**: the name is wrong. Use a name from the list below.
- **429 Too many requests**: the registry allows 120 requests a minute per token. Wait a minute and retry.

Still stuck: email hello@pastaui.com, or see https://pro.pastaui.com/installation.

## Installable items

Install with `@pastaui-pro/<name>` using any name below. Browse previews at https://pro.pastaui.com.

### Blocks
- Cards: `cards-02`, `cards-01`
- Testimonials: `testimonial-02`, `testimonial-section`
- Pricing Card: `pricing-card-04`, `pricing-card-03`, `pricing-card-02`
- Bento Grid: `bento-grid-06`, `bento-grid-05`, `bento-grid-04`, `bento-grid-03`, `bento-grid-02`, `bento-grid-01`
- Changelog: `changelog-02`, `changelog-01`
- Comparison: `comparison-05`, `comparison-04`, `comparison-03`, `comparison-02`, `comparison-01`
- Contact: `contact-06`, `contact-05`, `contact-04`, `contact-03`, `contact-02`, `contact-01`
- Call to Action: `cta-03`, `cta-02`, `cta-01`
- Dashboard: `dashboard-02`, `dashboard-01`
- Footer: `footer-06`, `footer-05`, `footer-04`, `footer-03`, `footer-02`, `footer-01`
- FAQ: `faq-05`, `faq-04`, `faq-03`, `faq-02`, `faq-01`
- How It Works: `how-it-works-03`, `how-it-works-02`, `how-it-works-01`
- Integrations: `integrations-03`, `integrations-02`, `integrations-01`
- Logo Cloud: `logo-cloud-01`
- 404: `not-found-04`, `not-found-03`, `not-found-02`, `not-found-01`
- Features: `features-03`, `features-02`
- Navbar: `navbar-03`, `navbar-02`, `navbar-01`
- Sidebar: `sidebar-01`
- Sign In: `sign-in-03`, `sign-in-02`, `sign-in-01`
- Stats: `stats-04`, `stats-03`, `stats-02`
- Table: `table-01`
- Team: `team-05`, `team-04`, `team-03`, `team-02`, `team-01`
- Waitlist: `waitlist-03`, `waitlist-02`, `waitlist-01`
- Hero Sections: `hero-section-15`, `hero-section-14`, `hero-section-13`, `hero-section-12`, `hero-section-11`, `hero-section-10`, `hero-section-09`, `hero-section-08`, `hero-section-07`, `hero-section-06`, `hero-section-05`, `hero-section-04`, `hero-section-03`, `hero-section-02`, `hero-section-01`
- Backgrounds: `background-08`, `background-07`, `background-06`, `background-05`, `background-04`, `background-03`, `background-02`, `background-01`

### AI
- Agent Workspace: `agent-01`
- Composers: `composer-glow`
- Chat: `chat-01`
- Image generation: `image-gen-01`

### Components
- Fan Gallery: `fan-gallery`
- Usage Limits Card: `usage-limits-card`
- Context Usage Card: `context-usage-card`
- Agent Composer: `agent-composer`
- Infinite Gallery: `infinite-gallery`
- Endless Carousel: `endless-carousel`
- Orbit Gallery: `orbit-gallery`
- Marquee: `marquee`
- Cards Stack: `cards-stack`
- Masonry Grid: `masonry-grid`
- Notification Stack: `notification-stack`
- Status Badge: `status-badge`
- Todo List: `todo-list`

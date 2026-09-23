import { githubUrl } from '#/lib/seo'

export interface MarketingPageContent {
  actionHref: string
  actionLabel: string
  description: string
  eyebrow: string
  title: string
}

export const marketingPages: Record<string, MarketingPageContent> = {
  blocks: {
    actionHref: '/docs/component',
    actionLabel: 'Explore components',
    description:
      'Production-ready application sections composed from Pasta UI components are currently in development.',
    eyebrow: 'Blocks',
    title: 'Complete interface sections are coming.',
  },
  charts: {
    actionHref: '/docs/component',
    actionLabel: 'Explore components',
    description:
      'Chart primitives and complete analytical views are being refined for a future release.',
    eyebrow: 'Charts',
    title: 'Clear data without visual noise.',
  },
  templates: {
    actionHref: '/docs/component',
    actionLabel: 'Browse components',
    description:
      'Full product templates built with the same component system are currently in development.',
    eyebrow: 'Templates',
    title: 'A stronger starting point is coming.',
  },
  changelog: {
    actionHref: '/docs/component',
    actionLabel: 'Browse components',
    description: 'Release notes will appear here as the public component library evolves.',
    eyebrow: 'Changelog',
    title: 'Follow what changes.',
  },
  about: {
    actionHref: '/docs/component',
    actionLabel: 'Explore the library',
    description:
      'Pasta UI is an open-source collection of polished React components designed to be copied, adapted, and owned.',
    eyebrow: 'About',
    title: 'Components made for real products.',
  },
  license: {
    actionHref: githubUrl,
    actionLabel: 'View on GitHub',
    description:
      'The public Pasta UI component library is open source under the MIT License. Pro assets will include separate commercial terms.',
    eyebrow: 'License',
    title: 'Clear terms for every component.',
  },
  contact: {
    actionHref: githubUrl,
    actionLabel: 'Open GitHub',
    description:
      'Use the GitHub repository for component requests, bug reports, and project discussions.',
    eyebrow: 'Contact',
    title: 'Start a conversation.',
  },
  privacy: {
    actionHref: '/',
    actionLabel: 'Back to home',
    description:
      'The privacy policy is being prepared ahead of the public launch. Pasta UI does not currently collect account or payment information.',
    eyebrow: 'Privacy',
    title: 'Privacy information.',
  },
  terms: {
    actionHref: '/',
    actionLabel: 'Back to home',
    description:
      'The terms of service are being prepared ahead of the public launch. The open-source library remains governed by its repository license.',
    eyebrow: 'Terms',
    title: 'Terms of service.',
  },
}

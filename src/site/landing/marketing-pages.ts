import { githubUrl } from '#/lib/seo'

export interface MarketingPageContent {
  actionHref: string
  actionLabel: string
  description: string
  eyebrow: string
  title: string
}

export const marketingPages: Record<string, MarketingPageContent> = {
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
  terms: {
    actionHref: '/',
    actionLabel: 'Back to home',
    description:
      'The terms of service are being prepared ahead of the public launch. The open-source library remains governed by its repository license.',
    eyebrow: 'Terms',
    title: 'Terms of service.',
  },
}

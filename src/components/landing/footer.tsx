import { githubUrl } from '#/lib/seo'

const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Components', href: '/docs/component' },
      { label: 'Blocks', href: '/blocks' },
      { label: 'Pro', href: 'https://pro.pastaui.com/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs/installation' },
      { label: 'GitHub', href: githubUrl },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'License', href: '/license' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="px-4 pt-16 pb-8 sm:px-6 lg:px-12 lg:pt-18">
      <div className="flex flex-col justify-between gap-14 md:flex-row">
        <div className="max-w-120">
          <h2 className="text-[32px] leading-9 font-normal">
            Build interfaces that
            <br />
            feel unmistakably yours.
          </h2>
          <p className="mt-4 max-w-98 text-base leading-6 text-muted-foreground">
            Open-source React components designed to be copied, composed, and made your own.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:gap-x-22">
          {footerGroups.map((group) => (
            <div className="flex min-w-30 flex-col gap-3.5" key={group.title}>
              <p className="text-[15px] leading-[22px] text-muted-foreground">{group.title}</p>
              {group.links.map((link) => (
                <a
                  className="text-[15px] leading-[22px] text-foreground/90 transition-colors hover:text-foreground"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 flex flex-col justify-between gap-4 text-sm leading-5 text-muted-foreground sm:flex-row sm:items-center">
        <p>© 2026 Pasta UI. Open source under the MIT License.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="transition-colors hover:text-foreground" href="/privacy">
            Privacy
          </a>
          <a className="transition-colors hover:text-foreground" href="/terms">
            Terms
          </a>
          <span>Built for the open web.</span>
        </div>
      </div>
    </footer>
  )
}

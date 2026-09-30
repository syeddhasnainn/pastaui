import { createFileRoute } from '@tanstack/react-router'

import {
  LegalEmail,
  LegalList as List,
  LegalPage,
  LegalParagraph as Paragraph,
  LegalSection as Section,
  LegalStrong as Strong,
  legalCompany,
} from '#/site/landing/legal-page'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/_shell/privacy')({
  head: () =>
    seo({
      title: `Privacy policy — ${siteName}`,
      description:
        'What data the Pasta UI website collects, why we use it, who we share it with and the rights you have over it.',
      path: '/privacy',
      type: 'article',
    }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <LegalPage
      intro="What the Pasta UI website collects when you visit it, why we use it, who we share it with and the rights you have over it."
      title="Privacy policy"
    >
      <Section number={1} title="Who we are">
        <Paragraph>
          Pasta UI is run by {legalCompany}, a company registered in the United Kingdom.{' '}
          {legalCompany} is the controller of your personal data under UK data protection law. You
          can reach us about anything in this policy at <LegalEmail />.
        </Paragraph>
      </Section>

      <Section number={2} title="What we collect">
        <List
          items={[
            <>
              <Strong>Usage data.</Strong> The pages you view, the site you came from, your browser
              and device details, your approximate location worked out from your IP address, and
              clicks on the page. We collect this with PostHog to understand how the site is used.
            </>,
            <>
              <Strong>Server logs.</Strong> Our hosting provider sees your IP address and basic
              request details whenever you load a page or install a component from the registry.
            </>,
            <>
              <Strong>Messages.</Strong> Anything you send us by email.
            </>,
          ]}
        />
        <Paragraph>
          The Pasta UI website has no accounts and takes no payments, so we hold no names, sign-in
          details or card details for it. We do not record your screen or your sessions.
        </Paragraph>
      </Section>

      <Section number={3} title="How we use it">
        <List
          items={[
            <>
              To see which components and docs people use, find problems and decide what to improve,
              which is in our legitimate interest.
            </>,
            <>
              To keep the site and the component registry secure and working, which is also in our
              legitimate interest.
            </>,
            <>To reply when you write to us.</>,
          ]}
        />
        <Paragraph>We never sell your personal data.</Paragraph>
      </Section>

      <Section number={4} title="Cookies and local storage">
        <List
          items={[
            <>
              <Strong>Analytics.</Strong> PostHog stores a random identifier in a cookie and in your
              browser&apos;s local storage so it can tell repeat visits apart. Its names begin with
              ph_. It does not contain your name or email address.
            </>,
            <>
              <Strong>Theme.</Strong> Remembers light or dark mode in local storage. It never leaves
              your device.
            </>,
            <>
              <Strong>Sidebar card.</Strong> Remembers that you dismissed the Pasta UI Pro card, in
              local storage.
            </>,
          ]}
        />
        <Paragraph>
          We don&apos;t use advertising cookies. You can clear or block the analytics cookie and
          local storage in your browser settings, or with a content blocker, and the site will keep
          working.
        </Paragraph>
      </Section>

      <Section number={5} title="Who we share it with">
        <Paragraph>
          We use a small number of providers who process data on our behalf and only as we instruct:
        </Paragraph>
        <List
          items={[
            <>
              <Strong>Cloudflare</Strong> hosts the site and the component files. Analytics requests
              pass through our own Cloudflare Worker on the way to PostHog.
            </>,
            <>
              <Strong>PostHog</Strong> stores and analyses the usage data, in the United States.
            </>,
            <>
              <Strong>Purelymail</Strong> handles our email.
            </>,
          ]}
        />
        <Paragraph>
          Some of these providers store data outside the UK, including in the United States. When
          they do, the transfer is protected by the safeguards UK law requires, such as the UK
          International Data Transfer Agreement or an adequacy decision.
        </Paragraph>
      </Section>

      <Section number={6} title="How long we keep it">
        <Paragraph>
          We keep usage data only for as long as it helps us understand how the site is used. We
          keep emails for as long as we need to answer you and handle any follow-up. Server logs are
          kept for a short time and then removed.
        </Paragraph>
      </Section>

      <Section number={7} title="Your rights">
        <Paragraph>Under UK data protection law you can ask us to:</Paragraph>
        <List
          items={[
            'Give you a copy of the personal data we hold about you.',
            'Correct anything that is wrong.',
            'Delete your data.',
            'Restrict or object to how we use it, including the analytics described above.',
            'Send your data to you or another service in a portable format.',
            'Withdraw any consent you gave, at any time.',
          ]}
        />
        <Paragraph>
          Email <LegalEmail /> to make a request. Because the analytics identifier is random, we may
          ask you to tell us which browser or device it came from so we can find your data.
        </Paragraph>
      </Section>

      <Section number={8} title="Children">
        <Paragraph>
          Pasta UI is a tool for developers and is not meant for children under 13. We do not
          knowingly collect data from them.
        </Paragraph>
      </Section>

      <Section number={9} title="Changes">
        <Paragraph>
          If we change this policy we will update the date at the top of this page.
        </Paragraph>
      </Section>
    </LegalPage>
  )
}

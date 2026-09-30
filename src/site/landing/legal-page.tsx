import type { ReactNode } from 'react'

import { headingClass } from '#/site/landing/variant-ui'
import { cn } from '#/lib/utils'

export const legalCompany = 'Mentign Ltd'
export const legalEmail = 'hello@pastaui.com'
export const legalUpdated = 'September 30, 2026'

export function LegalPage({
  children,
  intro,
  title,
}: {
  children: ReactNode
  intro: ReactNode
  title: string
}) {
  return (
    <article className="mx-auto w-full max-w-[608px] min-w-0 pb-16">
      <p className="sidebar-text-sm text-muted-foreground">Legal</p>
      <h1 className="mt-1 heading-text-sm font-medium text-foreground">{title}</h1>
      <p className="mt-2 max-w-xl paragraph-text-sm text-muted-foreground">
        {intro} Last updated {legalUpdated}.
      </p>
      {children}
    </article>
  )
}

export function LegalSection({
  children,
  number,
  title,
}: {
  children: ReactNode
  number: number
  title: string
}) {
  return (
    <section className="mt-9">
      <h2 className={cn('mb-1.5 flex items-center gap-2.5', headingClass)}>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[12px] font-[550] text-muted-foreground tabular-nums">
          {number}
        </span>
        {title}
      </h2>
      <div className="flex flex-col gap-3 pl-[34px]">{children}</div>
    </section>
  )
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p className="paragraph-text-sm text-pretty text-muted-foreground">{children}</p>
}

export function LegalStrong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground/85">{children}</span>
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <li
          className="relative pl-4 paragraph-text-sm text-pretty text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/60"
          key={index}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function LegalEmail() {
  return (
    <a className="underline underline-offset-4" href={`mailto:${legalEmail}`}>
      {legalEmail}
    </a>
  )
}

export const inkText = 'text-foreground'
export const mutedText = 'text-muted-foreground'
export const sectionClass = 'min-w-0'
export const sectionStackClass = 'flex flex-col gap-12 sm:gap-16'
export const headingClass = 'card-text-md font-[550] text-foreground'
export const iconButtonClass =
  'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-foreground/8 aria-pressed:text-foreground dark:aria-pressed:bg-foreground/12'
export const pillButtonClass =
  'flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-[14px] leading-none font-medium whitespace-nowrap transition-[background-color,box-shadow] motion-reduce:transition-none'
export const secondaryButtonClass = `${pillButtonClass} bg-background ${inkText} shadow-[0_0_0_0.5px_var(--code-control-border)] hover:bg-muted`
export const primaryButtonClass = `${pillButtonClass} bg-[oklch(62.6%_0.205_254.947)] text-white hover:bg-[oklch(55.6%_0.187_255.617)] dark:bg-[oklch(68%_0.173_253.301)] dark:text-[#0A0A0A] dark:hover:bg-[oklch(74%_0.15_251)]`

import MoonIcon from '~icons/solar/moon-bold'
import SunIcon from '~icons/solar/sun-2-bold'

import { focusRing } from '#/site/landing/focus-ring'
import { useResolvedTheme, useTheme } from '#/site/theme-provider'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function useThemeToggle() {
  const { setTheme } = useTheme()
  const resolved = useResolvedTheme()
  const label = resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  function toggleTheme() {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }

  return { label, toggleTheme }
}

export function ThemeToggle() {
  const { label, toggleTheme } = useThemeToggle()

  return (
    <Button
      aria-label={label}
      className="relative hidden! sm:inline-flex!"
      onClick={toggleTheme}
      size="icon-lg"
      title={label}
      variant="ghost"
    >
      <SunIcon
        aria-hidden="true"
        className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0"
      />
    </Button>
  )
}

export function SidebarThemeToggle({ className }: { className?: string }) {
  const { label, toggleTheme } = useThemeToggle()

  return (
    <button
      aria-label={label}
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color] hover:bg-muted hover:text-foreground motion-reduce:transition-none',
        focusRing,
        className,
      )}
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      <MoonIcon aria-hidden="true" className="size-4 dark:hidden" />
      <SunIcon aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  )
}

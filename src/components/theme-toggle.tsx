import MoonIcon from '~icons/solar/moon-linear'
import SunIcon from '~icons/solar/sun-2-linear'

import { useTheme } from '#/components/theme-provider'
import { Button } from '#/components/ui/button'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  function toggleTheme() {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }

  return (
    <Button
      aria-label="Toggle theme"
      className="relative hidden! sm:inline-flex!"
      onClick={toggleTheme}
      size="icon-lg"
      title="Toggle theme"
      variant="ghost"
    >
      <SunIcon className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

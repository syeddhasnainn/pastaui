import { ScriptOnce } from '@tanstack/react-router'
import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.style.colorScheme=r;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',r==='dark'?'#090909':'#ffffff')}catch(e){}})();`
}

const ThemeContext = React.createContext<Theme | undefined>(undefined)
const ThemeSetterContext = React.createContext<
  React.Dispatch<React.SetStateAction<Theme>> | undefined
>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  themeColor?.setAttribute('content', resolvedTheme === 'dark' ? '#090909' : '#ffffff')
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme

    const storedTheme = window.localStorage.getItem(storageKey)
    return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : defaultTheme
  })

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, theme)
    applyTheme(theme)
  }, [storageKey, theme])

  React.useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <ThemeContext value={theme}>
      <ThemeSetterContext value={setThemeState}>
        <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
        {children}
      </ThemeSetterContext>
    </ThemeContext>
  )
}

export function useTheme() {
  const theme = React.useContext(ThemeContext)
  const setTheme = React.useContext(ThemeSetterContext)

  if (!theme || !setTheme) throw new Error('useTheme must be used within a ThemeProvider')

  return { setTheme, theme }
}

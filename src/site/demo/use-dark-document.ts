import { useEffect } from 'react'

export function useDarkDocument() {
  useEffect(() => {
    const root = document.documentElement
    const hadLight = root.classList.contains('light')
    const previousScheme = root.style.colorScheme
    root.classList.remove('light')
    root.classList.add('dark')
    root.style.colorScheme = 'dark'

    return () => {
      root.classList.remove('dark')
      if (hadLight) root.classList.add('light')
      else root.classList.add('dark')
      root.style.colorScheme = previousScheme
    }
  }, [])
}

import { useEffect } from 'react'

export function ThemeSwitch() {
  // Theme switch removed - always using light theme
  // This component is kept for backward compatibility but does nothing
  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#fff')
  }, [])

  return null
}

import { createContext, useContext, useEffect } from 'react'

type ResolvedTheme = 'light'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  resolvedTheme: ResolvedTheme
  theme: ResolvedTheme
  setTheme: (theme: ResolvedTheme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  resolvedTheme: 'light',
  theme: 'light',
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement
    
    // Always apply light theme
    root.classList.remove('dark')
    root.classList.add('light')
  }, [])

  const setTheme = () => {
    // No-op - always light theme
  }

  const resetTheme = () => {
    // No-op - always light theme
  }

  const contextValue = {
    resolvedTheme: 'light' as ResolvedTheme,
    resetTheme,
    theme: 'light' as ResolvedTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

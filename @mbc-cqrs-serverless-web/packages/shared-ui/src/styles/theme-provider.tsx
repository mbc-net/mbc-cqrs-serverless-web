'use client'

import React, { createContext, useContext, type ReactNode } from 'react'

interface ThemeContextType {
	theme: 'light' | 'dark'
	setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
	children: ReactNode
	defaultTheme?: 'light' | 'dark'
}

export function ThemeProvider({
	children,
	defaultTheme = 'light',
}: ThemeProviderProps) {
	const [theme, setTheme] = React.useState<'light' | 'dark'>(defaultTheme)

	React.useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

import { ThemeKeyboardShortcut } from '@/components/theme-toggle'
import { ThemeCookieSyncer } from '@/components/theme-cookie-syncer'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
        >
            <ThemeCookieSyncer />
            <ThemeKeyboardShortcut />
            {children}
        </ThemeProvider>
    )
}
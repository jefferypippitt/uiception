'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

import { ThemeKeyboardShortcut } from '@/components/theme-toggle'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
        >
            <ThemeKeyboardShortcut />
            {children}
        </ThemeProvider>
    )
}
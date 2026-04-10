'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const BLOCK_CATEGORY_TITLE_VT_PREFIX = 'title-'

function stashBlocksCategoryTitleVt(): Map<HTMLElement, string> {
    const prev = new Map<HTMLElement, string>()
    for (const el of document.querySelectorAll<HTMLElement>('h1[style], p[style]')) {
        const n = el.style.viewTransitionName
        if (!n || n === 'none' || !n.startsWith(BLOCK_CATEGORY_TITLE_VT_PREFIX)) continue
        prev.set(el, n)
        el.style.viewTransitionName = 'none'
    }
    return prev
}

function restoreBlocksCategoryTitleVt(prev: Map<HTMLElement, string>) {
    for (const [el, n] of prev) {
        if (el.isConnected) el.style.viewTransitionName = n
    }
    prev.clear()
}

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        const flip = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        if (!document.startViewTransition) return flip()

        const prevVt = stashBlocksCategoryTitleVt()
        document.documentElement.classList.add('theme-transitioning')
        document.startViewTransition(flip).finished.finally(() => {
            document.documentElement.classList.remove('theme-transitioning')
            restoreBlocksCategoryTitleVt(prevVt)
        })
    }

    return (
        <Button onClick={toggleTheme} variant='ghost' size='icon'>
            <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    )
}

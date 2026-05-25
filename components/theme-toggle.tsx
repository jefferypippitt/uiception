'use client'

import { useCallback, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

type VtDocument = Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> }
}
type VtStyle = CSSStyleDeclaration & { viewTransitionName: string }

const BLOCK_CATEGORY_TITLE_VT_PREFIX = 'title-'

function stashBlocksCategoryTitleVt(): Map<HTMLElement, string> {
    const prev = new Map<HTMLElement, string>()
    for (const el of document.querySelectorAll<HTMLElement>('h1[style], p[style]')) {
        const n = (el.style as VtStyle).viewTransitionName
        if (!n || n === 'none' || !n.startsWith(BLOCK_CATEGORY_TITLE_VT_PREFIX)) continue
        prev.set(el, n)
        ;(el.style as VtStyle).viewTransitionName = 'none'
    }
    return prev
}

function restoreBlocksCategoryTitleVt(prev: Map<HTMLElement, string>) {
    for (const [el, n] of prev) {
        if (el.isConnected) (el.style as VtStyle).viewTransitionName = n
    }
    prev.clear()
}

function isEditableTarget(target: EventTarget | null) {
    return (
        (target instanceof HTMLElement && target.isContentEditable) ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
    )
}

function useThemeToggleActions() {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = useCallback(() => {
        const flip = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        const doc = document as VtDocument
        if (!doc.startViewTransition) return flip()

        const prevVt = stashBlocksCategoryTitleVt()
        document.documentElement.classList.add('theme-transitioning')
        doc.startViewTransition(flip).finished.finally(() => {
            document.documentElement.classList.remove('theme-transitioning')
            restoreBlocksCategoryTitleVt(prevVt)
        })
    }, [resolvedTheme, setTheme])

    return { toggleTheme }
}

export function ThemeKeyboardShortcut() {
    const { toggleTheme } = useThemeToggleActions()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (
                (e.key === 'd' || e.key === 'D') &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.altKey
            ) {
                if (isEditableTarget(e.target)) return

                e.preventDefault()
                toggleTheme()
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [toggleTheme])

    return null
}

export function ThemeToggle() {
    const { toggleTheme } = useThemeToggleActions()

    return (
        <Button onClick={toggleTheme} variant='ghost' size='icon'>
            <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    )
}

'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'

import Logo from '@/components/logo'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

function navActive(href: string, pathname: string | null) {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Header() {
    const pathname = usePathname()
    const blocksActive = navActive('/blocks', pathname)
    const changelogActive = navActive('/changelog', pathname)

    return (
        <header className='bg-background/80 sticky top-0 z-50 backdrop-blur-xs'>
            <div className='mx-auto w-full max-w-6xl px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <Logo />
                        <nav className='flex items-center gap-4 text-sm'>
                            <Link
                                href='/blocks'
                                aria-current={blocksActive ? 'page' : undefined}
                                className={cn(
                                    'text-foreground transition-[opacity,color] duration-200',
                                    blocksActive ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                                )}
                            >
                                Blocks
                            </Link>
                            <Link
                                href='/changelog'
                                aria-current={changelogActive ? 'page' : undefined}
                                className={cn(
                                    'text-foreground transition-[opacity,color] duration-200',
                                    changelogActive ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                                )}
                            >
                                Changelog
                            </Link>
                        </nav>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
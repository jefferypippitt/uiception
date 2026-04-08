'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'

import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

function navActive(href: string, pathname: string | null) {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Header() {
    const pathname = usePathname()

    return (
        <header className='bg-background sticky top-0 z-50 backdrop-blur-none'>
            <div className='mx-auto w-full max-w-6xl px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <Link href='/' className='font-semibold'>
                            {siteConfig.name}
                        </Link>
                        <nav className='flex items-center gap-4 text-sm'>
                            {siteConfig.navItems.map((item) => {
                                const active = navActive(item.href, pathname)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={cn(
                                            'text-foreground transition-[opacity,color] duration-200',
                                            active ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
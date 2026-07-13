'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

export default function Header() {
    return (
        <header className='bg-background sticky top-0 z-50 backdrop-blur-none'>
            <div className='mx-auto w-full max-w-6xl px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <Link href='/'>
                            {siteConfig.name}
                        </Link>
                        <nav className='flex items-center gap-1 text-sm'>
                            {siteConfig.navItems.map((item) => (
                                <Button key={item.href} variant='ghost' asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </Button>
                            ))}
                        </nav>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

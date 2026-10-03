import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { Button } from '@/components/ui/button'
import { CursorTerminal } from '@/components/cursor-terminal'
import { siteConfig } from '@/lib/config'

const title = `${siteConfig.name} - UI blocks and templates for Next.js`

export const metadata: Metadata = {
    title: { absolute: title },
    description: siteConfig.metaDescription,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: '/',
        title,
        description: siteConfig.metaDescription,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 1064,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description: siteConfig.metaDescription,
        images: [siteConfig.ogImage],
        creator: '@jefferypippitt',
    },
}

export default function Home() {
    return (
        <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center'>
            <div className='flex w-full flex-col items-center gap-2 text-center xl:gap-4'>
                <AnnouncementBanner href='/changelog' size='lg'>
                    See what we&apos;ve added
                </AnnouncementBanner>

                <h1 className='max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-5xl sm:tracking-tighter sm:whitespace-pre-line'>
                    {siteConfig.headline}
                </h1>

                <p className='mx-auto max-w-xl text-balance md:max-w-none md:text-nowrap font-sans text-base leading-relaxed text-foreground sm:text-lg'>
                    {siteConfig.description}
                </p>

                <div className='flex w-full items-center justify-center gap-2 pt-2'>
                    <Button asChild size='lg' className='rounded-full pr-3 pl-4'>
                        <Link href='/blocks'>
                            Get Started
                            <ChevronRight data-icon='inline-end' aria-hidden />
                        </Link>
                    </Button>
                    <Button asChild variant='secondary' size='lg' className='rounded-full px-4'>
                        <Link href='/docs'>View Documentation</Link>
                    </Button>
                </div>
            </div>

            <div className='w-full max-w-5xl'>
                <CursorTerminal />
            </div>
        </div>
    )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { Button } from '@/components/ui/button'
import { HomeBlockStack, type HomeStackLayer } from '@/components/home-block-stack'
import type { BlockCategoryId } from '@/lib/blocks'
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

// The homepage stack, top of a page to bottom. Each card starts on its first
// version, then swaps to the next one each time it lifts. Every version needs
// light and dark captures in public/images/home.
const stackLayers: (HomeStackLayer & { id: BlockCategoryId })[] = [
    {
        id: 'navbar',
        versions: [
            'navbar-section-v8',
            'navbar-section-v1',
            'navbar-section-v2',
            'navbar-section-v3',
            'navbar-section-v5',
            'navbar-section-v6',
            'navbar-section-v7',
            'navbar-section-v9',
            'navbar-section-v10',
        ],
    },
    {
        id: 'hero-section',
        versions: [
            'hero-section-v4',
            'hero-section-v1',
            'hero-section-v2',
            'hero-section-v3',
            'hero-section-v5',
            'hero-section-v6',
            'hero-section-v7',
            'hero-section-v8',
            'hero-section-v9',
            'hero-section-v10',
            'hero-section-v11',
            'hero-section-v12',
            'hero-section-v13',
        ],
    },
    {
        id: 'features',
        versions: [
            'feature-section-v1',
            'feature-section-v2',
            'feature-section-v3',
            'feature-section-v4',
            'feature-section-v5',
            'feature-section-v6',
            'feature-section-v7',
            'feature-section-v8',
            'feature-section-v9',
            'feature-section-v10',
            'feature-section-v11',
        ],
    },
    {
        id: 'pricing',
        versions: [
            'pricing-section-v3',
            'pricing-section-v1',
            'pricing-section-v2',
            'pricing-section-v4',
            'pricing-section-v5',
            'pricing-section-v6',
        ],
    },
    {
        id: 'testimonials',
        versions: [
            'testimonials-section-v1',
            'testimonials-section-v2',
            'testimonials-section-v3',
            'testimonials-section-v4',
            'testimonials-section-v5',
            'testimonials-section-v6',
            'testimonials-section-v7',
        ],
    },
    {
        id: 'cta',
        versions: [
            'cta-section-v3',
            'cta-section-v1',
            'cta-section-v2',
            'cta-section-v4',
            'cta-section-v5',
            'cta-section-v6',
            'cta-section-v7',
        ],
    },
    {
        id: 'footer',
        versions: [
            'footer-section-v1',
            'footer-section-v2',
            'footer-section-v3',
            'footer-section-v4',
            'footer-section-v5',
        ],
    },
]

export default function Home() {
    return (
        <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center'>
            <div className='flex w-full flex-col items-center gap-2 text-center xl:gap-4'>
                <AnnouncementBanner href='/changelog' size='lg'>
                    Updates
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

            <div className='w-full'>
                <HomeBlockStack layers={stackLayers} />
            </div>
        </div>
    )
}

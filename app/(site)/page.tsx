import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { CursorTerminal } from '@/components/cursor-terminal'
import { siteConfig } from '@/lib/config'
import { StartBuildingButton } from './start-building-button'

export default function Home() {
    return (
        <div className='pb-8 md:pb-12'>
            <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center md:gap-9'>
                <div className='flex w-full flex-col items-center gap-2 text-center xl:gap-4'>
                    <Badge asChild variant='secondary'>
                        <Link href='/changelog' className='inline-flex items-center gap-1'>
                            What&apos;s New
                            <ArrowRight
                                className='size-4 shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover/badge:translate-x-0.5'
                                aria-hidden
                            />
                        </Link>
                    </Badge>

                    <h1 className='max-w-4xl text-balance font-pixel-circle text-3xl leading-none tracking-tight text-primary [word-spacing:-0.13em] lg:leading-[1.1] xl:text-5xl xl:tracking-tighter'>
                        Skip to the good part.
                    </h1>

                    <p className='mx-auto max-w-lg text-pretty font-sans text-sm leading-7 tracking-tight text-muted-foreground sm:text-base sm:leading-8'>
                        {siteConfig.description}
                    </p>

                    <div className='flex w-full items-center justify-center gap-2 pt-2'>
                        <StartBuildingButton />
                    </div>
                </div>

                <section className='w-full max-w-5xl'>
                    <CursorTerminal />
                </section>
            </div>
        </div>
    )
}

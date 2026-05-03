import { Link } from 'next-view-transitions'
import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CursorTerminal } from '@/components/cursor-terminal'

export default function Home() {
    return (
        <div className='pb-8 md:pb-12'>
            <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center md:gap-9'>
                <div className='flex w-full max-w-6xl flex-col items-center gap-5 text-center md:gap-6'>
                    <section>
                        <Badge asChild variant='secondary'>
                            <Link href='/changelog' className='inline-flex items-center gap-1'>
                                What&apos;s New
                                <ArrowRight
                                    className='size-4 shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover/badge:translate-x-0.5'
                                    aria-hidden
                                />
                            </Link>
                        </Badge>
                    </section>

                    <section className='flex flex-col items-center gap-3'>
                        <h1 className='max-w-4xl text-4xl font-pixel-circle tracking-tight [word-spacing:-0.13em] md:text-5xl lg:text-6xl'>
                            Skip to the good part.
                        </h1>

                        <p className='max-w-3xl font-light tracking-tight md:text-lg'>
                            Start from sections that feel complete. Just make it yours.
                        </p>
                    </section>

                    <section className='flex flex-col gap-4 sm:flex-row'>
                        <Button asChild>
                            <Link href='/blocks'>Browse Blocks</Link>
                        </Button>
                    </section>
                </div>

                <section className='w-full max-w-5xl'>
                    <CursorTerminal />
                </section>
            </div>
        </div>
    )
}

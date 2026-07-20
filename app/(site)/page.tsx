import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CursorTerminal } from '@/components/cursor-terminal'
import { siteConfig } from '@/lib/config'

export default function Home() {
    return (
        <div className='pb-8 md:pb-12'>
            <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center md:gap-9'>
                <div className='flex w-full flex-col items-center gap-2 text-center xl:gap-4'>
                    <Badge asChild variant='outline'>
                        <Link href='/changelog'>
                            What&apos;s New
                            <ArrowRight data-icon='inline-end' aria-hidden />
                        </Link>
                    </Badge>

                    <h1 className='max-w-4xl text-balance text-3xl font-medium leading-none tracking-tight text-primary lg:leading-[1.1] xl:text-5xl xl:tracking-tighter'>
                        Skip to the good part.
                    </h1>

                    <p className='mx-auto max-w-lg text-pretty font-sans text-sm leading-7 tracking-tight text-muted-foreground sm:text-base sm:leading-8'>
                        {siteConfig.description}
                    </p>

                    <div className='flex w-full items-center justify-center gap-2 pt-2'>
                        <Button asChild size='default'>
                            <Link href='/blocks'>Get Started</Link>
                        </Button>
                    </div>
                </div>

                <section className='w-full max-w-5xl'>
                    <CursorTerminal />
                </section>
            </div>
        </div>
    )
}

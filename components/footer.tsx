import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { CopyrightYear } from '@/components/copyright-year'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Footer() {
    return (
        <footer className='py-4'>
            <div className='text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-x-3 gap-y-1 px-6 text-center text-sm sm:flex-row'>
                <p>
                    &copy;
                    <Suspense fallback={<span>----</span>}>
                        <CopyrightYear />
                    </Suspense>{' '}
                    uiception
                </p>
                <p className='flex items-center justify-center gap-2'>
                    Developed by
                    <Button variant='link' size='icon-xs' className='p-0' asChild>
                        <Link
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://github.com/jefferypippitt'
                            aria-label='jefferypippitt on GitHub'
                        >
                            <Avatar size='sm' className='size-4'>
                                <AvatarImage
                                    alt='jefferypippitt on GitHub'
                                    src='https://github.com/jefferypippitt.png?size=128'
                                />
                                <AvatarFallback>JP</AvatarFallback>
                            </Avatar>
                        </Link>
                    </Button>
                </p>
            </div>
        </footer>
    )
}
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const sizes = {
    sm: {
        root: 'gap-1.5 py-0.5 pr-2 pl-0.5',
        badge: 'px-1.5 py-px text-[0.625rem]',
        label: 'text-xs',
        icon: 'size-3',
    },
    md: {
        root: 'gap-2 py-1 pr-2.5 pl-1',
        badge: 'px-2 py-0.5 text-xs',
        label: 'text-sm',
        icon: 'size-3.5',
    },
    lg: {
        root: 'gap-2 py-1 pr-1 pl-1',
        badge: 'px-2 py-0.5 text-xs',
        label: 'text-sm',
        icon: 'size-3.5',
        iconWrap: 'flex size-5 items-center justify-center rounded-full bg-muted',
    },
} as const satisfies Record<
    string,
    { root: string; badge: string; label: string; icon: string; iconWrap?: string }
>

type AnnouncementBannerProps = {
    href: string
    badge?: string
    children: React.ReactNode
    size?: keyof typeof sizes
    className?: string
}

export function AnnouncementBanner({
    href,
    badge = 'New',
    children,
    size = 'sm',
    className,
}: AnnouncementBannerProps) {
    const s: (typeof sizes)[keyof typeof sizes] & { iconWrap?: string } = sizes[size]

    const icon = (
        <ArrowUpRight
            className={cn(
                'text-foreground',
                s.icon,
            )}
            strokeWidth={2}
            aria-hidden
        />
    )

    return (
        <Link
            href={href}
            className={cn(
                'inline-flex items-center rounded-full border border-border bg-background shadow-xs transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                s.root,
                className,
            )}
        >
            <span
                className={cn(
                    'rounded-full bg-muted text-foreground',
                    s.badge,
                )}
            >
                {badge}
            </span>
            <span className={cn('text-foreground', s.label)}>
                {children}
            </span>
            {s.iconWrap ? <span className={s.iconWrap}>{icon}</span> : icon}
        </Link>
    )
}

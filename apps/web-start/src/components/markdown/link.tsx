'use client';

import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';

import { useSession } from '@hikka/react';

import {
    AnimeTooltip,
    CharacterTooltip,
    MangaTooltip,
    NovelTooltip,
    PersonTooltip,
    UserTooltip,
} from '@/components/content-card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/utils/cn';
import { Link as TanstackLink } from '@/utils/navigation';

import MaterialSymbolsLinkRounded from '../icons/material-symbols/MaterialSymbolsLinkRounded';

interface Props {
    href: string;
    className?: string;
}

const AUTH_ONLY_HOSTS = ['toloka.to', 'anitube.in.ua'];

const ALLOWED_HOSTS = [
    ...AUTH_ONLY_HOSTS,
    'watari-anime.com',
    'aniage.net',
    'myanimelist.net',
    'anilist.co',
    'mikai.me',
];

const LINK_EXTRA_CLASSNAME = 'break-all';
const LINK_CLASSNAME =
    'cursor-pointer text-primary-foreground hover:underline wrap-break-word whitespace-normal';

const INTERNAL_TOOLTIPS: {
    pattern: RegExp;
    wrap: (slug: string, link: ReactNode) => ReactElement;
}[] = [
    {
        pattern: /^\/anime\/([^/?#]+)/,
        wrap: (slug, link) => <AnimeTooltip slug={slug}>{link}</AnimeTooltip>,
    },
    {
        pattern: /^\/characters\/([^/?#]+)/,
        wrap: (slug, link) => (
            <CharacterTooltip slug={slug}>{link}</CharacterTooltip>
        ),
    },
    {
        pattern: /^\/manga\/([^/?#]+)/,
        wrap: (slug, link) => <MangaTooltip slug={slug}>{link}</MangaTooltip>,
    },
    {
        pattern: /^\/novel\/([^/?#]+)/,
        wrap: (slug, link) => <NovelTooltip slug={slug}>{link}</NovelTooltip>,
    },
    {
        pattern: /^\/people\/([^/?#]+)/,
        wrap: (slug, link) => <PersonTooltip slug={slug}>{link}</PersonTooltip>,
    },
    {
        pattern: /^\/u\/([^/?#]+)/,
        wrap: (username, link) => (
            <UserTooltip username={username}>{link}</UserTooltip>
        ),
    },
];

const getHostname = (href: string): string | null => {
    try {
        return new URL(href, 'https://hikka.io').hostname.toLowerCase();
    } catch {
        return null;
    }
};

const hostMatches = (hostname: string | null, hosts: string[]) =>
    !!hostname &&
    hosts.some((host) => hostname === host || hostname.endsWith('.' + host));

const Link: FC<PropsWithChildren<Props>> = ({ children, href, className }) => {
    const { user } = useSession();

    const hostname = getHostname(href);
    const isInternal =
        hostname === 'hikka.io' ||
        !!hostname?.endsWith('.hikka.io') ||
        !/^https?:\/\//i.test(href);

    if (!user && hostMatches(hostname, AUTH_ONLY_HOSTS)) {
        return (
            <span className={cn('text-muted-foreground', className)}>
                {children}
            </span>
        );
    }

    if (isInternal) {
        const path = href.replace(/^https?:\/\/[^/]+/i, '');

        for (const { pattern, wrap } of INTERNAL_TOOLTIPS) {
            const slug = path.match(pattern)?.[1];

            if (slug) {
                return wrap(
                    slug,
                    <TanstackLink
                        className={cn(LINK_CLASSNAME, className)}
                        to={href}
                    >
                        {children}
                    </TanstackLink>,
                );
            }
        }

        return (
            <TanstackLink
                className={cn(LINK_CLASSNAME, LINK_EXTRA_CLASSNAME, className)}
                to={href}
            >
                {children}
            </TanstackLink>
        );
    }

    if (hostMatches(hostname, ALLOWED_HOSTS)) {
        return (
            <a
                target="_blank"
                rel="noopener noreferrer"
                className={cn(LINK_CLASSNAME, LINK_EXTRA_CLASSNAME, className)}
                href={href}
            >
                {children}
            </a>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span
                    className={cn(
                        LINK_CLASSNAME,
                        LINK_EXTRA_CLASSNAME,
                        className,
                    )}
                >
                    {children}
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full overflow-hidden lg:min-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете відкрити посилання?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex w-full items-center gap-2 overflow-hidden">
                            <MaterialSymbolsLinkRounded />
                            <p
                                className={cn(
                                    'flex-1 truncate',
                                    LINK_EXTRA_CLASSNAME,
                                )}
                            >
                                {href}
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            window.open(href, '_blank', 'noopener,noreferrer')
                        }
                    >
                        Продовжити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Link;

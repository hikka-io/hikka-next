import React, { FC, PropsWithChildren } from 'react';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import NextLink from 'next/link';

import AnimeTooltip from '@/components/entry-card/components/anime-tooltip';
import P from '@/components/typography/p';
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
import { cn } from '@/utils/utils';

interface Props {
    href: string;
    className?: string;
}

const ALLOWED_HOSTS = [
    'toloka.to',
    'anitube.in.ua',
    'watari-anime.com',
    'aniage.net',
    'myanimelist.net',
    'anilist.co',
];

const Link: FC<PropsWithChildren<Props>> = ({ children, href, className }) => {
    if (href.includes('hikka.io') || !href.includes('http')) {
        if (href.includes('/anime')) {
            const link = href.split('/anime/')[1]?.split('/')[0];

            if (link) {
                return (
                    <AnimeTooltip slug={link}>
                        <NextLink href={href}>{children}</NextLink>
                    </AnimeTooltip>
                );
            }
        }

        return <NextLink href={href}>{children}</NextLink>;
    }

    if (ALLOWED_HOSTS.some((host) => href.includes(host))) {
        return (
            <NextLink target="_blank" className={className} href={href}>
                {children}
            </NextLink>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span
                    className={cn(
                        'cursor-pointer text-primary hover:underline',
                        className,
                    )}
                >
                    {children}
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете відкрити посилання?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex items-center gap-2">
                            <MaterialSymbolsLinkRounded />
                            <P className="flex-1 truncate">{href}</P>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => window.open(href, '_blank')}
                    >
                        Продовжити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Link;

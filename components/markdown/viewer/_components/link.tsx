import React, { PropsWithChildren } from 'react';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import Link from 'next/link';

import AnimeTooltip from '@/components/anime-tooltip';
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
import { cn } from '@/utils';
import P from '@/components/typography/p';

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

const Component = ({ children, href, className }: PropsWithChildren<Props>) => {
    if (href.includes('hikka.io') || !href.includes('http')) {
        if (href.includes('/anime')) {
            return (
                <AnimeTooltip slug={href.split('/anime/')[1]}>
                    <Link href={href}>{children}</Link>
                </AnimeTooltip>
            );
        }

        return <Link href={href}>{children}</Link>;
    }

    if (ALLOWED_HOSTS.some((host) => href.includes(host))) {
        return (
            <Link target="_blank" className={className} href={href}>
                {children}
            </Link>
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
                        <div className="flex gap-2 items-center">
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

export default Component;

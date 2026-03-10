'use client';

import { Link as TanstackLink } from '@tanstack/react-router';
import { FC, PropsWithChildren } from 'react';

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

import {
    AnimeTooltip,
    CharacterTooltip,
    MangaTooltip,
    NovelTooltip,
    PersonTooltip,
    UserTooltip,
} from '@/components/content-card';
import MaterialSymbolsLinkRounded from '../icons/material-symbols/MaterialSymbolsLinkRounded';

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

const LINK_EXTRA_CLASSNAME = 'break-all';
const LINK_CLASSNAME =
    'cursor-pointer text-primary-foreground hover:underline break-words whitespace-normal';

const Link: FC<PropsWithChildren<Props>> = ({ children, href, className }) => {
    if (href.includes('hikka.io') || !href.includes('http')) {
        if (href.includes('/anime')) {
            const link = href.split('/anime/')[1]?.split('/')[0];

            if (link) {
                return (
                    <AnimeTooltip slug={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </AnimeTooltip>
                );
            }
        } else if (href.includes('/characters')) {
            const link = href.split('/characters/')[1]?.split('/')[0];

            if (link) {
                return (
                    <CharacterTooltip slug={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </CharacterTooltip>
                );
            }
        } else if (href.includes('/manga')) {
            const link = href.split('/manga/')[1]?.split('/')[0];

            if (link) {
                return (
                    <MangaTooltip slug={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </MangaTooltip>
                );
            }
        } else if (href.includes('/novel')) {
            const link = href.split('/novel/')[1]?.split('/')[0];

            if (link) {
                return (
                    <NovelTooltip slug={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </NovelTooltip>
                );
            }
        } else if (href.includes('/people')) {
            const link = href.split('/people/')[1]?.split('/')[0];

            if (link) {
                return (
                    <PersonTooltip slug={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </PersonTooltip>
                );
            }
        } else if (href.includes('/u')) {
            const link = href.split('/u/')[1]?.split('/')[0];

            if (link) {
                return (
                    <UserTooltip username={link}>
                        <TanstackLink
                            className={cn(LINK_CLASSNAME, className)}
                            to={href as any}
                        >
                            {children}
                        </TanstackLink>
                    </UserTooltip>
                );
            }
        }

        return (
            <TanstackLink
                className={cn(LINK_CLASSNAME, LINK_EXTRA_CLASSNAME, className)}
                to={href as any}
            >
                {children}
            </TanstackLink>
        );
    }

    if (ALLOWED_HOSTS.some((host) => href.includes(host))) {
        return (
            <a
                target="_blank"
                rel="noopener noreferrer"
                className={cn(LINK_CLASSNAME, LINK_EXTRA_CLASSNAME, className)}
                to={href}
            >
                {children}
            </a>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className={cn(LINK_CLASSNAME, className)}>
                    {children}
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете відкрити посилання?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex items-center gap-2">
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

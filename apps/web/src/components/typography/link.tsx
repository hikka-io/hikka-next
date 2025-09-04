import NextLink, { LinkProps } from 'next/link';
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

import { cn } from '@/utils/utils';

import AnimeTooltip from '../content-card/anime-tooltip';
import CharacterTooltip from '../content-card/character-tooltip';
import MangaTooltip from '../content-card/manga-tooltip';
import NovelTooltip from '../content-card/novel-tooltip';
import PersonTooltip from '../content-card/person-tooltip';
import UserTooltip from '../content-card/user-tooltip';
import MaterialSymbolsLinkRounded from '../icons/material-symbols/MaterialSymbolsLinkRounded';
import P from './p';

interface Props extends LinkProps {
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

const LINK_CLASSNAME =
    'cursor-pointer text-primary-foreground hover:underline break-words';

const Link: FC<PropsWithChildren<Props>> = ({ children, href, className }) => {
    if (href.includes('hikka.io') || !href.includes('http')) {
        if (href.includes('/anime')) {
            const link = href.split('/anime/')[1]?.split('/')[0];

            if (link) {
                return (
                    <AnimeTooltip slug={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </AnimeTooltip>
                );
            }
        } else if (href.includes('/characters')) {
            const link = href.split('/characters/')[1]?.split('/')[0];

            if (link) {
                return (
                    <CharacterTooltip slug={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </CharacterTooltip>
                );
            }
        } else if (href.includes('/manga')) {
            const link = href.split('/manga/')[1]?.split('/')[0];

            if (link) {
                return (
                    <MangaTooltip slug={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </MangaTooltip>
                );
            }
        } else if (href.includes('/novel')) {
            const link = href.split('/novel/')[1]?.split('/')[0];

            if (link) {
                return (
                    <NovelTooltip slug={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </NovelTooltip>
                );
            }
        } else if (href.includes('/people')) {
            const link = href.split('/people/')[1]?.split('/')[0];

            if (link) {
                return (
                    <PersonTooltip slug={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </PersonTooltip>
                );
            }
        } else if (href.includes('/u')) {
            const link = href.split('/u/')[1]?.split('/')[0];

            if (link) {
                return (
                    <UserTooltip username={link}>
                        <NextLink
                            className={cn(LINK_CLASSNAME, className)}
                            href={href}
                        >
                            {children}
                        </NextLink>
                    </UserTooltip>
                );
            }
        }

        return (
            <NextLink className={cn(LINK_CLASSNAME, className)} href={href}>
                {children}
            </NextLink>
        );
    }

    if (ALLOWED_HOSTS.some((host) => href.includes(host))) {
        return (
            <NextLink
                target="_blank"
                className={cn(LINK_CLASSNAME, className)}
                href={href}
            >
                {children}
            </NextLink>
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

'use client';

import { useRef } from 'react';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Response as CharactersResponse } from '@/utils/api/anime/getAnimeCharacters';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import { Response as AnimeStuffResponse } from '@/utils/api/anime/getAnimeStaff';
import { ANIME_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';

const Component = () => {
    const isMobile = useIsMobile();
    const ref = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const params = useParams();
    const pathname = usePathname();
    const current = ANIME_NAV_ROUTES.find(
        (r) => pathname === '/anime/' + params.slug + r.url,
    );

    const characters: InfiniteData<CharactersResponse> | undefined =
        queryClient.getQueryData(['characters', params.slug]);

    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    const staff: InfiniteData<AnimeStuffResponse> | undefined =
        queryClient.getQueryData(['characters', params.slug]);

    const filteredRoutes = ANIME_NAV_ROUTES.filter((r) => {
        switch (r.slug) {
            case 'characters':
                return (
                    characters !== undefined &&
                    characters.pages.length > 0 &&
                    characters.pages[0].list.length > 0
                );
            case 'staff':
                return (
                    staff !== undefined &&
                    staff.pages.length > 0 &&
                    staff.pages[0].list.length > 0
                );
            case 'media':
                return (
                    anime &&
                    (anime?.ost || anime?.videos) &&
                    (anime?.ost.length > 0 || anime?.videos.length > 0)
                );
            case 'links':
                return anime && anime?.external && anime.external.length > 0;
            case 'franchise':
                return anime && anime.has_franchise;
            case 'general':
                return true;
            case 'comments':
                return true;
        }
    });

    return (
        <div className="flex items-center gap-2" ref={ref}>
            {current && (
                <Link
                    href={'/anime/' + params.slug + current?.url}
                    className="text-sm hover:underline"
                >
                    {current.title_ua}
                </Link>
            )}
            {!isMobile && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 px-1">
                            <PhCaretUpDownThin />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                            {filteredRoutes.map((r) => (
                                <DropdownMenuItem asChild key={r.slug}>
                                    <Link
                                        href={'/anime/' + params.slug + r.url}
                                    >
                                        <span>{r.title_ua}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default Component;
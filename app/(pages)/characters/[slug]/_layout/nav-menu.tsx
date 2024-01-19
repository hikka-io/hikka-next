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
import { Response as AnimeResponse } from '@/utils/api/characters/getCharacterAnime';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';

const Component = () => {
    const isMobile = useIsMobile();
    const ref = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const params = useParams();
    const pathname = usePathname();
    const current = CHARACTER_NAV_ROUTES.find(
        (r) => pathname === '/characters/' + params.slug + r.url,
    );

    const anime: InfiniteData<AnimeResponse> | undefined =
        queryClient.getQueryData(['characterAnime', params.slug]);

    const filteredRoutes = CHARACTER_NAV_ROUTES.filter((r) => {
        switch (r.slug) {
            case 'anime':
                return (
                    anime !== undefined &&
                    anime.pages.length > 0 &&
                    anime.pages[0].list.length > 0
                );
            case 'general':
                return true;
        }
    });

    return (
        <div className="flex items-center gap-2" ref={ref}>
            {current && (
                <Link
                    href={'/characters/' + params.slug + current?.url}
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
                        <DropdownMenuLabel>Навігація</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {filteredRoutes.map((r) => (
                                <DropdownMenuItem asChild key={r.slug}>
                                    <Link
                                        href={
                                            '/characters/' + params.slug + r.url
                                        }
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
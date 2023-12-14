'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import Popper from '@/app/_components/Popper';
import { Response as CharactersResponse } from '@/utils/api/anime/getAnimeCharacters';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import { Response as AnimeStuffResponse } from '@/utils/api/anime/getAnimeStaff';
import { ANIME_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { usePopperContext } from '@/utils/providers/PopperProvider';

const Component = () => {
    const isMobile = useIsMobile();
    const ref = useRef<HTMLDivElement>(null);
    const { animeNav, closePoppers, switchPopper } = usePopperContext();
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
        }
    });

    return (
        <>
            <div className="flex items-center gap-2" ref={ref}>
                <Link
                    href={'/anime/' + params.slug + current?.url}
                    className="text-sm hover:underline"
                >
                    {current?.title_ua}
                </Link>
                {!isMobile && (
                    <button
                        onClick={() => switchPopper('animeNav')}
                        className="btn btn-ghost btn-sm px-1"
                    >
                        <PhCaretUpDownThin />
                    </button>
                )}
            </div>
            {!isMobile && (
                <Popper
                    disablePortal
                    placement={isMobile ? 'bottom-end' : 'bottom-start'}
                    id="anime-nav"
                    open={Boolean(animeNav)}
                    onDismiss={closePoppers}
                    anchorEl={ref.current}
                >
                    <ul className="menu w-full  [&_li>*]:py-3">
                        {filteredRoutes.map((r) => (
                            <li key={r.slug}>
                                <Link
                                    className={clsx(
                                        pathname ===
                                            '/anime/' + params.slug + r.url &&
                                            'active',
                                    )}
                                    href={'/anime/' + params.slug + r.url}
                                    onClick={closePoppers}
                                >
                                    {r.title_ua}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Popper>
            )}
        </>
    );
};

export default Component;

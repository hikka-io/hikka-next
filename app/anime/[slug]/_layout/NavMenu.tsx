'use client';

import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import { Response as CharactersResponse } from '@/utils/api/anime/getAnimeCharacters';
import { Response as AnimeStuffResponse } from '@/utils/api/anime/getAnimeStaff';
import { useEffect, useRef } from 'react';
import useIsMobile from '@/utils/hooks/useIsMobile';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';
import Popper from '@/app/_components/Popper';
import { usePopperContext } from '@/utils/providers/PopperProvider';

const ROUTES: {
    slug: string;
    title_ua: string;
    url: string;
}[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
    {
        slug: 'staff',
        title_ua: 'Автори',
        url: '/staff',
    },
    {
        slug: 'media',
        title_ua: 'Медіа',
        url: '/media',
    },
    {
        slug: 'links',
        title_ua: 'Посилання',
        url: '/links',
    },
    {
        slug: 'franchise',
        title_ua: "Пов'язане",
        url: '/franchise',
    },
];

const Component = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { animeNav, closePoppers, switchPopper } = usePopperContext();
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const params = useParams();
    const pathname = usePathname();
    const current = ROUTES.find(
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

    const filteredRoutes = ROUTES.filter((r) => {
        switch (r.slug) {
            case 'characters':
                return characters !== undefined;
            case 'staff':
                return staff !== undefined;
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

    useEffect(() => {
        if (isMobile && ref.current && pathname !== `/anime/${params.slug}`) {
            ref.current.scrollIntoView();
        }
    }, [pathname]);

    return (
        <>
            <div className="flex gap-2 items-center" ref={ref}>
                <Link
                    href={'/anime/' + params.slug + current?.url}
                    className="text-sm hover:underline"
                >
                    {current?.title_ua}
                </Link>
                <button
                    onClick={() => switchPopper('animeNav')}
                    className="btn btn-sm btn-ghost px-1"
                >
                    <PhCaretUpDownThin />
                </button>
            </div>
            <Popper
                disablePortal
                placement="bottom-start"
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
        </>
    );
};

export default Component;

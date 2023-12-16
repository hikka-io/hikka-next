'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import Popper from '@/app/_components/Popper';
import { Response as AnimeResponse } from '@/utils/api/characters/getCharacterAnime';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { usePopperContext } from '@/utils/providers/PopperProvider';


const Component = () => {
    const isMobile = useIsMobile();
    const ref = useRef<HTMLDivElement>(null);
    const { animeNav, closePoppers, switchPopper } = usePopperContext();
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
        <>
            <div className="flex items-center gap-2" ref={ref}>
                <Link
                    href={'/characters/' + params.slug + current?.url}
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
                    id="character-nav"
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
                                            '/characters/' +
                                                params.slug +
                                                r.url && 'active',
                                    )}
                                    href={'/characters/' + params.slug + r.url}
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
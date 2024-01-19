'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import { Response as AnimeResponse } from '@/utils/api/characters/getCharacterAnime';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';


const Component = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const pathname = usePathname();

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
        <div className="tabs w-full flex-nowrap">
            {filteredRoutes.map((r) => (
                <Link
                    key={r.slug}
                    className={clsx(
                        'tab h-16 md:h-12',
                        pathname === '/characters/' + params.slug + r.url &&
                            'tab-active tab-bordered',
                    )}
                    href={'/characters/' + params.slug + r.url}
                >
                    {r.title_ua}
                </Link>
            ))}
        </div>
    );
};

export default Component;
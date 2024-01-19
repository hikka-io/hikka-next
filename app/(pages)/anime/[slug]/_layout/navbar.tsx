'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { Response as CharactersResponse } from '@/utils/api/anime/getAnimeCharacters';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import { Response as AnimeStuffResponse } from '@/utils/api/anime/getAnimeStaff';
import { ANIME_NAV_ROUTES } from '@/utils/constants';

const Component = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const pathname = usePathname();

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
        <Tabs value={pathname} defaultValue='account' className='px-2 overflow-hidden w-full'>
            <TabsList className='w-full overflow-x-scroll items-center justify-start no-scrollbar'>
                {filteredRoutes.map((r) => (
                    <TabsTrigger asChild key={r.slug} value={'/anime/' + params.slug + r.url}>
                        <Link
                            href={'/anime/' + params.slug + r.url}
                        >
                            {r.title_ua}
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default Component;
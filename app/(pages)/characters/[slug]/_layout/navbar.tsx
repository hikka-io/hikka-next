'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import { Response as AnimeResponse } from '@/utils/api/characters/getCharacterAnime';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';


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
        <Tabs value={pathname} defaultValue="account" className="px-2 overflow-hidden w-full">
            <TabsList className="w-full overflow-x-scroll items-center justify-start no-scrollbar">
                {filteredRoutes.map((r) => (
                    <TabsTrigger asChild key={r.slug} value={'/characters/' + params.slug + r.url}>
                        <Link
                            href={'/characters/' + params.slug + r.url}
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
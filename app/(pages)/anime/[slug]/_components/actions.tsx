'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import WatchStats from '@/app/(pages)/anime/[slug]/_components/watch-stats';
import FavoriteButton from '@/app/_components/favorite-button';
import WatchListButton from '@/app/_components/watchlist-button';
import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';

const Component = () => {
    const { secret } = useAuthContext();
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <WatchListButton
                    disabled={!secret}
                    additional
                    slug={String(params.slug)}
                />
                <WatchStats />
            </div>
        </div>
    );
};

export default Component;

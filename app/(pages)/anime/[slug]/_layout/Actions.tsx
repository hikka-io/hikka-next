'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import WatchStats from '@/app/(pages)/anime/[slug]/_layout/WatchStats';
import FavoriteButton from '@/app/_components/FavoriteButton';
import WatchListButton from '@/app/_components/WatchListButton';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';

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

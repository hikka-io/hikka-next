'use client';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import {useParams, usePathname} from 'next/navigation';
import WatchListButton from '@/app/_components/WatchListButton';
import FavoriteButton from '@/app/_components/FavoriteButton';
import WatchStats from '@/app/anime/[slug]/_layout/WatchStats';
import Link from "next/link";
import {useAuthContext} from "@/utils/providers/AuthProvider";

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
                <div className="flex gap-2">
                    <WatchListButton disabled={!secret} additional slug={String(params.slug)} />
                    <FavoriteButton disabled={!secret} slug={String(params.slug)} />
                </div>
                <WatchStats />
            </div>
        </div>
    );
};

export default Component;

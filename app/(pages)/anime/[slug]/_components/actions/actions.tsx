'use client';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/(pages)/anime/[slug]/page.hooks';
import WatchListButton from '@/app/_components/watchlist-button';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';

import WatchStats from '../watch-stats';


const Component = () => {
    const { secret } = useAuthContext();
    const params = useParams();
    const { data } = useAnimeInfo(String(params.slug));

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
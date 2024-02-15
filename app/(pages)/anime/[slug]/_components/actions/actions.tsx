'use client';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import WatchListButton from '@/components/watchlist-button';
import { useAuthContext } from '@/services/providers/auth-provider';

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
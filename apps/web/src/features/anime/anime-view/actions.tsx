'use client';

import { useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import WatchListButton from '@/components/watchlist-button/watchlist-button';

import WatchStats from './components/user-watch-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <WatchListButton
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <WatchStats />
            </div>
        </div>
    );
};

export default Actions;

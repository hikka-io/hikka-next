'use client';

import { FC } from 'react';

import { useParams } from 'next/navigation';

import WatchListButton from '@/components/watchlist-button/watchlist-button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useSession from '@/services/hooks/auth/useSession';

import CommentsButton from '../../../../../../../components/comments-button';
import WatchStats from './components/watch-stats';


const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <WatchListButton
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <WatchStats />
                {anime && (
                    <CommentsButton
                        comments_count={anime.comments_count}
                        slug={anime?.slug}
                        content_type="anime"
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;

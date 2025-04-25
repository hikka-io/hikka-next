'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useAnimeBySlug, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import CommentsButton from '@/components/comments-button';
import WatchListButton from '@/components/watchlist-button/watchlist-button';

import WatchStats from './watch-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: anime } = useAnimeBySlug({
        slug: String(params.slug),
    });

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
                        content_type={ContentTypeEnum.ANIME}
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;

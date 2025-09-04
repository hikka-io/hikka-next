'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ReadListButton from '@/components/readlist-button/readlist-button';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import UserContentStats from './components/user-content-stats';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Actions: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { user } = useSession();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                {content_type === ContentTypeEnum.ANIME ? (
                    <WatchlistButton
                        disabled={!user}
                        additional
                        slug={String(params.slug)}
                    />
                ) : (
                    <ReadListButton
                        content_type={content_type}
                        disabled={!user}
                        additional
                        slug={String(params.slug)}
                    />
                )}
                <UserContentStats content_type={content_type} />
            </div>
        </div>
    );
};

export default Actions;

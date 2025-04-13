'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import useFollowingReadList from '@/services/hooks/read/use-following-read-list';
import useFollowingWatchList from '@/services/hooks/watch/use-following-watch-list';
import LoadMoreButton from '../../components/load-more-button';
import FollowingReadItem from './following-read-item';
import FollowingWatchItem from './following-watch-item';

interface Props {
    content_type: API.ContentType;
}

const FollowingsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const watchListQuery = useFollowingWatchList(
        {
            slug: String(params.slug),
        },
        { enabled: content_type === 'anime' },
    );

    const readListQuery = useFollowingReadList(
        {
            slug: String(params.slug),
            content_type: content_type as 'manga' | 'novel',
        },
        { enabled: content_type !== 'anime' },
    );

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        content_type === 'anime' ? watchListQuery : readListQuery;

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list &&
                list.map((item) =>
                    'watch' in item ? (
                        <FollowingWatchItem
                            className="px-6 py-4"
                            data={item}
                            key={item.reference}
                        />
                    ) : (
                        <FollowingReadItem
                            className="px-6 py-4"
                            data={item}
                            key={item.reference}
                        />
                    ),
                )}
            {hasNextPage && (
                <div className="px-6">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default FollowingsModal;

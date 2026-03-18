'use client';

import { ContentTypeEnum, ReadContentType } from '@hikka/client';
import { useReadingUsers, useWatchingUsers } from '@hikka/react';
import { useParams } from '@/utils/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import FollowingItem from './components/following-item';

interface Props {
    content_type: ContentTypeEnum;
}

const FollowingsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const watchListQuery = useWatchingUsers({
        slug: String(params.slug),
        options: { enabled: content_type === ContentTypeEnum.ANIME },
    });

    const readListQuery = useReadingUsers({
        slug: String(params.slug),
        contentType: content_type as ReadContentType,
        options: { enabled: content_type !== ContentTypeEnum.ANIME },
    });

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        content_type === 'anime' ? watchListQuery : readListQuery;

    return (
        <div className="flex-1 overflow-y-scroll gap-6 -mx-4 p-4 flex flex-col">
            {list &&
                list.map((item) => (
                    <FollowingItem
                        data={{
                            type: 'watch' in item ? 'watch' : 'read',
                            content: 'watch' in item ? item.watch : item.read,
                            ...item,
                        }}
                        key={item.reference}
                    />
                ))}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default FollowingsModal;

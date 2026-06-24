'use client';

import type { FC } from 'react';

import { ContentTypeEnum, type ReadContentType } from '@hikka/client';
import { useReadingUsers, useWatchingUsers } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';
import { useParams } from '@/utils/navigation';

import FollowingItem from './components/following-item';

type Props = {
    content_type: ContentTypeEnum;
};

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
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
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

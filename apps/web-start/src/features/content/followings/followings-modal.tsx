import type { FC } from 'react';

import {
    ContentTypeEnum,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type ReadContentTypeEnum,
} from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import FollowingItem from './components/following-item';

type Props = {
    content_type: 'anime' | 'manga' | 'novel';
};

const FollowingsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const watchListQuery = useInfiniteList(
        getWatchFollowingInfiniteOptions({
            path: { slug: String(params.slug) },
        }),
        { enabled: content_type === ContentTypeEnum.ANIME },
    );

    const readListQuery = useInfiniteList(
        getReadFollowingInfiniteOptions({
            path: {
                slug: String(params.slug),
                content_type: content_type as ReadContentTypeEnum,
            },
        }),
        { enabled: content_type !== ContentTypeEnum.ANIME },
    );

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        content_type === 'anime' ? watchListQuery : readListQuery;

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list?.map((item) => (
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

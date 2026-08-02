import type { FC } from 'react';

import { range } from '@antfu/utils';

import {
    ContentTypeEnum,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import FollowingItem from './components/following-item';
import FollowingItemSkeleton from './components/following-item-skeleton';

const SKELETON_COUNT = 5;

type Props = {
    content_type: MainContentTypeEnum;
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

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = content_type === 'anime' ? watchListQuery : readListQuery;

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <FollowingItemSkeleton key={index} />
                ))}
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
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsPerson2OutlineRounded />}
                    title="Тут поки порожньо"
                    description="Ніхто з користувачів, за якими ви стежите, ще не додав цей тайтл до списку"
                />
            )}
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

import type { FC } from 'react';

import { range } from '@antfu/utils';

import { getCollectionsInfiniteOptions } from '@hikka/api';

import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

const SKELETON_COUNT = 5;

type Props = {
    className?: string;
};

const CollectionModal: FC<Props> = ({ className }) => {
    const params = useParams();

    const {
        list: collections,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        ref,
        fetchNextPage,
    } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body: {
                author: String(params.username),
                sort: ['created:desc'],
                only_public: false,
            },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <CollectionItemSkeleton key={index} />
                ))}
            {collections?.map((item) => (
                <CollectionItem data={item} key={item.reference} />
            ))}
            {!isLoading && collections?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsGridViewRounded />}
                    title="Колекції відсутні"
                    description="Тут з’являться колекції цього користувача"
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

export default CollectionModal;

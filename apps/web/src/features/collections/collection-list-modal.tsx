import type { FC, ReactNode } from 'react';

import {
    type CollectionsListArgs,
    getCollectionsInfiniteOptions,
} from '@hikka/api';

import InfiniteListSheet from '@/components/infinite-list-sheet';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

type Props = {
    body: CollectionsListArgs;
    emptyState: ReactNode;
};

const CollectionListModal: FC<Props> = ({ body, emptyState }) => {
    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(getCollectionsInfiniteOptions({ body }));

    return (
        <InfiniteListSheet
            className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4"
            list={list}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            loadMoreRef={ref}
            skeleton={CollectionItemSkeleton}
            renderItem={(collection) => (
                <CollectionItem data={collection} key={collection.reference} />
            )}
            emptyState={emptyState}
        />
    );
};

export default CollectionListModal;

import type { ComponentType, ReactNode, Ref } from 'react';

import { range } from '@antfu/utils';

import LoadMoreButton from '@/components/load-more-button';

const SKELETON_COUNT = 5;

type Props<T> = {
    className: string;
    list: T[] | undefined;
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    loadMoreRef: Ref<HTMLButtonElement>;
    skeleton: ComponentType;
    renderItem: (item: T) => ReactNode;
    emptyState: ReactNode;
};

function InfiniteListSheet<T>({
    className,
    list,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
    skeleton: ItemSkeleton,
    renderItem,
    emptyState,
}: Props<T>) {
    return (
        <div className={className}>
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <ItemSkeleton key={index} />
                ))}
            {list?.map((item) => renderItem(item))}
            {!isLoading && list?.length === 0 && emptyState}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={loadMoreRef}
                />
            )}
        </div>
    );
}

export default InfiniteListSheet;

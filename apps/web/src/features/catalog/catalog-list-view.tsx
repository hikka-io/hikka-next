import type { ReactNode } from 'react';

import { range } from '@antfu/utils';
import type { QueryKey } from '@tanstack/react-query';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import PagePagination from '@/components/page-pagination';
import Stack, { type StackSize } from '@/components/ui/stack';
import type { View } from '@/utils/cookies';

import CatalogListItemSkeleton from './catalog-list-item-skeleton';
import CatalogListSkeleton from './catalog-list-skeleton';

type Props<T> = {
    list: T[] | undefined;
    view: View;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    hasMultiplePages: boolean;
    pagination?: { page: number; pages: number };
    removeQueryKey: QueryKey;
    renderGridItem: (item: T) => ReactNode;
    renderListItem: (item: T) => ReactNode;
    extendedSize?: StackSize;
};

function CatalogListView<T>({
    list,
    view,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    hasMultiplePages,
    pagination,
    removeQueryKey,
    renderGridItem,
    renderListItem,
    extendedSize = 5,
}: Props<T>) {
    if (isLoading && !isFetchingNextPage) {
        if (view === 'list') {
            return (
                <div className="flex flex-col max-md:[&>*+*]:-mt-px md:gap-6">
                    {range(1, 7).map((v) => (
                        <CatalogListItemSkeleton key={v} />
                    ))}
                </div>
            );
        }
        return <CatalogListSkeleton extendedSize={extendedSize} />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <div className="isolate flex flex-col gap-6">
            {view === 'list' ? (
                <div className="flex flex-col max-md:[&>*+*]:-mt-px md:gap-6">
                    {list.map(renderListItem)}
                </div>
            ) : (
                <Stack extended size={5} extendedSize={extendedSize}>
                    {list.map(renderGridItem)}
                </Stack>
            )}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}
            {pagination && (
                <PagePagination
                    pagination={pagination}
                    resetQueryKey={
                        hasMultiplePages ? removeQueryKey : undefined
                    }
                />
            )}
        </div>
    );
}

export default CatalogListView;

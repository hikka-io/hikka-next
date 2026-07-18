import type { ReactNode } from 'react';

import type { QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import CatalogListSkeleton from '@/components/catalog-list-skeleton';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import { StickyPagination } from '@/components/ui/pagination';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props<T> = {
    list: T[] | undefined;
    view: Hikka.View;
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
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handlePageChange = (newPage: number) => {
        if (hasMultiplePages) {
            queryClient.removeQueries({ queryKey: removeQueryKey });
        }

        navigate({
            to: '.',
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

    if (isLoading && !isFetchingNextPage) {
        return <CatalogListSkeleton extendedSize={extendedSize} />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <div className="isolate flex flex-col gap-6">
            {view === 'list' ? (
                <div className="flex flex-col gap-6">
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
                <StickyPagination
                    page={pagination.page}
                    pages={pagination.pages}
                    setPage={handlePageChange}
                />
            )}
        </div>
    );
}

export default CatalogListView;

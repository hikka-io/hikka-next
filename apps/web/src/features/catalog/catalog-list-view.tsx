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
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    hasMultiplePages: boolean;
    pagination?: { page: number; pages: number };
    /** Exact query key to drop from cache when jumping pages. */
    removeQueryKey: QueryKey;
    renderItem: (item: T) => ReactNode;
    extendedSize?: StackSize;
};

/**
 * Shared presentational shell for the /anime, /manga and /novel catalogs.
 * Each per-type list stays a thin wrapper that calls its own search hook
 * (so hook rules hold) and supplies the card renderer + cache key here.
 */
function CatalogListView<T>({
    list,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    hasMultiplePages,
    pagination,
    removeQueryKey,
    renderItem,
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
            <Stack extended size={5} extendedSize={extendedSize}>
                {list.map(renderItem)}
            </Stack>
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

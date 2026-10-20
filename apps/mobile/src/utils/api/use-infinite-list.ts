import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

type Page<T> = { list: T[] };

type ListOptions = { queryKey: readonly unknown[] };

// Generated infinite options differ per endpoint; list views only need the shared `{ list, pagination }` page shape.
export function useInfiniteList<T>(options: ListOptions) {
    const query = useInfiniteQuery(
        options as unknown as Parameters<
            typeof useInfiniteQuery<
                Page<T>,
                Error,
                InfiniteData<Page<T>>,
                readonly unknown[],
                number
            >
        >[0],
    );

    return {
        list: query.data?.pages.flatMap((page) => page.list),
        isPending: query.isPending,
        error: query.error as unknown,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: () => void query.fetchNextPage(),
        refetch: () => void query.refetch(),
    };
}

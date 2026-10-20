import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

type Page<T> = { list: T[] };

type ListOptions = { queryKey: readonly unknown[]; subscribed?: boolean };

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
        items: query.data?.pages.flatMap((page) => page.list),
        error: query.error as unknown,
        isFetchingNextPage: query.isFetchingNextPage,
        isFetchNextPageError: query.isFetchNextPageError,
        onRetryNextPage: () => void query.fetchNextPage(),
        onEndReached: () => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
                void query.fetchNextPage();
            }
        },
        onRetry: () => void query.refetch(),
    };
}

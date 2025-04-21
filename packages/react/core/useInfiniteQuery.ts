import {
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
    useInfiniteQuery as useTanstackInfiniteQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '../provider/useHikkaClient';

/**
 * Hook for creating infinite queries with the Hikka client.
 * Automatically provides the client to the queryFn.
 */
export function useInfiniteQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryKey,
    queryFn,
    options,
}: {
    queryKey: TQueryKey;
    queryFn: (
        client: ReturnType<typeof useHikkaClient>,
        pageParam: number,
    ) => Promise<TQueryFnData>;
    options?: Omit<
        UseInfiniteQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryFnData,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    > & {
        getNextPageParam?: (
            lastPage: TQueryFnData,
        ) => number | undefined | null;
    };
}): UseInfiniteQueryResult<TData, TError> {
    const client = useHikkaClient();

    return useTanstackInfiniteQuery<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        number
    >({
        queryKey,
        queryFn: ({ pageParam }) => queryFn(client, pageParam),
        initialPageParam: 1, // Default to page 1
        getNextPageParam: (lastPage, _, lastPageParam) => {
            // Use custom getNextPageParam if provided
            if (options?.getNextPageParam) {
                return options.getNextPageParam(lastPage);
            }

            // Default implementation for pagination
            // This works if the response has a typical Hikka pagination structure
            // with { pagination: { page: number, pages: number, total: number } }
            if (
                typeof lastPage === 'object' &&
                lastPage !== null &&
                'pagination' in lastPage &&
                typeof (lastPage as any).pagination === 'object'
            ) {
                const pagination = lastPage.pagination as {
                    page: number;
                    pages: number;
                    total: number;
                };

                // If we haven't reached the last page, return the next page number
                if (pagination.page < pagination.pages) {
                    return lastPageParam + 1;
                }
            }

            // Otherwise, no more pages
            return null;
        },
        ...options,
    });
}

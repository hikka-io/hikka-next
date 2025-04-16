import { HikkaClient } from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';

import { getHikkaClient } from './createHikkaClient';

/**
 * Prefetches data for an infinite query and dehydrates it for use in server components.
 *
 * @param queryClient The query client to use
 * @param queryKey The query key to use
 * @param queryFn The function that will fetch the data
 * @param options Additional options for the query
 */
export async function prefetchInfiniteQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>(
    queryClient: QueryClient,
    queryKey: TQueryKey,
    queryFn: (client: HikkaClient, pageParam: number) => Promise<TQueryFnData>,
    options?: Omit<
        FetchInfiniteQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    > & {
        getNextPageParam?: (
            lastPage: TQueryFnData,
        ) => number | undefined | null;
    },
): Promise<void> {
    const hikkaClient = getHikkaClient();

    // Prefetch the data
    await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn: (context) => queryFn(hikkaClient, context.pageParam as number),
        initialPageParam: 1, // Default to page 1
        getNextPageParam: (lastPage: TQueryFnData) => {
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
                const pagination = (lastPage as any).pagination as {
                    page: number;
                    pages: number;
                    total: number;
                };

                // If we haven't reached the last page, return the next page number
                if (pagination.page < pagination.pages) {
                    return pagination.page + 1;
                }
            }

            // Otherwise, no more pages
            return null;
        },
        ...options,
    });
}

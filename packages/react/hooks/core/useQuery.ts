import {
    UseQueryOptions,
    UseQueryResult,
    useQuery as useTanstackQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '../../provider/useHikkaClient';

/**
 * Hook for creating queries with the Hikka client.
 * Automatically provides the client to the queryFn.
 */
export function useQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>(
    queryKey: TQueryKey,
    queryFn: (
        client: ReturnType<typeof useHikkaClient>,
    ) => Promise<TQueryFnData>,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >,
): UseQueryResult<TData, TError> {
    const client = useHikkaClient();

    return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: () => queryFn(client),
        ...options,
    });
}

'use client';

import { HikkaClient } from '@hikka/client';
import {
    UseQueryOptions,
    UseQueryResult,
    useQuery as useTanstackQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';

/**
 * Hook params for creating queries
 */
export interface QueryParams<TData, TResult = TData> {
    /** Query options */
    options?: Omit<
        UseQueryOptions<TData, Error, TResult>,
        'queryKey' | 'queryFn'
    >;
}

/**
 * Hook for creating queries with the Hikka client.
 * Automatically provides the client to the queryFn.
 */
export function useQuery<
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
    queryFn: (client: HikkaClient) => Promise<TQueryFnData>;
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    > & {
        authProtected?: boolean;
    };
}): UseQueryResult<TData, TError> {
    const { client } = useHikkaClient();

    return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: () => queryFn(client),
        ...options,
        enabled: options?.authProtected
            ? !!client.getAuthToken() && options?.enabled
            : options?.enabled,
    });
}

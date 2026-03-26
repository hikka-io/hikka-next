'use client';

import {
    UseQueryOptions,
    UseQueryResult,
    useQuery as useTanstackQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';

/**
 * Hook params for creating queries
 */
export interface QueryParams<
    TData,
    TResult = TData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
> {
    /** Query options */
    options?: Omit<
        UseQueryOptions<TData, Error, TResult, TQueryKey>,
        'queryKey' | 'queryFn'
    >;
    queryKey?: TQueryKey;
}

/**
 * Hook for creating queries with the Hikka client.
 * Accepts standard TanStack queryFn (no client injection).
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
    queryFn?: (...args: any[]) => TQueryFnData | Promise<TQueryFnData>;
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
        queryFn: queryFn!,
        ...options,
        enabled: options?.authProtected
            ? !!client.getAuthToken() && options?.enabled
            : options?.enabled,
    });
}

'use client';

import { HikkaClient } from '@hikka/client';
import {
    UseQueryOptions,
    UseQueryResult,
    useQuery as useTanstackQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { addDeepTitleProperties } from '@/utils';

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
    const { client, defaultOptions } = useHikkaClient();

    return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: () => queryFn(client),
        ...options,
        enabled: options?.authProtected
            ? !!client.getAuthToken() && options?.enabled
            : options?.enabled,
        select: options?.select
            ? (data) =>
                  options.select!(
                      addDeepTitleProperties(
                          data,
                          defaultOptions?.title,
                          defaultOptions?.name,
                      ),
                  )
            : (data) =>
                  addDeepTitleProperties(
                      data,
                      defaultOptions?.title,
                      defaultOptions?.name,
                  ) as unknown as TData,
    });
}

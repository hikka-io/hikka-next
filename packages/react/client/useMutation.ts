'use client';

import { HikkaClient } from '@hikka/client';
import {
    InvalidateQueryFilters,
    QueryClient,
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    useMutation as useTanstackMutation,
} from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';

/**
 * Hook for creating mutations with the Hikka client.
 * Automatically provides the client to the mutationFn.
 */
export function useMutation<
    TData,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
>({
    mutationFn,
    options,
}: {
    mutationFn: (client: HikkaClient, variables: TVariables) => Promise<TData>;
    options?: Omit<
        UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
        'mutationFn'
    >;
}): UseMutationResult<TData, TError, TVariables, TOnMutateResult> {
    const { client } = useHikkaClient();

    return useTanstackMutation<TData, TError, TVariables, TOnMutateResult>({
        mutationFn: (variables) => mutationFn(client, variables),
        ...options,
    });
}

/**
 * Creates a default mutation hook with invalidation options.
 * Useful for creating mutation hooks that follow common patterns.
 */
export function createMutation<
    TData,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
>({
    mutationFn,
    invalidateQueries,
    invalidateRefetchType,
    cacheByQueryKey,
}: {
    mutationFn: (client: HikkaClient, variables: TVariables) => Promise<TData>;
    invalidateQueries?:
        | readonly unknown[]
        | readonly unknown[][]
        | ((args: TVariables) => readonly unknown[] | readonly unknown[][])
        | (() => readonly unknown[] | readonly unknown[][]);
    invalidateRefetchType?: InvalidateQueryFilters['refetchType'];
    cacheByQueryKey?: ({
        data,
        queryClient,
        args,
    }: {
        data: TData;
        queryClient: QueryClient;
        args: TVariables;
    }) => void;
}) {
    return ({
        options,
    }: {
        options?: Omit<
            UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
            'mutationFn'
        >;
    } = {}) => {
        const queryClient = useQueryClient();

        const customOptions = {
            ...options,
            onSuccess: async (
                data: TData,
                variables: TVariables,
                onMutateResult: TOnMutateResult,
                context: any,
            ) => {
                await options?.onSuccess?.(
                    data,
                    variables,
                    onMutateResult,
                    context,
                );

                if (cacheByQueryKey) {
                    cacheByQueryKey({ data, queryClient, args: variables });
                }

                // Invalidate queries after successful mutation
                if (invalidateQueries) {
                    const queriesToInvalidate =
                        typeof invalidateQueries === 'function'
                            ? invalidateQueries(variables)
                            : invalidateQueries;

                    // If it's an array of arrays, invalidate each query key
                    if (
                        Array.isArray(queriesToInvalidate) &&
                        queriesToInvalidate.length > 0 &&
                        Array.isArray(queriesToInvalidate[0])
                    ) {
                        (queriesToInvalidate as readonly unknown[][]).forEach(
                            (queryKey) => {
                                queryClient.invalidateQueries({
                                    queryKey,
                                    exact: false,
                                    refetchType: invalidateRefetchType,
                                });
                            },
                        );
                    } else {
                        // Otherwise, invalidate a single query key
                        queryClient.invalidateQueries({
                            queryKey: queriesToInvalidate as readonly unknown[],
                            exact: false,
                            refetchType: invalidateRefetchType,
                        });
                    }
                }
            },
        };

        return useMutation({
            mutationFn,
            options: customOptions,
        });
    };
}

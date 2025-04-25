import {
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    useMutation as useTanstackMutation,
} from '@tanstack/react-query';

import { useHikkaClient } from '../provider/useHikkaClient';

/**
 * Hook for creating mutations with the Hikka client.
 * Automatically provides the client to the mutationFn.
 */
export function useMutation<
    TData,
    TError = Error,
    TVariables = void,
    TContext = unknown,
>({
    mutationFn,
    options,
}: {
    mutationFn: (
        client: ReturnType<typeof useHikkaClient>,
        variables: TVariables,
    ) => Promise<TData>;
    options?: Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationFn'
    >;
}): UseMutationResult<TData, TError, TVariables, TContext> {
    const client = useHikkaClient();

    return useTanstackMutation<TData, TError, TVariables, TContext>({
        mutationFn: (variables) => mutationFn(client, variables),
        ...options,
        onSuccess: (data, variables, context) => {
            options?.onSuccess?.(data, variables, context);

            // If invalidateQueries is provided, invalidate those queries
            if (options?.onSettled) {
                options.onSettled(data, null, variables, context);
            }
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);

            // Call onSettled on error as well
            if (options?.onSettled) {
                options.onSettled(undefined, error, variables, context);
            }
        },
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
    TContext = unknown,
>({
    mutationFn,
    invalidateQueries,
}: {
    mutationFn: (
        client: ReturnType<typeof useHikkaClient>,
        variables: TVariables,
    ) => Promise<TData>;
    invalidateQueries?:
        | readonly unknown[]
        | readonly unknown[][]
        | ((args: TVariables) => readonly unknown[] | readonly unknown[][])
        | (() => readonly unknown[] | readonly unknown[][]);
}) {
    return ({
        options,
    }: {
        options?: Omit<
            UseMutationOptions<TData, TError, TVariables, TContext>,
            'mutationFn'
        >;
    }) => {
        const queryClient = useQueryClient();

        const customOptions = {
            ...options,
            onSuccess: (
                data: TData,
                variables: TVariables,
                context: TContext,
            ) => {
                options?.onSuccess?.(data, variables, context);

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
                                });
                            },
                        );
                    } else {
                        // Otherwise, invalidate a single query key
                        queryClient.invalidateQueries({
                            queryKey: queriesToInvalidate as readonly unknown[],
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

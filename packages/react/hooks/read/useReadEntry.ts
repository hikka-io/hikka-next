import { ReadContentTypeEnum, ReadResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseReadEntryOptions
    extends Omit<
        UseQueryOptions<
            ReadResponse,
            Error,
            ReadResponse,
            ReturnType<typeof queryKeys.read.get>
        >,
        'queryKey' | 'queryFn'
    > {
    contentType: ReadContentTypeEnum;
    slug: string;
}

/**
 * Hook for getting a read entry for manga or novel
 */
export function useReadEntry(params: UseReadEntryOptions) {
    const { contentType, slug, ...options } = params;

    return useQuery(
        queryKeys.read.get(contentType, slug),
        (client) => client.read.get(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export interface PrefetchReadEntryParams extends UseReadEntryOptions {
    queryClient: QueryClient;
}

export async function prefetchReadEntry(params: PrefetchReadEntryParams) {
    const { queryClient, contentType, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.read.get(contentType, slug),
        (client) => client.read.get(contentType, slug),
        options,
    );
}

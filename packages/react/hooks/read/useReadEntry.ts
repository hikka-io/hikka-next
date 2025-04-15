import { ReadContentTypeEnum, ReadResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    > {}

/**
 * Hook for getting a read entry for manga or novel
 */
export function useReadEntry(
    contentType: ReadContentTypeEnum,
    slug: string,
    options: UseReadEntryOptions = {},
) {
    return useQuery(
        queryKeys.read.get(contentType, slug),
        (client) => client.read.get(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export async function prefetchReadEntry(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    slug: string,
    options: UseReadEntryOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.read.get(contentType, slug),
        (client) => client.read.get(contentType, slug),
        options,
    );
}

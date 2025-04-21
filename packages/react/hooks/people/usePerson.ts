import { PersonResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving person details by slug
 */
export function usePerson(
    slug: string,
    options?: Omit<
        UseQueryOptions<PersonResponse, Error, PersonResponse, any>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getBySlug(slug),
        options: options || {},
    });
}

/**
 * Prefetches person details for server-side rendering
 */
export async function prefetchPerson(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<PersonResponse, Error, PersonResponse, any>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getBySlug(slug),
        options: options || {},
    });
}

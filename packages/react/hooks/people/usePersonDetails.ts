import { PersonCountResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonDetailsOptions
    extends Omit<
        UseQueryOptions<
            PersonCountResponse,
            Error,
            PersonCountResponse,
            ReturnType<typeof queryKeys.people.details>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting person details by slug
 */
export function usePersonDetails(
    slug: string,
    options: UsePersonDetailsOptions = {},
) {
    return useQuery(
        queryKeys.people.details(slug),
        (client) => client.people.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchPersonDetails(
    queryClient: QueryClient,
    slug: string,
    options: UsePersonDetailsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.people.details(slug),
        (client) => client.people.getBySlug(slug),
        options,
    );
}

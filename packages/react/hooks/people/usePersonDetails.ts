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
    > {
    slug: string;
}

/**
 * Hook for getting person details by slug
 */
export function usePersonDetails(params: UsePersonDetailsOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.people.details(slug),
        (client) => client.people.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchPersonDetailsParams extends UsePersonDetailsOptions {
    queryClient: QueryClient;
}

export async function prefetchPersonDetails(
    params: PrefetchPersonDetailsParams,
) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.details(slug),
        (client) => client.people.getBySlug(slug),
        options,
    );
}

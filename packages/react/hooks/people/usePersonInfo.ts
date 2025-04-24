import { PersonCountResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UsePersonInfoParams {
    slug: string;
}

/**
 * Hook for retrieving person details by slug
 */
export function usePersonInfo<TResult = PersonCountResponse>({
    slug,
    ...rest
}: UsePersonInfoParams & QueryParams<PersonCountResponse, TResult>) {
    return useQuery<PersonCountResponse, Error, TResult>({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches person details for server-side rendering
 */
export async function prefetchPersonInfo({
    slug,
    ...rest
}: PrefetchQueryParams<PersonCountResponse> & UsePersonInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getBySlug(slug),
        ...rest,
    });
}

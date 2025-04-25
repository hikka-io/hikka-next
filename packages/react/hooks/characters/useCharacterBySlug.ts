import { CharacterResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseCharacterInfoParams {
    slug: string;
}

/**
 * Hook for getting character details by slug
 */
export function useCharacterBySlug<TResult = CharacterResponse>({
    slug,
    ...rest
}: UseCharacterInfoParams & QueryParams<CharacterResponse, TResult>) {
    return useQuery<CharacterResponse, Error, TResult>({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getCharacterBySlug(slug),
        ...rest,
    });
}

/**
 * Function for prefetching character details
 */
export async function prefetchCharacterBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<CharacterResponse> & UseCharacterInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getCharacterBySlug(slug),
        ...rest,
    });
}

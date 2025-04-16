import {
    CharactersSearchPaginationResponse,
    QuerySearchArgs,
} from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterSearchOptions
    extends Omit<
        UseQueryOptions<
            CharactersSearchPaginationResponse,
            Error,
            CharactersSearchPaginationResponse,
            ReturnType<typeof queryKeys.characters.search>
        >,
        'queryKey' | 'queryFn'
    > {
    args: QuerySearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching characters
 */
export function useCharacterSearch(params: UseCharacterSearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;
    const query = args.query || '';

    return useQuery(
        queryKeys.characters.search(query),
        (client) => client.characters.search(args, page, size),
        {
            enabled: !!args.query,
            ...queryOptions,
        },
    );
}

export interface PrefetchCharacterSearchParams
    extends UseCharacterSearchOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterSearch(
    params: PrefetchCharacterSearchParams,
) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;
    const query = args.query || '';

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.search(query),
        (client) => client.characters.search(args, page, size),
        queryOptions,
    );
}

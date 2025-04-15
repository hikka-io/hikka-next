import { PersonCharactersPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonCharactersOptions
    extends Omit<
        UseQueryOptions<
            PersonCharactersPaginationResponse,
            Error,
            PersonCharactersPaginationResponse,
            ReturnType<typeof queryKeys.people.characters>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting characters voiced by a person
 */
export function usePersonCharacters(
    slug: string,
    options: UsePersonCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.people.characters(slug),
        (client) => client.people.getCharacters(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchPersonCharacters(
    queryClient: QueryClient,
    slug: string,
    options: UsePersonCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.characters(slug),
        (client) => client.people.getCharacters(slug, page, size),
        queryOptions,
    );
}

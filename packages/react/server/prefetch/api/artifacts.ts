import { ArtifactResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';

/**
 * Prefetches an artifact by username and name for server-side rendering
 */
export async function prefetchArtifact<TData = Record<string, unknown>>({
    username,
    name,
    ...rest
}: {
    username: string;
    name: string;
} & PrefetchQueryParams<ArtifactResponse<TData>>) {
    return prefetchQuery({
        queryKey: queryKeys.artifacts.byUsernameAndName(username, name),
        queryFn: (client) => client.artifacts.getArtifact<TData>(username, name),
        ...rest,
    });
}


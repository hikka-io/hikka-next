import {
    artifactOptions,
    artifactPrivacyOptions,
    userArtifactPrivacyOptions,
} from '@/options/api/artifacts';
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
} & PrefetchQueryParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            artifactOptions<TData>(client, { username, name }),
        ...rest,
    });
}

/**
 * Prefetches artifact privacy status for server-side rendering
 */
export async function prefetchArtifactPrivacy({
    name,
    ...rest
}: {
    name: string;
} & PrefetchQueryParams) {
    return prefetchQuery({
        optionsFactory: (client) => artifactPrivacyOptions(client, { name }),
        ...rest,
    });
}

/**
 * Prefetches user artifact privacy status for server-side rendering
 */
export async function prefetchUserArtifactPrivacy({
    username,
    name,
    ...rest
}: {
    username: string;
    name: string;
} & PrefetchQueryParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            userArtifactPrivacyOptions(client, { username, name }),
        ...rest,
    });
}

import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';

export function artifactOptions<TData = Record<string, unknown>>(
    client: HikkaClient,
    { username, name }: { username: string; name: string },
) {
    return queryOptions({
        queryKey: queryKeys.artifacts.byUsernameAndName(username, name),
        queryFn: () => client.artifacts.getArtifact<TData>(username, name),
    });
}

export function artifactPrivacyOptions(
    client: HikkaClient,
    { name }: { name: string },
) {
    return queryOptions({
        queryKey: queryKeys.artifacts.privacy(name),
        queryFn: () => client.artifacts.getArtifactPrivacy(name),
    });
}

export function userArtifactPrivacyOptions(
    client: HikkaClient,
    { username, name }: { username: string; name: string },
) {
    return queryOptions({
        queryKey: queryKeys.artifacts.userPrivacy(username, name),
        queryFn: () => client.artifacts.getUserArtifactPrivacy(username, name),
    });
}

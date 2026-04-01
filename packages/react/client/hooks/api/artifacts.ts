'use client';

import {
    ArtifactPrivacyArgs,
    ArtifactPrivacyResponse,
    ArtifactResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    artifactOptions,
    artifactPrivacyOptions,
    userArtifactPrivacyOptions,
} from '@/options/api/artifacts';

/**
 * Hook for retrieving an artifact by username and name
 */
export function useArtifact<TData = Record<string, unknown>>({
    username,
    name,
    ...rest
}: {
    username: string;
    name: string;
} & QueryParams<ArtifactResponse<TData>>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...artifactOptions<TData>(client, { username, name }),
        ...rest,
    });
}

/**
 * Hook for retrieving artifact privacy status
 */
export function useArtifactPrivacy({
    name,
    ...rest
}: {
    name: string;
} & QueryParams<ArtifactPrivacyResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...artifactPrivacyOptions(client, { name }),
        ...rest,
    });
}

/**
 * Hook for updating artifact privacy
 */
export const useUpdateArtifactPrivacy = createMutation({
    mutationFn: (
        client,
        { name, args }: { name: string; args: ArtifactPrivacyArgs },
    ) => client.artifacts.updateArtifactPrivacy(name, args),
    invalidateQueries: () => [queryKeys.artifacts.all],
});

/**
 * Hook for retrieving user artifact privacy status
 */
export function useUserArtifactPrivacy({
    username,
    name,
    ...rest
}: {
    username: string;
    name: string;
} & QueryParams<ArtifactPrivacyResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...userArtifactPrivacyOptions(client, { username, name }),
        ...rest,
    });
}

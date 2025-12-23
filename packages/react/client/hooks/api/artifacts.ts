'use client';

import {
    ArtifactPrivacyArgs,
    ArtifactPrivacyResponse,
    ArtifactResponse,
} from '@hikka/client';

import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';

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
    return useQuery({
        queryKey: queryKeys.artifacts.byUsernameAndName(username, name),
        queryFn: (client) =>
            client.artifacts.getArtifact<TData>(username, name),
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
    return useQuery({
        queryKey: queryKeys.artifacts.privacy(name),
        queryFn: (client) => client.artifacts.getArtifactPrivacy(name),
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

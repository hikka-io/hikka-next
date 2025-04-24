import { ClientArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for creating a new client
 */
export const useCreateClient = createMutation({
    mutationFn: (client, args: ClientArgs) => client.client.create(args),
    invalidateQueries: () => [queryKeys.client.all],
});

/**
 * Hook for updating a client
 */
export const useUpdateClient = createMutation({
    mutationFn: (
        client,
        { reference, args }: { reference: string; args: ClientArgs },
    ) => client.client.update(reference, args),
    invalidateQueries: (variables) => [
        queryKeys.client.all,
        queryKeys.client.byReference(variables.reference),
        queryKeys.client.fullInfo(variables.reference),
    ],
});

/**
 * Hook for deleting a client
 */
export const useDeleteClient = createMutation({
    mutationFn: (client, reference: string) => client.client.delete(reference),
    invalidateQueries: () => [queryKeys.client.all],
});

/**
 * Hook for verifying a client
 */
export const useVerifyClient = createMutation({
    mutationFn: (client, reference: string) => client.client.verify(reference),
    invalidateQueries: (reference) => [
        queryKeys.client.byReference(reference),
        queryKeys.client.fullInfo(reference),
    ],
});

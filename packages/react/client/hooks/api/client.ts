'use client';

import {
    ClientArgs,
    ClientInfoResponse,
    ClientPaginationResponse,
    ClientResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseClientByReferenceParams,
    UseClientListParams,
    UseFullClientInfoParams,
    UseUpdateClientParams,
    UseVerifyClientParams,
} from '@/types/client';

/**
 * Hook for getting client by reference
 */
export function useClientByReference<TResult = ClientResponse>({
    reference,
    ...rest
}: UseClientByReferenceParams & QueryParams<ClientResponse, TResult>) {
    return useQuery<ClientResponse, Error, TResult>({
        queryKey: queryKeys.client.byReference(reference),
        queryFn: (client) => client.client.getClientByReference(reference),
        ...rest,
    });
}

/**
 * Hook for getting full client info including secret
 */
export function useClientFullDetails<TResult = ClientInfoResponse>({
    reference,
    ...rest
}: UseFullClientInfoParams & QueryParams<ClientInfoResponse, TResult>) {
    return useQuery<ClientInfoResponse, Error, TResult>({
        queryKey: queryKeys.client.fullInfo(reference),
        queryFn: (client) => client.client.getClientFullDetails(reference),
        ...rest,
    });
}

/**
 * Hook for getting all clients for current user with pagination
 */
export function useClientList({
    paginationArgs = { page: 1, size: 15 },
    ...rest
}: InfiniteQueryParams<ClientPaginationResponse> & UseClientListParams = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.client.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.client.getClientList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for creating a new client
 */
export const useCreateClient = createMutation({
    mutationFn: (client, args: ClientArgs) => client.client.createClient(args),
    invalidateQueries: () => [queryKeys.client.all],
});

/**
 * Hook for updating a client
 */
export const useUpdateClient = createMutation({
    mutationFn: (client, args: UseUpdateClientParams) =>
        client.client.updateClient(args.reference, args.args),
    invalidateQueries: (args) => [
        queryKeys.client.all,
        queryKeys.client.byReference(args.reference),
        queryKeys.client.fullInfo(args.reference),
    ],
});

/**
 * Hook for deleting a client
 */
export const useDeleteClient = createMutation({
    mutationFn: (client, reference: string) =>
        client.client.deleteClient(reference),
    invalidateQueries: () => [queryKeys.client.all],
});

/**
 * Hook for verifying a client
 */
export const useUpdateClientVerification = createMutation({
    mutationFn: (client, { reference }: UseVerifyClientParams) =>
        client.client.updateClientVerification(reference),
    invalidateQueries: (args) => [
        queryKeys.client.byReference(args.reference),
        queryKeys.client.fullInfo(args.reference),
    ],
});

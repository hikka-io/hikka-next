import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseClientByReferenceParams,
    UseFullClientInfoParams,
} from '@/types/client';

export function clientByReferenceOptions(
    client: HikkaClient,
    { reference }: UseClientByReferenceParams,
) {
    return queryOptions({
        queryKey: queryKeys.client.byReference(reference),
        queryFn: () => client.client.getClientByReference(reference),
    });
}

export function clientFullDetailsOptions(
    client: HikkaClient,
    { reference }: UseFullClientInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.client.fullInfo(reference),
        queryFn: () => client.client.getClientFullDetails(reference),
    });
}

export function clientListOptions(
    client: HikkaClient,
    { paginationArgs }: { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.client.list(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.client.getClientList({
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

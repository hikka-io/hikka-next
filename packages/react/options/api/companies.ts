import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseCompaniesSearchParams } from '@/types/companies';

export function searchCompaniesOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UseCompaniesSearchParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.companies.search(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.companies.searchCompanies(args, {
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

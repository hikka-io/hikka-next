import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';

export function topEditorsListOptions(
    client: HikkaClient,
    { paginationArgs }: { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.stats.editsTop(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.stats.getTopEditorsList({
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

import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseFranchiseParams } from '@/types/related';

export function franchiseOptions(
    client: HikkaClient,
    { contentType, slug }: UseFranchiseParams,
) {
    return queryOptions({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: () => client.related.getFranchise(contentType, slug),
    });
}

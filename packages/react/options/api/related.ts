import { queryOptions } from '@tanstack/react-query';

import type { HikkaClient } from '@hikka/client';

import type { UseFranchiseParams } from '@/types/related';
import { queryKeys } from '@/core';

export function franchiseOptions(
    client: HikkaClient,
    { contentType, slug }: UseFranchiseParams,
) {
    return queryOptions({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: () => client.related.getFranchise(contentType, slug),
    });
}

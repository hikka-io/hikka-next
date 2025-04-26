'use client';

import { FranchiseResponse } from '@hikka/client';

import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import { UseFranchiseParams } from '@/types/related';

/**
 * Hook for retrieving franchise data for anime, manga, or novel
 */
export function useFranchise<TResult = FranchiseResponse>({
    contentType,
    slug,
    ...rest
}: UseFranchiseParams & QueryParams<FranchiseResponse, TResult>) {
    return useQuery<FranchiseResponse, Error, TResult>({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        ...rest,
    });
}

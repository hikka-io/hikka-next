'use client';

import type { FranchiseResponse } from '@hikka/client';

import type { UseFranchiseParams } from '@/types/related';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { type QueryParams, useQuery } from '@/client/useQuery';
import { franchiseOptions } from '@/options/api/related';

/**
 * Hook for retrieving franchise data for anime, manga, or novel
 */
export function useFranchise<TResult = FranchiseResponse>({
    contentType,
    slug,
    ...rest
}: UseFranchiseParams & QueryParams<FranchiseResponse, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<FranchiseResponse, Error, TResult>({
        ...franchiseOptions(client, { contentType, slug }),
        ...rest,
    });
}

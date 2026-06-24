import type { CompaniesPaginationResponse } from '@hikka/client';

import type { UseCompaniesSearchParams } from '@/types/companies';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { searchCompaniesOptions } from '@/options/api/companies';

/**
 * Hook for searching companies
 */
export function useSearchCompanies({
    args = {},
    paginationArgs,
    ...rest
}: UseCompaniesSearchParams &
    InfiniteQueryParams<CompaniesPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchCompaniesOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

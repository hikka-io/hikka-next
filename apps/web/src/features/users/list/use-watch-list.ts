import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import { userWatchListOptions } from '../queries';

export const useWatchList = (options?: { enabled?: boolean }) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    return useInfiniteList(
        userWatchListOptions(String(params.username), search),
        { enabled: options?.enabled },
    );
};

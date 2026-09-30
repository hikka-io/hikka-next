import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import { userWatchListOptions } from '../queries';
import { keepPreviousList } from './keep-previous-list';

export const useWatchList = (options?: { enabled?: boolean }) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    const listOptions = userWatchListOptions(String(params.username), search);

    return useInfiniteList(
        {
            ...listOptions,
            placeholderData: keepPreviousList(listOptions.queryKey),
        },
        { enabled: options?.enabled },
    );
};

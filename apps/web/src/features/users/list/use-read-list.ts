import type { ReadContentTypeEnum } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import { userReadListOptions } from '../queries';
import { keepPreviousList } from './keep-previous-list';

export const useReadList = (options?: { enabled?: boolean }) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    const listOptions = userReadListOptions(
        String(params.username),
        params.content_type as ReadContentTypeEnum,
        search,
    );

    return useInfiniteList(
        {
            ...listOptions,
            placeholderData: keepPreviousList(listOptions.queryKey),
        },
        { enabled: options?.enabled },
    );
};

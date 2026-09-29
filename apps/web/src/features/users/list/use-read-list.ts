import type { ReadContentTypeEnum } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import { userReadListOptions } from '../queries';

export const useReadList = (options?: { enabled?: boolean }) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    return useInfiniteList(
        userReadListOptions(
            String(params.username),
            params.content_type as ReadContentTypeEnum,
            search,
        ),
        { enabled: options?.enabled },
    );
};

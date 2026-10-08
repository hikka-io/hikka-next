import type { MainContentTypeEnum } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import { userListOptions } from '../queries';
import { keepPreviousList } from './keep-previous-list';

export const useUserList = (contentType: MainContentTypeEnum) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    const listOptions = userListOptions(
        String(params.username),
        contentType,
        search,
    );

    return useInfiniteList({
        ...listOptions,
        placeholderData: keepPreviousList(listOptions.queryKey),
    });
};

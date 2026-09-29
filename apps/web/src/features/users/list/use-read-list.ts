import {
    type ContentStatusEnum,
    type MangaMediaEnum,
    type NovelMediaEnum,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    userReadListInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

export const useReadList = (options?: { enabled?: boolean }) => {
    const search = useRouteSearch<UserlistSearch>();
    const params = useParams();

    const readStatus = search.status as ReadStatusEnum | 'all';

    // ReadSearchArgs.media_type is typed MangaMediaEnum[], but novel media
    // values are valid at runtime; widen-then-narrow to satisfy the body type.
    const media_type = (search.types ?? []) as (
        | NovelMediaEnum
        | MangaMediaEnum
    )[] as MangaMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const magazines = search.magazines ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;

    return useInfiniteList(
        userReadListInfiniteOptions({
            path: {
                content_type: params.content_type as ReadContentTypeEnum,
                username: String(params.username),
            },
            body: {
                read_status: readStatus !== 'all' ? readStatus : undefined,
                media_type,
                status,
                years,
                genres,
                magazines,
                score,
                sort: expandSort('read', search.sort, search.order),
            },
        }),
        { enabled: options?.enabled },
    );
};

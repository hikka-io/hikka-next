import {
    type ContentStatusEnum,
    type MangaMediaEnum,
    type NovelMediaEnum,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    userReadListInfiniteOptions,
} from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

export const useReadList = (options?: { enabled?: boolean }) => {
    const search = useFilterSearch<UserlistSearch>();
    const params = useParams();

    const readStatus = search.status as ReadStatusEnum | 'all';

    // Generated ReadSearchArgs.media_type is typed MangaMediaEnum[]; novel
    // media values are valid at runtime, so widen-then-narrow via the body type.
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

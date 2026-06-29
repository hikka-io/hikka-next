import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type SeasonEnum,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

export const useWatchList = (options?: { enabled?: boolean }) => {
    const search = useFilterSearch<UserlistSearch>();
    const params = useParams();

    const watchStatus = search.status;
    const _view = search.view || 'table';

    const media_type = (search.types ?? []) as AnimeMediaEnum[];
    const status = (search.statuses ?? []) as AnimeStatusEnum[];
    const season = (search.seasons ?? []) as SeasonEnum[];
    const rating = (search.ratings ?? []) as AnimeAgeRatingEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const studios = search.studios ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;

    return useInfiniteList(
        userWatchListInfiniteOptions({
            path: { username: String(params.username) },
            body: {
                watch_status:
                    watchStatus !== 'all'
                        ? (String(watchStatus) as WatchStatusEnum)
                        : undefined,
                media_type,
                status,
                season,
                rating,
                years,
                genres,
                studios,
                score,
                sort: expandSort('watch', search.sort, search.order),
            },
        }),
        { enabled: options?.enabled },
    );
};

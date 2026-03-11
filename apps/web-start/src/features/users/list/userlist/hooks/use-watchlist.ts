'use client';

import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    SeasonEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useSearchUserWatches } from '@hikka/react';
import { useParams } from '@/utils/navigation';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import type { UserlistSearch } from '@/utils/search-schemas';

export const useWatchList = () => {
    const search = useFilterSearch<UserlistSearch>();
    const params = useParams();

    const watchStatus = search.status;
    const view = search.view || 'table';

    const media_type = (search.types ?? []) as AnimeMediaEnum[];
    const status = (search.statuses ?? []) as AnimeStatusEnum[];
    const season = (search.seasons ?? []) as SeasonEnum[];
    const rating = (search.ratings ?? []) as AnimeAgeRatingEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const studios = search.studios ?? [];

    const order = search.order || 'desc';
    const sort = search.sort?.length ? search.sort : ['watch_score'];

    return useSearchUserWatches({
        username: String(params.username),
        args: {
            watch_status: String(watchStatus) as WatchStatusEnum,
            media_type,
            status,
            season,
            rating,
            years,
            genres,
            studios,
            sort: sort && order ? sort.map((item) => `${item}:${order}`) : undefined,
        },
    });
};

'use client';

import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    SeasonEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useSearchUserWatches } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';

export const useWatchList = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const view = searchParams.get('view') || 'table';

    const media_type = searchParams.getAll('types') as AnimeMediaEnum[];
    const status = searchParams.getAll('statuses') as AnimeStatusEnum[];
    const season = searchParams.getAll('seasons') as SeasonEnum[];
    const rating = searchParams.getAll('ratings') as AnimeAgeRatingEnum[];
    const years = searchParams.getAll('years') as unknown as [
        number | null,
        number | null,
    ];
    const genres = searchParams.getAll('genres');
    const studios = searchParams.getAll('studios');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'watch_score';

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
            sort: sort && order ? [`${sort}:${order}`] : undefined,
        },
    });
};

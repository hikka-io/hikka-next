import {
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
    type Client,
    paginationPageParam,
    type SeasonEnum,
} from '@hikka/api';

import type { ScheduleSearch } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

const DEFAULT_SCHEDULE_STATUS = [
    AnimeStatusEnum.ONGOING,
    AnimeStatusEnum.ANNOUNCED,
];

export function scheduleOptions(search: ScheduleSearch, client?: Client) {
    const season = (search.season as SeasonEnum) || getCurrentSeason()!;
    const year = Number(search.year) || new Date().getFullYear();
    const status = (
        search.status?.length ? search.status : DEFAULT_SCHEDULE_STATUS
    ) as AnimeStatusEnum[];

    return {
        ...animeScheduleInfiniteOptions({
            body: {
                airing_season: [season, year],
                status,
                only_watch: search.only_watch ?? undefined,
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

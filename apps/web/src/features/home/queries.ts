import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    type Client,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
} from '@hikka/api';

import { getCurrentSeason } from '@/utils/season';
import { getOngoingsSort } from '@/utils/sort';

export function ongoingsOptions({
    size,
    client,
}: {
    size: number;
    client?: Client;
}) {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return searchAnimeInfiniteOptions({
        body: {
            season: [season],
            media_type: [AnimeMediaEnum.TV],
            years: [year, year],
            genres: ['-ecchi', '-hentai'],
            status: [AnimeStatusEnum.ONGOING],
            sort: getOngoingsSort(),
        },
        query: { size },
        client,
    });
}

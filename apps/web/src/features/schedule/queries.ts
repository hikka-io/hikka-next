import {
    animeScheduleInfiniteOptions,
    type Client,
    paginationPageParam,
} from '@hikka/api';
import { getScheduleArgs, type ScheduleSearch } from '@hikka/core';

export function scheduleOptions(search: ScheduleSearch, client?: Client) {
    return {
        ...animeScheduleInfiniteOptions({
            body: getScheduleArgs(search),
            client,
        }),
        ...paginationPageParam(),
    };
}

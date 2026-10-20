import type { Query } from '@tanstack/react-query';

import {
    animeScheduleInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import { getScheduleArgs, queryId, type ScheduleSearch } from '@hikka/core';

export function scheduleOptions(search: ScheduleSearch) {
    return paginatedInfiniteOptions(
        animeScheduleInfiniteOptions({ body: getScheduleArgs(search) }),
    );
}

export const isScheduleQuery = (query: Query) =>
    queryId(query.queryKey) === 'animeSchedule';

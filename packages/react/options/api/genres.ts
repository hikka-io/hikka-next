import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';

export function genresOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.genres.list(),
        queryFn: () => client.genres.getGenres(),
    });
}

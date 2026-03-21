'use client';

import {
    ContentStatusEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadContentType,
    ReadStatusEnum,
} from '@hikka/client';
import { useSearchUserReads } from '@hikka/react';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { useParams } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

export const useReadList = () => {
    const search = useFilterSearch<UserlistSearch>();
    const params = useParams();

    const readStatus = search.status as ReadStatusEnum | 'all';

    const media_type = (search.types ?? []) as (
        | NovelMediaEnum
        | MangaMediaEnum
    )[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const magazines = search.magazines ?? [];

    const order = search.order || 'desc';
    const sort = search.sort?.length ? search.sort : ['read_score'];

    return useSearchUserReads({
        contentType: params.content_type as ReadContentType,
        username: String(params.username),
        args: {
            read_status: readStatus !== 'all' ? readStatus : undefined,
            media_type,
            status,
            years,
            genres,
            magazines,
            sort:
                sort && order
                    ? sort.map((item) => `${item}:${order}`)
                    : undefined,
        },
    });
};

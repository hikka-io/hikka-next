'use client';

import {
    ContentStatusEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadContentType,
    ReadStatusEnum,
} from '@hikka/client';
import { useSearchUserReads } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';

export const useReadList = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const readStatus = searchParams.get('status') as ReadStatusEnum;

    const media_type = searchParams.getAll('types') as (
        | NovelMediaEnum
        | MangaMediaEnum
    )[];
    const status = searchParams.getAll('statuses') as ContentStatusEnum[];
    const years = searchParams.getAll('years') as unknown as [
        number | null,
        number | null,
    ];
    const genres = searchParams.getAll('genres');
    const magazines = searchParams.getAll('magazines');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.getAll('sort').length > 0 ? searchParams.getAll('sort') : ['read_score'];

    return useSearchUserReads({
        contentType: params.content_type as ReadContentType,
        username: String(params.username),
        args: {
            read_status: readStatus,
            media_type,
            status,
            years,
            genres,
            magazines,
            sort: sort && order ? sort.map((item) => `${item}:${order}`) : undefined,
        },
    });
};

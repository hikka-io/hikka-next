import { useQuery } from '@tanstack/react-query';

import {
    animeSlugOptions,
    type CommentContentTypeEnum as CommentsContentType,
    ContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    type ReviewStatsResponse,
} from '@hikka/api';

type Params = {
    content_type: CommentsContentType;
    slug: string;
};

type Result = {
    stats: ReviewStatsResponse | undefined;
    commentsCount: number | undefined;
};

type InfoResponse = {
    review_stats: ReviewStatsResponse;
    comments_count: number;
};

const select = (data: InfoResponse): Result => ({
    stats: data.review_stats,
    commentsCount: data.comments_count,
});

const EMPTY: Result = { stats: undefined, commentsCount: undefined };

export function useReviewStats({ content_type, slug }: Params): Result {
    const animeQuery = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.ANIME,
        select,
    });

    const mangaQuery = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.MANGA,
        select,
    });

    const novelQuery = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.NOVEL,
        select,
    });

    const byType: Partial<Record<CommentsContentType, Result>> = {
        [ContentTypeEnum.ANIME]: animeQuery.data,
        [ContentTypeEnum.MANGA]: mangaQuery.data,
        [ContentTypeEnum.NOVEL]: novelQuery.data,
    };

    return byType[content_type] ?? EMPTY;
}

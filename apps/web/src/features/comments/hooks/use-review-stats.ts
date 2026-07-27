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

export function useReviewStats({ content_type, slug }: Params): Result {
    const animeQuery = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.ANIME,
    });

    const mangaQuery = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.MANGA,
    });

    const novelQuery = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: content_type === ContentTypeEnum.NOVEL,
    });

    const byType: Partial<
        Record<
            CommentsContentType,
            { review_stats: ReviewStatsResponse; comments_count: number }
        >
    > = {
        [ContentTypeEnum.ANIME]: animeQuery.data,
        [ContentTypeEnum.MANGA]: mangaQuery.data,
        [ContentTypeEnum.NOVEL]: novelQuery.data,
    };

    const data = byType[content_type];

    return {
        stats: data?.review_stats,
        commentsCount: data?.comments_count,
    };
}

import { useQuery } from '@tanstack/react-query';

import {
    type CommentContentTypeEnum,
    ContentTypeEnum,
    type ReviewStatsResponse,
} from '@hikka/api';

import {
    type ContentInfo,
    contentInfoOptions,
} from '@/utils/api/content-queries';

type Params = {
    content_type: CommentContentTypeEnum;
    slug: string;
};

type Result = {
    stats: ReviewStatsResponse | undefined;
    commentsCount: number | undefined;
};

const EMPTY: Result = { stats: undefined, commentsCount: undefined };

const REVIEW_CONTENT_TYPES = new Set<CommentContentTypeEnum>([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
]);

const select = (data: ContentInfo<CommentContentTypeEnum>): Result =>
    'review_stats' in data
        ? { stats: data.review_stats, commentsCount: data.comments_count }
        : EMPTY;

export function useReviewStats({ content_type, slug }: Params): Result {
    const { data } = useQuery({
        ...contentInfoOptions(content_type, slug),
        enabled: REVIEW_CONTENT_TYPES.has(content_type),
        select,
    });

    return data ?? EMPTY;
}

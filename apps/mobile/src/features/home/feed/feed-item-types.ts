import type {
    ArticlePreviewResponse,
    CollectionResponse,
    CommentResponseFeed,
} from '@hikka/api';

export type FeedItemResponse =
    | ArticlePreviewResponse
    | CollectionResponse
    | CommentResponseFeed;

export const getFeedItemKey = (item: FeedItemResponse) =>
    item.data_type === 'article' ? item.slug : item.reference;

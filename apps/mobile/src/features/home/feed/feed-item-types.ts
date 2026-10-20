import type {
    ArticlePreviewResponse,
    CollectionResponse,
    CommentResponseFeed,
} from '@hikka/api';

export type FeedItemResponse =
    | ArticlePreviewResponse
    | CollectionResponse
    | CommentResponseFeed;

// @hikka/api types the comment `preview` as a loose record.
export type CommentPreview = { slug?: string; title?: string };

export const getFeedItemKey = (item: FeedItemResponse) =>
    item.data_type === 'article' ? item.slug : item.reference;

export function getFeedItemPath(item: FeedItemResponse): string {
    switch (item.data_type) {
        case 'article':
            return `/articles/${item.slug}`;
        case 'collection':
            return `/collections/${item.reference}`;
        case 'comment': {
            const preview = item.preview as CommentPreview;

            return `/comments/${item.content_type}/${preview.slug}/${item.reference}`;
        }
    }
}

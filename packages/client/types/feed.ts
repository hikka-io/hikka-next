import { ArticlePreviewResponse } from './articles';
import { CollectionContent, CollectionResponse } from './collections';
import { CommentResponse } from './comments';
import { ContentTypeEnum } from './common';

/**
 * Feed content type filter
 */
export type FeedContentType =
    | ContentTypeEnum.COLLECTION
    | ContentTypeEnum.ARTICLE
    | ContentTypeEnum.COMMENT;

/**
 * Feed request arguments
 */
export interface FeedArgs {
    before?: string | null;
    content_type?: FeedContentType | null;
}

/**
 * Feed item response (discriminated union)
 */
export type FeedItemResponse =
    | ArticlePreviewResponse
    | CommentResponse
    | CollectionResponse<CollectionContent>;

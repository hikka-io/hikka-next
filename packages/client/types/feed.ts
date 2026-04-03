import { ArticleCategoryEnum, ArticlePreviewResponse } from './articles';
import {
    CollectionContent,
    CollectionContentType,
    CollectionResponse,
} from './collections';
import { CommentResponse, CommentsContentType } from './comments';
import { ContentTypeEnum } from './common';
import { UserResponse } from './user';

/**
 * Feed content type filter
 */
export type FeedContentType =
    | ContentTypeEnum.COLLECTION
    | ContentTypeEnum.ARTICLE
    | ContentTypeEnum.COMMENT;

/**
 * Article content type filter for feed (includes no_content)
 */
export type FeedArticleContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL
    | 'no_content';

/**
 * Article category filter for feed
 */
export type FeedArticleCategory = Exclude<
    ArticleCategoryEnum,
    ArticleCategoryEnum.SYSTEM
>;

/**
 * Feed request arguments
 */
export interface FeedArgs {
    before?: string | null;
    content_type?: FeedContentType | null;
    collection_content_types?: CollectionContentType[] | null;
    comment_content_types?: CommentsContentType[] | null;
    article_content_types?: FeedArticleContentType[] | null;
    article_categories?: FeedArticleCategory[] | null;
    feed_content_types?: FeedContentType[] | null;
    only_followed?: boolean;
}

/**
 * Comment response specific to feed (author includes is_followed)
 */
export interface CommentResponseFeed
    extends Omit<CommentResponse, 'author' | 'data_type'> {
    data_type: ContentTypeEnum.COMMENT;
    author: UserResponse & { is_followed: boolean };
}

/**
 * Feed item response (discriminated union)
 */
export type FeedItemResponse =
    | ArticlePreviewResponse
    | CommentResponseFeed
    | CollectionResponse<CollectionContent>;

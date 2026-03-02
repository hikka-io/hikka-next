import type {
    ArticlePreviewResponse,
    CollectionContent,
    CollectionResponse,
    CommentResponse,
    HistoryResponse,
} from '@hikka/client';
import { ContentTypeEnum } from '@hikka/client';

export enum FeedFilterEnum {
    ALL = 'all',
    COMMENTS = 'comments',
    ARTICLES = 'articles',
    COLLECTIONS = 'collections',
    ACTIVITY = 'activity',
}

interface BaseFeedItem {
    reference: string;
    created: number;
}

export interface FeedArticleItem extends BaseFeedItem {
    data_type: ContentTypeEnum.ARTICLE;
    data: ArticlePreviewResponse;
}

export interface FeedCollectionItem extends BaseFeedItem {
    data_type: ContentTypeEnum.COLLECTION;
    data: CollectionResponse<CollectionContent>;
}

export interface FeedCommentItem extends BaseFeedItem {
    data_type: ContentTypeEnum.COMMENT;
    data: CommentResponse;
}

export interface FeedHistoryItem extends BaseFeedItem {
    data_type: ContentTypeEnum.HISTORY;
    data: HistoryResponse;
}

export type FeedItem =
    | FeedArticleItem
    | FeedCollectionItem
    | FeedCommentItem
    | FeedHistoryItem;

export interface WidgetConfig {
    id: string;
    visible: boolean;
}

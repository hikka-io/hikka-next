import { ContentTypeEnum } from '@hikka/client';
import type {
    ArticlePreviewResponse,
    CollectionContent,
    CollectionResponse,
    CommentResponse,
    HistoryResponse,
} from '@hikka/client';

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

export const AVAILABLE_WIDGETS = [
    { id: 'watching', title: 'Дивлюсь' },
    { id: 'calendar', title: 'Календар' },
] as const;

export const FEED_FILTER_OPTIONS: Record<
    FeedFilterEnum,
    { label: string; data_type?: ContentTypeEnum }
> = {
    [FeedFilterEnum.ALL]: { label: 'Усі' },
    [FeedFilterEnum.COMMENTS]: {
        label: 'Коментарі',
        data_type: ContentTypeEnum.COMMENT,
    },
    [FeedFilterEnum.ARTICLES]: {
        label: 'Статті',
        data_type: ContentTypeEnum.ARTICLE,
    },
    [FeedFilterEnum.COLLECTIONS]: {
        label: 'Колекції',
        data_type: ContentTypeEnum.COLLECTION,
    },
    [FeedFilterEnum.ACTIVITY]: {
        label: 'Активність',
        data_type: ContentTypeEnum.HISTORY,
    },
};

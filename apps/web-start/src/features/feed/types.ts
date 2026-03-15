export enum FeedFilterEnum {
    ALL = 'all',
    COMMENTS = 'comments',
    ARTICLES = 'articles',
    COLLECTIONS = 'collections',
}

export interface WidgetConfig {
    id: string;
    visible: boolean;
}

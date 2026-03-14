export enum FeedFilterEnum {
    ALL = 'all',
    COMMENTS = 'comments',
    ARTICLES = 'articles',
    COLLECTIONS = 'collections',
    ACTIVITY = 'activity',
}

export interface WidgetConfig {
    id: string;
    visible: boolean;
}

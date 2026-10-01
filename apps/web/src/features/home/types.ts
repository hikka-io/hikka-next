import type { UiFeedWidget } from '@hikka/api';

export type HomeCollectionsTab = 'popular' | 'newest' | 'own';

export type UIFeedWidgetSide = UiFeedWidget['side'];
export type UIFeedWidgetSlug = UiFeedWidget['slug'];

/** Slugs this app renders; excludes server-only `top_anime`, which has no widget yet. */
export type SupportedWidgetSlug = Extract<
    UiFeedWidget['slug'],
    | 'profile'
    | 'list'
    | 'ongoings'
    | 'tracker'
    | 'history'
    | 'schedule'
    | 'feed'
    | 'collections'
    | 'articles'
>;

export type WidgetProps = {
    side: UIFeedWidgetSide;
    isLast?: boolean;
};

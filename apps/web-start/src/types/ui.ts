/**
 * App-owned UI and customization types.
 *
 * These were historically defined in `the legacy client` (`types/ui.ts`). The
 * generated `@hikka/api` UI types use a split Input/Output shape
 * (`UiStylesInput`/`UiStylesOutput`, `UiPreferencesInput`/`Output`, etc.) and
 * inline the language/score/widget unions, which does not match how the app
 * consumes a single unified UI object across its editor stores, merge helpers,
 * and SSR injection. To keep the app compiling with the least churn — and to
 * let `the legacy client` be deleted — these presentation types now live in the
 * app and are the single source of truth for the UI customization system.
 *
 * The data hooks (`use-session-ui`, `use-update-session-ui`) talk to the
 * generated `@hikka/api` endpoints; these types are cast at that boundary
 * (the generated `UserCustomizationArgs`/`Response` are structurally
 * compatible supersets).
 */

/**
 * Title language options
 */
export type TitleLanguage =
    | 'title_en'
    | 'title_ja'
    | 'title_ua'
    | 'title_original';

/**
 * Name language options
 */
export type NameLanguage = 'name_en' | 'name_ja' | 'name_ua' | 'name_native';

export type HSLColor = {
    h: number;
    s: number;
    l: number;
};

export type UIColorTokens = {
    background?: HSLColor;
    foreground?: HSLColor;
    primary?: HSLColor;
    primary_foreground?: HSLColor;
    primary_border?: HSLColor;
    secondary?: HSLColor;
    secondary_foreground?: HSLColor;
    muted?: HSLColor;
    muted_foreground?: HSLColor;
    accent_foreground?: HSLColor;
    border?: HSLColor;
    ring?: HSLColor;
    popover?: HSLColor;
    popover_foreground?: HSLColor;
    // Sidebar colors
    sidebar_background?: HSLColor;
    sidebar_foreground?: HSLColor;
    sidebar_primary?: HSLColor;
    sidebar_primary_foreground?: HSLColor;
    sidebar_accent?: HSLColor;
    sidebar_accent_foreground?: HSLColor;
    sidebar_border?: HSLColor;
    sidebar_ring?: HSLColor;
};

export type UIThemeStyles = {
    colors?: UIColorTokens;
    body?: {
        background_image?: string;
    };
};

export type UIStyles = {
    dark?: UIThemeStyles;
    light?: UIThemeStyles;
    radius?: string;
    typography?: {
        h1?: string;
        h2?: string;
        h3?: string;
        h4?: string;
        h5?: string;
        p?: string;
    };
};

export type UIEffect = 'snowfall' | 'sakura';

export type UIScoreType = 'mal' | 'native';

export enum HomeWidgetsEnum {
    LIST = 'list',
    PROFILE = 'profile',
    FEED = 'feed',
    TRACKER = 'tracker',
    HISTORY = 'history',
    ONGOINGS = 'ongoings',
    SCHEDULE = 'schedule',
}

export type UIFeedWidgetSide = 'left' | 'center' | 'right';

export type UIFeedWidgetSlug =
    | 'list'
    | 'profile'
    | 'feed'
    | 'tracker'
    | 'history'
    | 'ongoings'
    | 'schedule';

export type UIFeedWidget = {
    side: UIFeedWidgetSide;
    slug: UIFeedWidgetSlug;
    order: number;
};

/**
 * Collection content types allowed in feed settings.
 * (Inlined from the former `the legacy client` `CollectionContentType`.)
 */
export type FeedCollectionContentType =
    | 'character'
    | 'person'
    | 'anime'
    | 'manga'
    | 'novel';

/**
 * Comment content types allowed in feed settings.
 * (Inlined from the former `the legacy client` `CommentsContentType`.)
 */
export type FeedCommentContentType =
    | 'collection'
    | 'character'
    | 'edit'
    | 'article'
    | 'person'
    | 'anime'
    | 'manga'
    | 'novel';

/**
 * Article content type filter for feed (includes no_content).
 */
export type FeedArticleContentType =
    | 'anime'
    | 'manga'
    | 'novel'
    | 'no_content';

/**
 * Article category filter for feed.
 */
export type FeedArticleCategory = 'original' | 'reviews' | 'news';

/**
 * Feed content types.
 */
export type FeedContentType = 'collection' | 'article' | 'comment';

export type UIFeedSettings = {
    collection_content_types?: FeedCollectionContentType[] | null;
    comment_content_types?: FeedCommentContentType[] | null;
    article_content_types?: FeedArticleContentType[] | null;
    article_categories?: FeedArticleCategory[] | null;
    feed_content_types?: FeedContentType[] | null;
    only_followed?: boolean;
    widgets: UIFeedWidget[];
};

export type UIPreferences = {
    score?: UIScoreType;
    title_language?: TitleLanguage;
    name_language?: NameLanguage;
    effect?: UIEffect | null;
    effects?: UIEffect[] | null;
    overlay?: boolean;
    feed: UIFeedSettings;
    home_widgets: HomeWidgetsEnum[];
};

export type UserUI = {
    styles: UIStyles;
    preferences: UIPreferences;
};

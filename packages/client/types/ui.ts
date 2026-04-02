/**
 * UI and customization types.
 *
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

export type UIEffect = 'snowfall';

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

export type UIFeedSettings = {
    widgets: UIFeedWidget[];
};

export type UIPreferences = {
    score?: UIScoreType;
    title_language?: TitleLanguage;
    name_language?: NameLanguage;
    effects?: UIEffect[];
    overlay?: boolean;
    feed: UIFeedSettings;
    home_widgets: HomeWidgetsEnum[];
};

export type UserUI = {
    styles: UIStyles;
    preferences: UIPreferences;
};

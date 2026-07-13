import {
    type OklchColor,
    type UiStylesOutput,
    UiWidgetEnum,
    type UserCustomizationResponse,
} from '@hikka/api';

/** The default accent seed — the single source of truth for the brand color. */
export const DEFAULT_BRAND: OklchColor = { l: 0.7, c: 0.18, h: 343 };

/** The default ambient-glow hue — a violet distinct from the pink brand. */
export const DEFAULT_BACKDROP_COLOR: OklchColor = {
    l: 0.637,
    c: 0.186,
    h: 304.8,
};

/**
 * Default UI styles. The whole accent palette derives from `brand`; the
 * `backdrop` is the ambient page glow, which defaults to a violet hue rather
 * than following the brand. Neutrals and status colors live as fixed constants
 * in globals.css.
 */
export const DEFAULT_STYLES: UiStylesOutput = {
    brand: DEFAULT_BRAND,
    backdrop: {
        style: 'glow',
        intensity: 0.3,
        height: 1,
        color: DEFAULT_BACKDROP_COLOR,
    },
    radius: '0.625rem',
};

export const DEFAULT_USER_UI: UserCustomizationResponse = {
    styles: DEFAULT_STYLES,
    preferences: {
        title_language: 'title_ua',
        name_language: 'name_ua',
        overlay: true,
        home_widgets: [
            UiWidgetEnum.TRACKER,
            UiWidgetEnum.HISTORY,
            UiWidgetEnum.ONGOINGS,
            UiWidgetEnum.SCHEDULE,
        ],
        feed: {
            widgets: [
                { side: 'left', slug: 'profile', order: 1 },
                { side: 'left', slug: 'list', order: 2 },
                { side: 'left', slug: 'collections', order: 3 },

                { side: 'right', slug: 'tracker', order: 1 },
                { side: 'right', slug: 'history', order: 2 },
                { side: 'right', slug: 'articles', order: 3 },

                { side: 'right', slug: 'schedule', order: 4 },
                { side: 'center', slug: 'ongoings', order: 1 },
                { side: 'center', slug: 'feed', order: 2 },
            ],
        },
    },
};

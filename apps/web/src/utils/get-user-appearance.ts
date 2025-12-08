import { cookies } from 'next/headers';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { stylesToCSS } from '@/utils/inject-styles';
import { UI_COOKIE_NAME, parseAppearanceFromCookie } from '@/utils/ui-cookies';

const DEFAULT_APPEARANCE: Hikka.UserAppearance = {
    styles: undefined,
    preferences: {
        titleLanguage: 'title_ua',
        nameLanguage: 'name_ua',
    },
    effects: [],
    version: 1,
};

function mergeStyles(
    base: Hikka.UIStyles | undefined,
    override: Hikka.UIStyles | undefined,
): Hikka.UIStyles {
    if (!base && !override) return {};
    if (!base) return override!;
    if (!override) return base;

    return {
        light: {
            colors: {
                ...base.light?.colors,
                ...override.light?.colors,
            },
        },
        dark: {
            colors: {
                ...base.dark?.colors,
                ...override.dark?.colors,
            },
        },
        radius: override.radius ?? base.radius,
    };
}

/**
 * Get user appearance from cookies
 */
export async function getUserAppearance(): Promise<Hikka.UserAppearance> {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(UI_COOKIE_NAME)?.value;
    const appearance = parseAppearanceFromCookie(cookieValue);

    return appearance ?? DEFAULT_APPEARANCE;
}

/**
 * Get merged styles as CSS string for SSR injection
 */
export async function getUserStylesCSS(): Promise<string> {
    const appearance = await getUserAppearance();
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, appearance.styles);

    return stylesToCSS(mergedStyles);
}

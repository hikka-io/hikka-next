import { cookies } from 'next/headers';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { DEFAULT_APPEARANCE } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';
import { parseAppearanceFromCookie, UI_COOKIE_NAME } from './ui-cookie';

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


import { UserUI } from '@hikka/client';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';

/**
 * Convert a UserUI to a CSS string for SSR injection.
 * Merges with active event theme before converting.
 */
export function getUserStylesCSS(userUI: UserUI): string {
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, userUI.styles);
    return stylesToCSS(mergedStyles);
}

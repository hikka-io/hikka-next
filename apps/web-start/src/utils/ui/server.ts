import type { UserCustomizationResponse } from '@hikka/api';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';

/**
 * Convert a UserCustomizationResponse to a CSS string for SSR injection.
 * Merges with active event theme before converting.
 */
export function getUserStylesCSS(userUI: UserCustomizationResponse): string {
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, userUI.styles);
    return stylesToCSS(mergedStyles);
}

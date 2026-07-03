import type { UserCustomizationResponse } from '@hikka/api';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { type ResolvedBackdrop, resolveBackdrop } from './backdrop';
import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';

/**
 * Resolve a UserCustomizationResponse into the SSR-injectable CSS string and
 * the backdrop descriptor. Merges the active event theme before converting.
 */
export function getUserStyles(userUI: UserCustomizationResponse): {
    css: string;
    backdrop: ResolvedBackdrop;
} {
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, userUI.styles);
    return {
        css: stylesToCSS(mergedStyles),
        backdrop: resolveBackdrop(mergedStyles),
    };
}

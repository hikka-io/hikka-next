import type { UiStylesOutput, UserCustomizationResponse } from '@hikka/api';

import { type ResolvedBackdrop, resolveBackdrop } from './backdrop';
import { DEFAULT_USER_UI } from './defaults';
import { type EventTheme, getActiveEventTheme } from './event-themes';
import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';

export function mergeUserStyles(
    defaults: UiStylesOutput | undefined,
    eventTheme: EventTheme | null,
    user: UiStylesOutput | undefined,
): UiStylesOutput {
    return mergeStyles(mergeStyles(defaults, eventTheme?.styles), user);
}

/**
 * Resolve a UserCustomizationResponse into the SSR-injectable CSS string and
 * the backdrop descriptor.
 */
export function getUserStyles(userUI: UserCustomizationResponse): {
    css: string;
    backdrop: ResolvedBackdrop;
} {
    const mergedStyles = mergeUserStyles(
        DEFAULT_USER_UI.styles,
        getActiveEventTheme(),
        userUI.styles,
    );
    return {
        css: stylesToCSS(mergedStyles),
        backdrop: resolveBackdrop(mergedStyles),
    };
}

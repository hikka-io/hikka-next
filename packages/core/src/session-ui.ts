import type {
    UiFeedSettingsOutput,
    UserCustomizationResponse,
} from '@hikka/api';

import { DEFAULT_USER_UI } from './customization-defaults';
import { diffStyles } from './customization-merge';

export type SessionUIPatch = {
    styles?: UserCustomizationResponse['styles'];
    preferences?: Partial<
        Omit<UserCustomizationResponse['preferences'], 'feed'> & {
            feed?: Partial<UiFeedSettingsOutput>;
        }
    >;
};

/**
 * The customization PUT replaces the whole document: `next` is the resolved state to show at
 * once, `payload` the body to send (styles diffed against the defaults, preferences complete).
 */
export function applySessionUIPatch(
    current: UserCustomizationResponse | undefined,
    patch: SessionUIPatch,
): { next: UserCustomizationResponse; payload: UserCustomizationResponse } {
    const base = current ?? DEFAULT_USER_UI;

    const preferences = patch.preferences
        ? {
              ...base.preferences,
              ...patch.preferences,
              feed: patch.preferences.feed
                  ? { ...base.preferences.feed, ...patch.preferences.feed }
                  : base.preferences.feed,
          }
        : base.preferences;

    const next: UserCustomizationResponse = {
        styles: patch.styles ?? base.styles,
        preferences,
    };

    return {
        next,
        payload: {
            styles: diffStyles(next.styles) || {},
            preferences: next.preferences,
        },
    };
}

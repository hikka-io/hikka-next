import * as SecureStore from 'expo-secure-store';
import { Uniwind } from 'uniwind';
import { create } from 'zustand';

import type { OklchColor } from '@hikka/api';
import { brandTokens } from '@hikka/core';

export type ThemePreference = 'system' | 'light' | 'dark';

// Moves to the MMKV prefs store once a dev client exists; SecureStore reads synchronously, so the saved scheme is applied before the first frame.
const THEME_KEY = 'theme-preference';

const isThemePreference = (value: unknown): value is ThemePreference =>
    value === 'system' || value === 'light' || value === 'dark';

const readThemePreference = (): ThemePreference => {
    try {
        const stored = SecureStore.getItem(THEME_KEY);
        return isThemePreference(stored) ? stored : 'system';
    } catch {
        return 'system';
    }
};

type State = { theme: ThemePreference };
type Actions = { setTheme: (theme: ThemePreference) => void };

export const useThemeStore = create<State & Actions>((set) => ({
    theme: readThemePreference(),
    setTheme: (theme) => {
        Uniwind.setTheme(theme);
        set({ theme });
        SecureStore.setItemAsync(THEME_KEY, theme).catch(() => undefined);
    },
}));

/** Applies the saved scheme at startup; the system scheme needs no call. */
export function applyStoredTheme() {
    const { theme } = useThemeStore.getState();

    if (theme !== 'system') Uniwind.setTheme(theme);
}

const BRAND_KEY = 'brand-accent';

const readStoredBrand = (): OklchColor | undefined => {
    try {
        const parsed = JSON.parse(SecureStore.getItem(BRAND_KEY) ?? 'null');

        return parsed &&
            [parsed.l, parsed.c, parsed.h].every((n) => typeof n === 'number')
            ? { l: parsed.l, c: parsed.c, h: parsed.h }
            : undefined;
    } catch {
        return undefined;
    }
};

/** Applies the accent for a brand seed (the default when none) to the tokens that derive from it. */
export function applyBrand(brand: OklchColor | undefined) {
    const tokens = brandTokens(brand);

    Uniwind.updateCSSVariables('light', tokens.light);
    Uniwind.updateCSSVariables('dark', tokens.dark);
}

/** Remembers the viewer's accent so the next cold start paints it from the first frame, not the default. */
export function storeBrand(brand: OklchColor | undefined) {
    const value = brand ? JSON.stringify(brand) : null;

    (value
        ? SecureStore.setItemAsync(BRAND_KEY, value)
        : SecureStore.deleteItemAsync(BRAND_KEY)
    ).catch(() => undefined);
}

/** Applies the saved scheme and accent at startup, before the first frame. */
export function applyStoredAppearance() {
    applyStoredTheme();
    applyBrand(readStoredBrand());
}

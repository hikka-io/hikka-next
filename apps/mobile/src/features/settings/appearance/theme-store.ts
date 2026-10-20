import * as SecureStore from 'expo-secure-store';
import { Uniwind } from 'uniwind';
import { create } from 'zustand';

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

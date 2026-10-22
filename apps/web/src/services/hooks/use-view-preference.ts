import {
    UI_PREFS_DEFAULTS,
    useUiPreferences,
} from '@/services/ui-preferences-store';
import type { View } from '@/utils/cookies';

const DEFAULT_VIEW: View = 'grid';

/** Persisted view mode of a list page (grid | list | table), by its preference key. */
export function useViewPreference(key: string) {
    const view = useUiPreferences(
        (state) =>
            state.views[key] ?? UI_PREFS_DEFAULTS.views[key] ?? DEFAULT_VIEW,
    );
    const setView = useUiPreferences((state) => state.setView);

    return {
        view,
        setView: (next: View) => setView(key, next),
    };
}

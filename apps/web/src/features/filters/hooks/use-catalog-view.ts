import {
    UI_PREFS_DEFAULTS,
    useUiPreferences,
} from '@/services/stores/ui-preferences-store';

const DEFAULT_KEY = 'catalog';
const DEFAULT_VIEW: Hikka.View = 'grid';

/** Persisted view mode for a catalog page (grid | list | table). */
export function useCatalogView(key: string = DEFAULT_KEY) {
    const view = useUiPreferences(
        (state) =>
            state.views[key] ?? UI_PREFS_DEFAULTS.views[key] ?? DEFAULT_VIEW,
    );
    const setView = useUiPreferences((state) => state.setView);

    return {
        view,
        setView: (next: Hikka.View) => setView(key, next),
    };
}

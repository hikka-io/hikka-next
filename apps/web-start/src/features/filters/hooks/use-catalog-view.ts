'use client';

import { useSettingsStore } from '@/services/stores/settings-store';

const DEFAULT_KEY = 'anime_catalog';
const DEFAULT_VIEW: Hikka.View = 'grid';

/**
 * Persisted view mode for a catalog page (grid | list | table).
 */
export function useCatalogView(key: string = DEFAULT_KEY) {
    const view = useSettingsStore(
        (state) => state.preferences.views[key] ?? DEFAULT_VIEW,
    );
    const setViewPreference = useSettingsStore(
        (state) => state.setViewPreference,
    );

    return {
        view,
        setView: (next: Hikka.View) => setViewPreference(key, next),
    };
}

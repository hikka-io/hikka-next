'use client';

import { useSettingsStore } from '@/services/stores/settings-store';

const KEY = 'anime_catalog';
const DEFAULT_VIEW: Hikka.View = 'grid';

/**
 * Persisted view mode for the /anime catalog (grid | list | table).
 */
export function useCatalogView() {
    const view = useSettingsStore(
        (state) => state.preferences.views[KEY] ?? DEFAULT_VIEW,
    );
    const setViewPreference = useSettingsStore(
        (state) => state.setViewPreference,
    );

    return {
        view,
        setView: (next: Hikka.View) => setViewPreference(KEY, next),
    };
}

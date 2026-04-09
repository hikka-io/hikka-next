'use client';

import { useSettingsStore } from '@/services/stores/settings-store';

const DEFAULT_KEY = 'catalog_filters_sidebar';

/**
 * Persisted preference for whether the catalog filters sidebar is visible.
 * Shared across anime/manga/novel catalog pages so the choice sticks.
 */
export function useFiltersSidebar(key: string = DEFAULT_KEY) {
    const visible = useSettingsStore(
        (state) => state.preferences.collapsibles[key] ?? true,
    );
    const setCollapsible = useSettingsStore((state) => state.setCollapsible);

    return {
        visible,
        setVisible: (next: boolean) => setCollapsible(key, next),
        toggle: () => setCollapsible(key, !visible),
    };
}

import { useUiPreferences } from '@/services/ui-preferences-store';
import { CATALOG_FILTERS_SIDEBAR_KEY } from '@/utils/cookies';

/** Persisted sidebar-visible preference, shared across anime/manga/novel catalog pages. */
export function useFiltersSidebar(key: string = CATALOG_FILTERS_SIDEBAR_KEY) {
    const visible = useUiPreferences(
        (state) => state.collapsibles[key] ?? true,
    );
    const setCollapsible = useUiPreferences((state) => state.setCollapsible);

    return {
        visible,
        setVisible: (next: boolean) => setCollapsible(key, next),
        toggle: () => setCollapsible(key, !visible),
    };
}

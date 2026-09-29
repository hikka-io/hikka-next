import { useUiPreferences } from '@/services/stores/ui-preferences-store';

const DEFAULT_KEY = 'catalog_filters_sidebar';

/** Persisted sidebar-visible preference, shared across anime/manga/novel catalog pages. */
export function useFiltersSidebar(key: string = DEFAULT_KEY) {
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

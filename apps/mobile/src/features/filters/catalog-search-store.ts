import { create } from 'zustand';

import type { CatalogSearch, CatalogType } from './filter-params';

type CatalogSearchState = {
    searches: Partial<Record<CatalogType, CatalogSearch>>;
    /** Display names of picked studios, which have no lookup by slug. */
    names: Record<string, string>;
    update: (
        type: CatalogType,
        updater: (search: CatalogSearch) => CatalogSearch,
    ) => void;
    rememberName: (slug: string, name: string) => void;
};

const EMPTY_SEARCH: CatalogSearch = {};

/** In memory, one search per content type, like the web keeps one URL per catalog page. */
const useCatalogSearchStore = create<CatalogSearchState>()((set) => ({
    searches: {},
    names: {},
    update: (type, updater) =>
        set((state) => ({
            searches: {
                ...state.searches,
                [type]: updater(state.searches[type] ?? EMPTY_SEARCH),
            },
        })),
    rememberName: (slug, name) =>
        set((state) => ({ names: { ...state.names, [slug]: name } })),
}));

export function useCatalogSearch(type: CatalogType) {
    return useCatalogSearchStore(
        (state) => state.searches[type] ?? EMPTY_SEARCH,
    );
}

export function useUpdateCatalogSearch(type: CatalogType) {
    const update = useCatalogSearchStore((state) => state.update);

    return (updater: (search: CatalogSearch) => CatalogSearch) =>
        update(type, updater);
}

export function useFilterNames() {
    return useCatalogSearchStore((state) => state.names);
}

export function useRememberName() {
    return useCatalogSearchStore((state) => state.rememberName);
}

import { create } from 'zustand';

import type { CatalogSearch } from '@/features/filters';

type State = {
    searches: Record<string, CatalogSearch>;
    update: (
        key: string,
        updater: (search: CatalogSearch) => CatalogSearch,
    ) => void;
    reset: (key: string) => void;
};

const EMPTY_SEARCH: CatalogSearch = {};

/** Filters of the open list screens in memory, one entry per screen instance and type: the web keeps them in the page URL, so the same list open twice has separate filters. */
const useStore = create<State>()((set) => ({
    searches: {},
    update: (key, updater) =>
        set((state) => ({
            searches: {
                ...state.searches,
                [key]: updater(state.searches[key] ?? EMPTY_SEARCH),
            },
        })),
    reset: (key) =>
        set((state) => {
            const { [key]: _removed, ...searches } = state.searches;

            return { searches };
        }),
}));

/** The navigation route key tells two screens of the same list apart; the type resets the entry when the screen switches it. */
export const userListFiltersKey = (routeKey: string, contentType: string) =>
    `${routeKey}/${contentType}`;

export const useUserListFilters = (key: string) =>
    useStore((state) => state.searches[key] ?? EMPTY_SEARCH);

export const useUpdateUserListFilters = (key: string) => {
    const update = useStore((state) => state.update);

    return (updater: (search: CatalogSearch) => CatalogSearch) =>
        update(key, updater);
};

export const useResetUserListFilters = () => useStore((state) => state.reset);

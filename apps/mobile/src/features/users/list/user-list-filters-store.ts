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

/** Filters of the open list screens in memory, one per user and type: the web keeps them in the page URL. */
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

export const userListFiltersKey = (username: string, contentType: string) =>
    `${username.toLowerCase()}/${contentType}`;

export const useUserListFilters = (key: string) =>
    useStore((state) => state.searches[key] ?? EMPTY_SEARCH);

export const useUpdateUserListFilters = (key: string) => {
    const update = useStore((state) => state.update);

    return (updater: (search: CatalogSearch) => CatalogSearch) =>
        update(key, updater);
};

export const useResetUserListFilters = () => useStore((state) => state.reset);

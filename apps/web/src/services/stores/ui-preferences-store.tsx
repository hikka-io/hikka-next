import {
    createContext,
    type FC,
    type ReactNode,
    useContext,
    useState,
} from 'react';

import { createStore, useStore } from 'zustand';

import { ContentTypeEnum } from '@hikka/api';

import { type UiPreferences, writeUiPrefsCookie } from '@/utils/cookies';

// Fallbacks applied at read time; the cookie stores only explicit choices.
export const UI_PREFS_DEFAULTS = {
    views: {
        franchise: 'list',
        userlist: 'table',
    } as Record<string, Hikka.View>,
    filters: {
        franchiseContentTypes: [
            ContentTypeEnum.ANIME,
            ContentTypeEnum.MANGA,
            ContentTypeEnum.NOVEL,
        ] as string[],
    },
};

export type UiPreferencesActions = {
    setView: (key: string, view: Hikka.View) => void;
    setFilter: (key: string, values: string[]) => void;
    setCollapsible: (key: string, open: boolean) => void;
};

export type UiPreferencesStore = UiPreferences & UiPreferencesActions;

const EMPTY_PREFS: UiPreferences = {
    views: {},
    filters: {},
    collapsibles: {},
};

const persist = (state: UiPreferencesStore) => {
    writeUiPrefsCookie({
        views: state.views,
        filters: state.filters,
        collapsibles: state.collapsibles,
    });
};

const createUiPreferencesStore = (initial: UiPreferences | null) =>
    createStore<UiPreferencesStore>()((set, get) => ({
        ...EMPTY_PREFS,
        ...initial,
        setView: (key, view) => {
            set((state) => ({ views: { ...state.views, [key]: view } }));
            persist(get());
        },
        setFilter: (key, values) => {
            set((state) => ({ filters: { ...state.filters, [key]: values } }));
            persist(get());
        },
        setCollapsible: (key, open) => {
            set((state) => ({
                collapsibles: { ...state.collapsibles, [key]: open },
            }));
            persist(get());
        },
    }));

type UiPreferencesStoreApi = ReturnType<typeof createUiPreferencesStore>;

const UiPreferencesContext = createContext<UiPreferencesStoreApi | null>(null);

type Props = {
    initial: UiPreferences | null;
    children: ReactNode;
};

export const UiPreferencesProvider: FC<Props> = ({ initial, children }) => {
    const [store] = useState(() => createUiPreferencesStore(initial));

    return (
        <UiPreferencesContext.Provider value={store}>
            {children}
        </UiPreferencesContext.Provider>
    );
};

export function useUiPreferences<T>(
    selector: (store: UiPreferencesStore) => T,
): T {
    const store = useContext(UiPreferencesContext);
    if (!store) {
        throw new Error(
            'useUiPreferences must be used within UiPreferencesProvider',
        );
    }
    return useStore(store, selector);
}

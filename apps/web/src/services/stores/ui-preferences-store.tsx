import {
    createContext,
    type FC,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { createStore, useStore } from 'zustand';

import { ContentTypeEnum } from '@hikka/api';

import {
    parseUiPrefs,
    UI_PREFS_COOKIE,
    type UiPreferences,
    writeUiPrefsCookie,
} from '@/utils/cookies';

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

// Legacy localStorage keys that never migrate: dead defaults and per-type
// catalog view keys superseded by the unified 'catalog' key.
const DEAD_VIEW_KEYS = ['anime_catalog', 'manga_catalog', 'novel_catalog'];

const omitKeys = <T,>(record: Record<string, T>, dead: string[]) =>
    Object.fromEntries(
        Object.entries(record).filter(([key]) => !dead.includes(key)),
    );

/** One-time migration: seed the cookie from the legacy localStorage prefs. */
const migrateLegacyPreferences = (store: UiPreferencesStoreApi) => {
    if (document.cookie.includes(`${UI_PREFS_COOKIE}=`)) return;

    try {
        const settings = localStorage.getItem('settings');
        if (!settings) return;

        // Round-trip through the codec to reuse it as the shape validator.
        const legacy = parseUiPrefs(
            encodeURIComponent(
                JSON.stringify(JSON.parse(settings)?.state?.preferences),
            ),
        );
        if (!legacy) return;

        const migrated: UiPreferences = {
            views: omitKeys(legacy.views, DEAD_VIEW_KEYS) as Record<
                string,
                Hikka.View
            >,
            filters: legacy.filters,
            collapsibles: omitKeys(
                legacy.collapsibles,
                Object.keys(legacy.collapsibles).filter((key) =>
                    key.startsWith('home_'),
                ),
            ),
        };

        store.setState(migrated);
        writeUiPrefsCookie(migrated);
    } catch {
        // Corrupt legacy state: skip migration, defaults apply.
    }
};

type Props = {
    initial: UiPreferences | null;
    children: ReactNode;
};

export const UiPreferencesProvider: FC<Props> = ({ initial, children }) => {
    const [store] = useState(() => createUiPreferencesStore(initial));

    useEffect(() => {
        migrateLegacyPreferences(store);
    }, [store]);

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

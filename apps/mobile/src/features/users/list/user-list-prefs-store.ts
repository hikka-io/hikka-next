import { create } from 'zustand';

export type UserListView = 'grid' | 'list';

type UserListPrefsState = {
    view: UserListView;
    setView: (view: UserListView) => void;
};

/** In memory until the app has a persistent prefs store, like the catalog's view. */
export const useUserListPrefs = create<UserListPrefsState>()((set) => ({
    view: 'list',
    setView: (view) => set({ view }),
}));

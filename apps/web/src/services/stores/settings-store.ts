import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    editTags: string[];
    filterPresets: Hikka.FilterPreset[];
    _hasHydrated: boolean;
}

export interface SettingsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setEditTags: (editTags: string[]) => void;
    setFilterPresets: (filterPresets: Hikka.FilterPreset[]) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    _hasHydrated: false,
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    filterPresets: [
        {
            name: 'Нещодавно завершені',
            description: 'Завершені аніме попереднього сезону',
            content_types: ['anime'],
            statuses: ['finished'],
            date_range_enabled: true,
            date_range: [-1, 0],
            id: 'ffc33695-017c-4404-9c5d-7b76864a6cfb',
        },
    ],
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
            setEditTags: (editTags) => set({ editTags }),
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<SettingsState>;

                // Migrate filter presets: sort was string[], now string
                const filterPresets = (
                    persisted?.filterPresets ?? currentState.filterPresets
                ).map((preset) => ({
                    ...preset,
                    sort: Array.isArray(preset.sort)
                        ? (preset.sort[0] as string | undefined)
                        : preset.sort,
                }));

                return {
                    ...currentState,
                    ...persisted,
                    filterPresets,
                };
            },
        },
    ),
);

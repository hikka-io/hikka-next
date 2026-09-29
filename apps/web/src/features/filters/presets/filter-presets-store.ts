import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FilterPreset } from './types';

export interface FilterPresetsState {
    filterPresets: FilterPreset[];
    _hasHydrated: boolean;
}

export interface FilterPresetsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setFilterPresets: (filterPresets: FilterPreset[]) => void;
    reset: () => void;
}

const DEFAULT_FILTER_PRESETS: FilterPresetsState = {
    _hasHydrated: false,
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

// Pre-split 'settings' key; never remove it, the edit-tags store also migrates from it.
const readLegacyFilterPresets = (): FilterPreset[] | undefined => {
    try {
        return JSON.parse(window.localStorage.getItem('settings') ?? 'null')
            ?.state?.filterPresets;
    } catch {
        return undefined;
    }
};

export type FilterPresetsStore = FilterPresetsState & FilterPresetsActions;

export const useFilterPresetsStore = create<FilterPresetsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_FILTER_PRESETS,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            reset: () => set(DEFAULT_FILTER_PRESETS),
        }),
        {
            name: 'filter-presets', // localStorage key
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
            merge: (persistedState, currentState) => {
                const persisted = persistedState as
                    | Partial<FilterPresetsState>
                    | undefined;

                // Migrate filter presets: sort was string[], now string
                const filterPresets = (
                    persisted?.filterPresets ??
                    readLegacyFilterPresets() ??
                    currentState.filterPresets
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

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { newId } from './new-id';
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

const stringList = z.array(z.string()).optional().catch(undefined);
const numberList = z.array(z.number()).optional().catch(undefined);
const flag = z.boolean().optional().catch(undefined);

const storedFilterPresetSchema = z
    .object({
        id: z.string().catch(newId),
        name: z.string().catch(''),
        description: z.string().optional().catch(undefined),
        content_types: z.array(z.string()).catch([]),
        statuses: stringList,
        seasons: stringList,
        types: stringList,
        genres: stringList,
        ratings: stringList,
        studios: stringList,
        only_translated: flag,
        // Migrate filter presets: sort was string[], now string
        sort: z
            .preprocess(
                (sort) => (Array.isArray(sort) ? sort[0] : sort),
                z.string().optional(),
            )
            .catch(undefined),
        order: z.string().optional().catch(undefined),
        years: numberList,
        score: numberList,
        date_range_enabled: flag,
        date_range: z.array(z.number()).nullable().optional().catch(undefined),
    })
    .passthrough();

const parseStoredFilterPresets = (presets: unknown[]): FilterPreset[] =>
    presets.flatMap((preset) => {
        const parsed = storedFilterPresetSchema.safeParse(preset);
        return parsed.success ? [parsed.data as FilterPreset] : [];
    });

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

                const stored: unknown =
                    persisted?.filterPresets ??
                    readLegacyFilterPresets() ??
                    currentState.filterPresets;
                const filterPresets = Array.isArray(stored)
                    ? parseStoredFilterPresets(stored)
                    : currentState.filterPresets;

                return {
                    ...currentState,
                    ...persisted,
                    filterPresets,
                };
            },
        },
    ),
);

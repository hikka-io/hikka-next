import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { MainContentTypeEnum } from '@hikka/api';

import type { GraphEdgeType } from '../franchise-model';

export type GraphLabels = 'all' | 'focus' | 'none';

export type GraphFiltersState = {
    /** Relation types switched against the franchise's own default; `true` shows the type. */
    relations: Partial<Record<GraphEdgeType, boolean>>;
    hiddenMedia: MainContentTypeEnum[];
    mine: boolean;
    hideUnlinked: boolean;
    /** `null` keeps the device's default. */
    labels: GraphLabels | null;
    order: boolean;
    /** A view mode rather than a filter: it is not counted and survives a reset. */
    horizontal: boolean;
    hintSeen: boolean;
};

export type GraphFiltersActions = {
    setRelation: (
        type: GraphEdgeType,
        shown: boolean,
        byDefault: boolean,
    ) => void;
    toggleMedia: (type: MainContentTypeEnum) => void;
    toggleMine: () => void;
    toggleHideUnlinked: () => void;
    setLabels: (labels: GraphLabels, byDefault: GraphLabels) => void;
    toggleOrder: () => void;
    toggleHorizontal: () => void;
    dismissHint: () => void;
    reset: () => void;
};

const DEFAULTS: GraphFiltersState = {
    relations: {},
    hiddenMedia: [],
    mine: false,
    hideUnlinked: false,
    labels: null,
    order: true,
    horizontal: false,
    hintSeen: false,
};

// Rehydrated after mount (see FranchiseGraph), so the first client render matches the server's.
export const useGraphFiltersStore = create<
    GraphFiltersState & GraphFiltersActions
>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            setRelation: (type, shown, byDefault) =>
                set((state) => {
                    const { [type]: _, ...relations } = state.relations;
                    return {
                        relations:
                            shown === byDefault
                                ? relations
                                : { ...relations, [type]: shown },
                    };
                }),
            toggleMedia: (type) =>
                set((state) => ({
                    hiddenMedia: state.hiddenMedia.includes(type)
                        ? state.hiddenMedia.filter((item) => item !== type)
                        : [...state.hiddenMedia, type],
                })),
            toggleMine: () => set((state) => ({ mine: !state.mine })),
            toggleHideUnlinked: () =>
                set((state) => ({ hideUnlinked: !state.hideUnlinked })),
            setLabels: (labels, byDefault) =>
                set({ labels: labels === byDefault ? null : labels }),
            toggleOrder: () => set((state) => ({ order: !state.order })),
            toggleHorizontal: () =>
                set((state) => ({ horizontal: !state.horizontal })),
            dismissHint: () => set({ hintSeen: true }),
            reset: () =>
                set((state) => ({
                    ...DEFAULTS,
                    relations: state.relations,
                    horizontal: state.horizontal,
                    hintSeen: state.hintSeen,
                })),
        }),
        {
            name: 'franchise-graph-filters',
            skipHydration: true,
            partialize: ({
                relations,
                hiddenMedia,
                mine,
                hideUnlinked,
                labels,
                order,
                horizontal,
                hintSeen,
            }) => ({
                relations,
                hiddenMedia,
                mine,
                hideUnlinked,
                labels,
                order,
                horizontal,
                hintSeen,
            }),
        },
    ),
);

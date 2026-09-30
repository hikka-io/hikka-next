import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditTagsState {
    editTags: string[];
    _hasHydrated: boolean;
}

interface EditTagsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setEditTags: (editTags: string[]) => void;
    reset: () => void;
}

const DEFAULT_EDIT_TAGS: EditTagsState = {
    _hasHydrated: false,
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
};

// Pre-split 'settings' key; never remove it, the filter-presets store also migrates from it.
const readLegacyEditTags = (): string[] | undefined => {
    try {
        return JSON.parse(window.localStorage.getItem('settings') ?? 'null')
            ?.state?.editTags;
    } catch {
        return undefined;
    }
};

export type EditTagsStore = EditTagsState & EditTagsActions;

export const useEditTagsStore = create<EditTagsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_EDIT_TAGS,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
            setEditTags: (editTags) => set({ editTags }),
            reset: () => set(DEFAULT_EDIT_TAGS),
        }),
        {
            name: 'edit-tags',
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
            merge: (persistedState, currentState) => {
                const persisted = persistedState as
                    | Partial<EditTagsState>
                    | undefined;

                return {
                    ...currentState,
                    ...persisted,
                    editTags:
                        persisted?.editTags ??
                        readLegacyEditTags() ??
                        currentState.editTags,
                };
            },
        },
    ),
);

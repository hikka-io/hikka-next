import { create } from 'zustand';

type State = {
    /** Explicit expand/collapse choices by comment reference; the rest follow their depth. */
    expanded: Record<string, boolean>;
};

type Actions = {
    setExpanded: (reference: string, expanded: boolean) => void;
};

/** In memory and shared by every thread screen, so a reply posted from the composer can open its parent. */
export const useCommentTreeStore = create<State & Actions>()((set) => ({
    expanded: {},
    setExpanded: (reference, expanded) =>
        set((state) => ({
            expanded: { ...state.expanded, [reference]: expanded },
        })),
}));

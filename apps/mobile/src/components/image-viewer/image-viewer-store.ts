import { create } from 'zustand';

type State = {
    urls: string[];
    index: number;
    alt?: string;
};

type Actions = {
    open: (urls: string[], index: number, alt?: string) => void;
    close: () => void;
};

const useImageViewerStore = create<State & Actions>()((set) => ({
    urls: [],
    index: 0,
    open: (urls, index, alt) => set({ urls, index, alt }),
    close: () => set({ urls: [], index: 0, alt: undefined }),
}));

/** Opens the full-screen viewer over whatever is on screen; `alt` labels the image for screen readers. */
export function openImageViewer(
    urls: string | string[],
    index = 0,
    alt?: string,
) {
    const list = Array.isArray(urls) ? urls : [urls];

    if (list.length > 0) useImageViewerStore.getState().open(list, index, alt);
}

export { useImageViewerStore };

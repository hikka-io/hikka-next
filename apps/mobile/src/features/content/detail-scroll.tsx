import {
    createContext,
    type FC,
    type PropsWithChildren,
    useContext,
    useState,
    useSyncExternalStore,
} from 'react';

import type {
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';

const PRELOAD_SCREENS = 1;

type Viewport = { top: number; bottom: number };

class DetailScrollStore {
    viewport: Viewport = { top: 0, bottom: 0 };
    private listeners = new Set<() => void>();

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    update(top: number, height: number) {
        this.viewport = { top, bottom: top + height };
        for (const listener of this.listeners) listener();
    }

    onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement, contentInset } =
            event.nativeEvent;
        this.update(
            contentOffset.y + contentInset.top,
            layoutMeasurement.height,
        );
    };

    onLayout = (event: LayoutChangeEvent) => {
        if (this.viewport.bottom === 0) {
            this.update(0, event.nativeEvent.layout.height);
        }
    };
}

const DetailScrollContext = createContext<DetailScrollStore | null>(null);

function useDetailScrollStore() {
    const store = useContext(DetailScrollContext);
    if (!store) {
        throw new Error('useDetailScrollStore needs a DetailScrollProvider');
    }
    return store;
}

export function useDetailScroll() {
    const store = useDetailScrollStore();
    return { onScroll: store.onScroll, onLayout: store.onLayout };
}

/** Latches to true once the block's top comes within a screen of the viewport. */
export function useVisibleOnce() {
    const store = useDetailScrollStore();
    const [top, setTop] = useState<number | null>(null);
    const [latched, setLatched] = useState(false);

    const near = useSyncExternalStore(store.subscribe, () => {
        const { bottom } = store.viewport;
        if (top === null || bottom === 0) return false;
        const height = bottom - store.viewport.top;
        return top < bottom + height * PRELOAD_SCREENS;
    });

    if (near && !latched) setLatched(true);

    const onLayout = (event: LayoutChangeEvent) => {
        setTop(event.nativeEvent.layout.y);
    };

    return { onLayout, visible: latched || near };
}

/** True once the viewport top has scrolled past `offset`. */
export function useScrolledPast(offset: number | null) {
    const store = useDetailScrollStore();

    return useSyncExternalStore(
        store.subscribe,
        () => offset !== null && store.viewport.top > offset,
    );
}

const DetailScrollProvider: FC<PropsWithChildren> = ({ children }) => {
    const [store] = useState(() => new DetailScrollStore());

    return (
        <DetailScrollContext.Provider value={store}>
            {children}
        </DetailScrollContext.Provider>
    );
};

export default DetailScrollProvider;

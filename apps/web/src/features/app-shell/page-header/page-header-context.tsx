import {
    type ComponentType,
    createContext,
    type FC,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

export type PageHeaderConfig = {
    title?: string | null;
    subtitle?: string | null;
    parent?: string;
    navRoutes?: Hikka.NavRoute[];
    navUrlPrefix?: string;
    titleComponent?: ComponentType;
    actionsComponent?: ComponentType;
    /**
     * Set by pages that mount a `usePageTitleAnchor` node. The header keeps
     * the title hidden until that anchor is scrolled past. Pages that omit
     * this show their title unconditionally.
     */
    anchored?: boolean;
};

type PageHeaderState = {
    config: PageHeaderConfig | null;
    anchor: HTMLElement | null;
    titleVisible: boolean;
    titleAnimated: boolean;
};

type PageHeaderActions = {
    setConfig: (config: PageHeaderConfig | null) => void;
    setAnchor: (anchor: HTMLElement | null) => void;
    setTitleVisible: (visible: boolean) => void;
    setTitleAnimated: (animated: boolean) => void;
};

const PageHeaderStateContext = createContext<PageHeaderState | null>(null);
const PageHeaderActionsContext = createContext<PageHeaderActions | null>(null);

export const PageHeaderProvider: FC<PropsWithChildren> = ({ children }) => {
    const [config, setConfig] = useState<PageHeaderConfig | null>(null);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [titleVisible, setTitleVisible] = useState(false);
    const [titleAnimated, setTitleAnimated] = useState(false);

    useEffect(() => {
        if (!import.meta.env.DEV || !anchor || !config || config.anchored) {
            return;
        }

        console.warn(
            '[page-header] anchor registered but usePageHeader was not called with anchored: true',
            config.title,
        );
    }, [anchor, config]);

    const state = useMemo(
        () => ({ config, anchor, titleVisible, titleAnimated }),
        [config, anchor, titleVisible, titleAnimated],
    );
    const actions = useMemo(
        () => ({ setConfig, setAnchor, setTitleVisible, setTitleAnimated }),
        [],
    );

    return (
        <PageHeaderActionsContext.Provider value={actions}>
            <PageHeaderStateContext.Provider value={state}>
                {children}
            </PageHeaderStateContext.Provider>
        </PageHeaderActionsContext.Provider>
    );
};

export const usePageHeaderActions = () => {
    const context = useContext(PageHeaderActionsContext);

    if (!context) {
        throw new Error(
            'usePageHeaderActions must be used within PageHeaderProvider',
        );
    }

    return context;
};

export const usePageHeaderState = () => {
    const context = useContext(PageHeaderStateContext);

    if (!context) {
        throw new Error(
            'usePageHeaderState must be used within PageHeaderProvider',
        );
    }

    return context;
};

// An inline component gets a fresh identity every render, which as a raw
// effect dep would re-run setConfig forever. The config carries this wrapper.
const useStableSlot = (component?: ComponentType) => {
    const latest = useRef(component);
    const [Slot] = useState(() => {
        const StableSlot = () => {
            const Component = latest.current;

            return Component ? <Component /> : null;
        };

        return StableSlot;
    });

    useEffect(() => {
        latest.current = component;
    });

    return component ? Slot : undefined;
};

export const usePageHeader = ({
    title,
    subtitle,
    parent,
    navRoutes,
    navUrlPrefix,
    titleComponent,
    actionsComponent,
    anchored,
}: PageHeaderConfig) => {
    const { setConfig } = usePageHeaderActions();

    const titleSlot = useStableSlot(titleComponent);
    const actionsSlot = useStableSlot(actionsComponent);

    useEffect(() => {
        setConfig({
            title,
            subtitle,
            parent,
            navRoutes,
            navUrlPrefix,
            titleComponent: titleSlot,
            actionsComponent: actionsSlot,
            anchored,
        });

        return () => setConfig(null);
    }, [
        title,
        subtitle,
        parent,
        navRoutes,
        navUrlPrefix,
        titleSlot,
        actionsSlot,
        anchored,
        setConfig,
    ]);
};

export const usePageTitleReveal = () => {
    const { titleVisible, titleAnimated } = usePageHeaderState();

    return useMemo(
        () => ({ visible: titleVisible, animated: titleAnimated }),
        [titleVisible, titleAnimated],
    );
};

export const usePageTitleAnchor = () => {
    const { setAnchor } = usePageHeaderActions();

    return useCallback(
        (node: HTMLElement | null) => {
            setAnchor(node);

            return () => setAnchor(null);
        },
        [setAnchor],
    );
};

import {
    createContext,
    type FC,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type PageHeaderConfig = {
    title?: string | null;
    subtitle?: string | null;
    /** Tailwind background class for the leading status dot. */
    indicatorClassName?: string;
    /** Route the back button falls back to when there is no in-app history. */
    parent?: string;
    navRoutes?: Hikka.NavRoute[];
    navUrlPrefix?: string;
};

type PageHeaderState = {
    config: PageHeaderConfig | null;
    anchor: HTMLElement | null;
    /** Whether the header is currently showing the page title. */
    titleVisible: boolean;
};

type PageHeaderActions = {
    setConfig: (config: PageHeaderConfig | null) => void;
    setAnchor: (anchor: HTMLElement | null) => void;
    setTitleVisible: (visible: boolean) => void;
};

const PageHeaderStateContext = createContext<PageHeaderState | null>(null);
const PageHeaderActionsContext = createContext<PageHeaderActions | null>(null);

/**
 * Splits state from actions so pages that only register a header never
 * re-render when the header itself changes.
 */
export const PageHeaderProvider: FC<PropsWithChildren> = ({ children }) => {
    const [config, setConfig] = useState<PageHeaderConfig | null>(null);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [titleVisible, setTitleVisible] = useState(false);

    const state = useMemo(
        () => ({ config, anchor, titleVisible }),
        [config, anchor, titleVisible],
    );
    const actions = useMemo(
        () => ({ setConfig, setAnchor, setTitleVisible }),
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

export const usePageHeader = ({
    title,
    subtitle,
    indicatorClassName,
    parent,
    navRoutes,
    navUrlPrefix,
}: PageHeaderConfig) => {
    const { setConfig } = usePageHeaderActions();

    useEffect(() => {
        setConfig({
            title,
            subtitle,
            indicatorClassName,
            parent,
            navRoutes,
            navUrlPrefix,
        });

        return () => setConfig(null);
    }, [
        title,
        subtitle,
        indicatorClassName,
        parent,
        navRoutes,
        navUrlPrefix,
        setConfig,
    ]);
};

/**
 * Marks the element the page uses as its own title. The header keeps its title
 * hidden until that element scrolls out of view; pages without an anchor show
 * it right away.
 */
/**
 * Whether the header is showing the page title. Bottom bars ride along with
 * it, so a screen opens with its content uncovered.
 */
export const usePageTitleVisible = () => usePageHeaderState().titleVisible;

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

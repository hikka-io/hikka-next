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
    indicatorClassName?: string;
    parent?: string;
    navRoutes?: Hikka.NavRoute[];
    navUrlPrefix?: string;
};

type PageHeaderState = {
    config: PageHeaderConfig | null;
    anchor: HTMLElement | null;
    titleVisible: boolean;
};

type PageHeaderActions = {
    setConfig: (config: PageHeaderConfig | null) => void;
    setAnchor: (anchor: HTMLElement | null) => void;
    setTitleVisible: (visible: boolean) => void;
};

const PageHeaderStateContext = createContext<PageHeaderState | null>(null);
const PageHeaderActionsContext = createContext<PageHeaderActions | null>(null);

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

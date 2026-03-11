'use client';

import {
    FC,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps extends PropsWithChildren {
    attribute?: string;
    defaultTheme?: Theme;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const STORAGE_KEY = 'theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function getStoredTheme(defaultTheme: Theme): Theme {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme;
}

function applyTheme(
    resolved: 'light' | 'dark',
    disableTransition: boolean,
    attribute: string,
) {
    const root = document.documentElement;
    const other = resolved === 'dark' ? 'light' : 'dark';

    if (disableTransition) {
        const style = document.createElement('style');
        style.appendChild(
            document.createTextNode(
                '*, *::before, *::after { transition: none !important; }',
            ),
        );
        document.head.appendChild(style);
        requestAnimationFrame(() => {
            document.head.removeChild(style);
        });
    }

    if (attribute === 'class') {
        root.classList.remove(other);
        root.classList.add(resolved);
    } else {
        root.setAttribute(`data-${attribute}`, resolved);
    }
}

const ThemeProvider: FC<ThemeProviderProps> = ({
    children,
    attribute = 'class',
    defaultTheme = 'dark',
    enableSystem = false,
    disableTransitionOnChange = false,
}) => {
    const [theme, setThemeState] = useState<Theme>(() =>
        getStoredTheme(defaultTheme),
    );
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
        getSystemTheme,
    );

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
    }, []);

    useEffect(() => {
        applyTheme(resolvedTheme, disableTransitionOnChange, attribute);
    }, [resolvedTheme, disableTransitionOnChange, attribute]);

    useEffect(() => {
        if (!enableSystem) return;

        const mql = window.matchMedia(MEDIA_QUERY);
        const handler = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [enableSystem]);

    const value = useMemo(
        () => ({ theme, setTheme, resolvedTheme }),
        [theme, setTheme, resolvedTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

export type { ThemeProviderProps };
export default ThemeProvider;

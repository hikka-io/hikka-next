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

const COOKIE_NAME = 'theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function getThemeCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

function setThemeCookie(value: Theme): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
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

    root.style.colorScheme = resolved;
}

const ThemeProvider: FC<ThemeProviderProps> = ({
    children,
    attribute = 'class',
    defaultTheme = 'dark',
    enableSystem = false,
    disableTransitionOnChange = false,
}) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = getThemeCookie();
        return (stored as Theme) || defaultTheme;
    });
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
        getSystemTheme,
    );

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        setThemeCookie(newTheme);
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

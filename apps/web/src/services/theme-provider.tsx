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

import { COOKIE, writeHostCookie } from '@/utils/cookies';
import { syncThemeColorMeta } from '@/utils/customization';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = PropsWithChildren & {
    attribute?: string;
    defaultTheme?: Theme;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
};

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const THEME_COOKIE_PATTERN = new RegExp(
    `(?:^|;\\s*)${COOKIE.theme.name}=([^;]*)`,
);

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function getThemeCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(THEME_COOKIE_PATTERN);
    return match ? decodeURIComponent(match[1]) : null;
}

function setThemeCookie(value: Theme): void {
    writeHostCookie(COOKIE.theme, value);
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
    syncThemeColorMeta(resolved);
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
        // Nothing re-stamps this cookie server-side, so refresh its maxAge on
        // load or an untouched theme expires. Only for users who already chose.
        const stored = getThemeCookie();
        if (stored) setThemeCookie(stored as Theme);
    }, []);

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

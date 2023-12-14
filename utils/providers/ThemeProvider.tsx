'use client';

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { usePathname } from 'next/navigation';

type Theme = 'dark' | 'light';

interface State {
    theme: Theme;
}

interface ContextProps extends State {
    switchTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ContextProps>({
    theme: 'dark',
    switchTheme: () => null,
});

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    if (typeof window !== "undefined") {
        const theme =localStorage.getItem('theme');

        return {
            theme: theme ? (theme as Theme) : 'dark',
        };
    }

    return {
        theme: 'dark',
    }
}

export const useThemeContext = () => {
    return useContext(ThemeContext);
};

export default function ThemeProvider({ children }: Props) {
    const [state, setState] = useState<State>(getInitialState());

    const switchTheme = (theme: Theme) => {
        setState({
            theme,
        });
    };

    useEffect(() => {
        localStorage.setItem('theme', state.theme);
        // document.getElementsByTagName('html')[0].setAttribute('data-theme', state.theme)
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    return (
        <ThemeContext.Provider
            value={{
                ...state,
                switchTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

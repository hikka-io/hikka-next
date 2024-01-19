'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

interface State {
    titleLanguage?: 'title_en' | 'title_ua' | 'title_ja';
}

interface ContextProps extends State {
    setState?: Dispatch<SetStateAction<State | undefined>>;
}

const SettingsContext = createContext<ContextProps>({});

interface Props {
    children: ReactNode;
}

async function getInitialState(): Promise<State> {
    if (typeof window !== 'undefined') {
        const settings = localStorage.getItem('settings');

        if (settings) {
            return JSON.parse(settings);
        }
    }

    return {
        titleLanguage: 'title_ua',
    };
}

export const useSettingsContext = () => {
    return useContext(SettingsContext);
};

export default function SettingsProvider({ children }: Props) {
    const [state, setState] = useState<State | undefined>();

    useEffect(() => {
        getInitialState().then((data) => setState(data));
    }, []);

    useEffect(() => {
        if (state) {
            localStorage.setItem('settings', JSON.stringify(state));
        }
    }, [state]);

    return (
        <SettingsContext.Provider
            value={{
                ...state,
                setState,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
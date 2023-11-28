'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext, useEffect,
    useState,
} from 'react';
import {usePathname, useSearchParams} from "next/navigation";

interface State {
    profile?: boolean;
    mainNav?: boolean;
    animeNav?: boolean;
    userNav?: boolean;
}

interface ContextProps extends State {
    setState: Dispatch<SetStateAction<State>>;
    switchPopper: (popper: keyof State, hierarchy?: boolean) => void;
    closePoppers: () => void;
}

const PopperContext = createContext<ContextProps>({
    setState: () => null,
    switchPopper: () => null,
    closePoppers: () => null,
});

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    return {
        profile: false,
        mainNav: false,
        animeNav: false,
        userNav: false,
    };
}

export const usePopperContext = () => {
    return useContext(PopperContext);
};

export default function PoppperProvider({ children }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [state, setState] = useState<State>(getInitialState());

    const popperParam = searchParams.get('popper');

    const switchPopper = (popper: keyof State, hierarchy: boolean = false) => {
        setState({
            ...(hierarchy ? state : getInitialState()),
            [popper]: !state[popper],
        });
    };

    const closePoppers = () => {
        setState(getInitialState());
    };

    useEffect(() => {
        if (pathname) {
            closePoppers();
        }
    }, [pathname]);

    useEffect(() => {
        if (popperParam && popperParam in state) {
            switchPopper(popperParam as keyof State);
        }
    }, [popperParam]);


    return (
        <PopperContext.Provider
            value={{
                ...state,
                setState,
                switchPopper,
                closePoppers,
            }}
        >
            {children}
        </PopperContext.Provider>
    );
}

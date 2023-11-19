'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext, useEffect,
    useState,
} from 'react';
import {usePathname} from "next/navigation";

interface State {
    login?: boolean;
    signup?: boolean;
    userSettings?: boolean;
    animeSettings?: boolean;
    search?: boolean;
    animeEdit?: boolean;
    animeEditList?: boolean;
}

interface ContextProps extends State {
    setState: Dispatch<SetStateAction<State>>;
    switchModal: (modal: keyof State) => void;
    closeModals: () => void;
}

const ModalContext = createContext<ContextProps>({
    setState: () => null,
    switchModal: () => null,
    closeModals: () => null,
});

interface Props {
    children: ReactNode;
}

function getInitialState() {
    return {
        login: false,
        signup: false,
        userSettings: false,
        animeSettings: false,
        search: false,
        animeEdit: false,
        animeEditList: false,
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const pathname = usePathname();
    const [state, setState] = useState<State>(getInitialState());

    const switchModal = (modal: keyof State) => {
        setState({
            ...state,
            [modal]: !state[modal],
        });
    };

    const closeModals = () => {
        setState(getInitialState());
    };

    useEffect(() => {
        if (pathname) {
            closeModals();
        }
    }, [pathname]);


    return (
        <ModalContext.Provider
            value={{
                ...state,
                setState,
                switchModal,
                closeModals,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}

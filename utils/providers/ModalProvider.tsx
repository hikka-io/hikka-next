'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';

interface State {
    login?: boolean;
    signup?: boolean;
    userSettings?: boolean;
    animeSettings?: boolean;
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
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const [state, setState] = useState<State>(getInitialState());

    const switchModal = (modal: keyof State) => {
        setState({
            ...getInitialState(),
            [modal]: !state[modal],
        });
    };

    const closeModals = () => {
        setState(getInitialState());
    };

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

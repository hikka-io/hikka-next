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

import { usePathname, useSearchParams } from 'next/navigation';

interface State {
    login?: boolean;
    signup?: boolean;
    userSettings?: boolean;
    animeSettings?: boolean;
    search?: boolean;
    animeEdit?: boolean;
    animeEditList?: boolean;
    forgotPassword?: boolean;
    passwordConfirm?: boolean;

    rightholder?: boolean;
    editRules?: boolean;

    followers?: boolean;
    followings?: boolean;
    uploadAvatar?: boolean;
    uploadCover?: boolean;
}

interface ContextProps extends State {
    setState: Dispatch<SetStateAction<State>>;
    switchModal: (modal: keyof State, hierarchy?: boolean) => void;
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

function getInitialState(): State {
    return {
        login: false,
        signup: false,
        userSettings: false,
        animeSettings: false,
        search: false,
        animeEdit: false,
        animeEditList: false,
        forgotPassword: false,
        passwordConfirm: false,

        rightholder: false,
        editRules: false,

        followers: false,
        followings: false,
        uploadAvatar: false,
        uploadCover: false,
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [state, setState] = useState<State>(getInitialState());

    const modalParam = searchParams.get('modal');

    const switchModal = (modal: keyof State, hierarchy: boolean = false) => {
        setState({
            ...(hierarchy ? state : getInitialState()),
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

    useEffect(() => {
        if (modalParam && modalParam in state) {
            switchModal(modalParam as keyof State);
        }
    }, [modalParam]);

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

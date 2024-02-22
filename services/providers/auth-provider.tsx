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

import { deleteCookie, getCookie } from '@/app/actions';

interface State {
    secret?: string;
}

interface ContextProps extends State {
    setState: Dispatch<SetStateAction<State | undefined>>;
    logout: () => void;
}

const AuthContext = createContext<ContextProps>({
    setState: () => null,
    logout: () => null,
});

interface Props {
    children: ReactNode;
}

async function getInitialState() {
    const secret = await getCookie('secret');

    return {
        secret,
    };
}

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export default function AuthProvider({ children }: Props) {
    const [state, setState] = useState<State | undefined>();

    const logout = async () => {
        await deleteCookie('secret');
        setState(undefined);
        window.location.reload();
    };

    useEffect(() => {
        getInitialState().then((data) => setState(data));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setState,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from 'react';

export type Item = {
    id: string;
    content: Hikka.Anime;
};

export type Group = {
    id: string;
    title?: string;
    items: Item[];
    isGroup: boolean;
}

interface State {
    groups: Group[];
}

interface ContextProps extends State {
    setState?: Dispatch<SetStateAction<State>>;
}

const CollectionContext = createContext<ContextProps>(getInitialState());

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    return {
        groups: [
            {
                id: String(Date.now()),
                title: undefined,
                isGroup: false,
                items: []
            }
        ],
    };
}

export const useCollectionContext = () => {
    return useContext(CollectionContext);
};

export default function CollectionProvider({ children }: Props) {
    const [state, setState] = useState<State>(getInitialState());

    return (
        <CollectionContext.Provider
            value={{
                ...state,
                setState,
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
}
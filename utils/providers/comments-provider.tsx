'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from 'react';

interface State {
    currentDepth: number;
    currentReply?: string;
    currentEdit?: string;
}

interface ContextProps extends State {
    setState?: Dispatch<SetStateAction<State>>;
}

const CommentsContext = createContext<ContextProps>(getInitialState());

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    return {
        currentDepth: 1,
        currentReply: undefined,
        currentEdit: undefined,
    };
}

export const useCommentsContext = () => {
    return useContext(CommentsContext);
};

export default function CommentsProvider({ children }: Props) {
    const [state, setState] = useState<State>(getInitialState());

    return (
        <CommentsContext.Provider
            value={{
                ...state,
                setState,
            }}
        >
            {children}
        </CommentsContext.Provider>
    );
}
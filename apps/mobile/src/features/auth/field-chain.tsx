import {
    createContext,
    type FC,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import type { TextInput } from 'react-native';

type InputRef = RefObject<TextInput | null>;

type Chain = {
    fields: InputRef[];
    register: (input: InputRef) => () => void;
    submit: () => void;
};

const ChainContext = createContext<Chain | null>(null);

type Props = {
    onSubmit: () => void;
    children: ReactNode;
};

// Fields register in mount order, which is render order: "next" focuses the following field and the last one submits.
const FieldChain: FC<Props> = ({ onSubmit, children }) => {
    const [fields, setFields] = useState<InputRef[]>([]);

    const register = useCallback((input: InputRef) => {
        setFields((current) => [...current, input]);
        return () =>
            setFields((current) => current.filter((item) => item !== input));
    }, []);

    const value = useMemo(
        () => ({ fields, register, submit: onSubmit }),
        [fields, register, onSubmit],
    );

    return (
        <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
    );
};

export const useFieldChain = () => useContext(ChainContext);

export default FieldChain;

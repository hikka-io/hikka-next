import * as React from 'react';

type DebounceProps<T> = {
    value: T;
    delay?: number;
};

const useDebounce = <T>({
    value,
    delay = 500,
}: DebounceProps<T>): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue, setDebouncedValue];
};

export default useDebounce;

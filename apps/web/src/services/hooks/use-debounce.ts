import * as React from 'react';

export const DEBOUNCE_MS = { input: 300, commit: 500 } as const;

type DebounceProps<T> = {
    value: T;
    delay?: number;
};

export const useDebounce = <T>({
    value,
    delay = DEBOUNCE_MS.commit,
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

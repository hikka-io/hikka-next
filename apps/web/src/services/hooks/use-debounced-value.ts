import * as React from 'react';

type DebouncedValueProps<T> = {
    value: T;
    delay?: number;
};

/**
 * `useDebounce` variant that also exposes a setter to update the debounced
 * value immediately, skipping the timeout (e.g. applying a picked suggestion).
 */
const useDebouncedValue = <T>({
    value,
    delay = 500,
}: DebouncedValueProps<T>) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return { debouncedValue, setDebouncedValue };
};

export default useDebouncedValue;

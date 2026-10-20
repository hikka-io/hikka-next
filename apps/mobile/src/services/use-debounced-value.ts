import { useEffect, useState } from 'react';

/** The web's `DEBOUNCE_MS`: `input` for live lookups, `commit` for requests per keystroke. */
export const DEBOUNCE_MS = { input: 300, commit: 500 } as const;

export function useDebouncedValue<T>(
    value: T,
    delay: number = DEBOUNCE_MS.commit,
) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

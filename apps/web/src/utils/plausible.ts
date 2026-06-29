declare global {
    interface Window {
        plausible?: (
            event: string,
            options?: { props?: Record<string, string | number | boolean> },
        ) => void;
    }
}

export function usePlausible<
    T extends Record<string, never> = Record<string, never>,
>() {
    return (
        event: keyof T & string,
        options?: { props?: Record<string, string | number | boolean> },
    ) => {
        window.plausible?.(event, options);
    };
}

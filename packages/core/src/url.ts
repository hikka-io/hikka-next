export const parseUrl = (value: string): URL | null => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

export const resolveSameOriginUrl = (
    target: string,
    base: string,
): URL | null => {
    try {
        const url = new URL(target, base);

        return url.origin === new URL(base).origin ? url : null;
    } catch {
        return null;
    }
};

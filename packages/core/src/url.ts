export const parseUrl = (value: string): URL | null => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

/** `value` resolved against `base` when it is an http(s) link; `javascript:`, `data:`, custom schemes and unparsable values are not. */
export const resolveWebUrl = (value: string, base: string): URL | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
        const url = new URL(trimmed, base);
        return url.protocol === 'https:' || url.protocol === 'http:'
            ? url
            : null;
    } catch {
        return null;
    }
};

/** Like `resolveWebUrl`, https only: what images may load from. */
export const resolveHttpsUrl = (value: string, base: string): URL | null => {
    const url = resolveWebUrl(value, base);
    return url?.protocol === 'https:' ? url : null;
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

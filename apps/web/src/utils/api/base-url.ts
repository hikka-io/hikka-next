import { DEFAULT_BASE_URL } from '@hikka/api';

/** Public API URL — logical base for the browser and all query keys. */
export const PUBLIC_API_URL: string =
    import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;

// Physical target for server requests: the internal `API_URL` (e.g.
// http://backend:8000), read from process.env since Vite inlines only VITE_
// vars. SSR guard keeps `process` out of the browser bundle.
/** Internal host for SSR requests; the public URL in the browser or if unset. */
export function getInternalApiUrl(): string {
    if (import.meta.env.SSR) {
        return process.env.API_URL || PUBLIC_API_URL;
    }

    return PUBLIC_API_URL;
}

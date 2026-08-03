import { notFound } from '@tanstack/react-router';

import { HikkaApiError } from '@hikka/api';

import { retryOnCancel } from './retry-on-cancel';

/**
 * Awaits a route-loader query and converts a 404 from the API into a router
 * `notFound()` so an unknown slug renders the not-found page instead of
 * bubbling up as a 500. Any other error is rethrown unchanged.
 */
export async function ensureOr404<T>(fetchQuery: () => Promise<T>): Promise<T> {
    try {
        return await retryOnCancel(fetchQuery);
    } catch (error) {
        if (error instanceof HikkaApiError && error.status === 404) {
            throw notFound();
        }
        throw error;
    }
}

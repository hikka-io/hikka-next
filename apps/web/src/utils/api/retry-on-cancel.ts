import { CancelledError } from '@tanstack/react-query';

/**
 * Runs a route-loader query so a component can't abort it. `ensureQueryData`
 * hands back whatever fetch is already in flight for that key without becoming
 * an observer of it, and TanStack Query aborts an abortable fetch the moment
 * its last observer unmounts — so a hover card closing on the click that
 * navigated rejects the loader with `CancelledError`. The cancel reverts the
 * query, so re-running starts a fresh fetch.
 */
export async function retryOnCancel<T>(
    fetchQuery: () => Promise<T>,
): Promise<T> {
    try {
        return await fetchQuery();
    } catch (error) {
        if (error instanceof CancelledError) return fetchQuery();
        throw error;
    }
}

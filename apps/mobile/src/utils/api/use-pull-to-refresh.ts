import { useState } from 'react';

import {
    type Query,
    type QueryClient,
    useQueryClient,
} from '@tanstack/react-query';

type QueryPredicate = (query: Query) => boolean;

const keyPath = (query: Query) => {
    const [key] = query.queryKey;
    if (typeof key !== 'object' || key === null || !('path' in key)) {
        return undefined;
    }
    const { path } = key as { path?: unknown };
    return typeof path === 'object' && path !== null
        ? (path as Record<string, unknown>)
        : undefined;
};

export const keyBody = (query: Query) => {
    const [key] = query.queryKey;
    if (typeof key !== 'object' || key === null || !('body' in key)) {
        return undefined;
    }
    const { body } = key as { body?: unknown };
    return typeof body === 'object' && body !== null
        ? (body as Record<string, unknown>)
        : undefined;
};

/** Every query of a detail page: its key carries the page's slug. */
export const bySlug =
    (slug: string): QueryPredicate =>
    (query) =>
        keyPath(query)?.slug === slug;

/** A detail page's queries plus the collection and article lists filtered by it (`body.content`, `body.content_slug`). */
export const byContent = (slug: string): QueryPredicate => {
    const byPath = bySlug(slug);

    return (query) => {
        const body = keyBody(query);

        return (
            byPath(query) ||
            body?.content_slug === slug ||
            (Array.isArray(body?.content) && body.content.includes(slug))
        );
    };
};

/** Every query of a profile; the route name may differ in case from the stored one. */
export const byUsername = (usernames: string[]): QueryPredicate => {
    const names = usernames.map((name) => name.toLowerCase());
    return (query) => {
        const username = keyPath(query)?.username;
        return (
            typeof username === 'string' &&
            names.includes(username.toLowerCase())
        );
    };
};

/** Mounted matches refetch now, unmounted ones are stale for their next mount. */
export const refreshQueries = (
    queryClient: QueryClient,
    predicate: QueryPredicate,
) => queryClient.invalidateQueries({ predicate });

/** Pull-to-refresh state for a screen whose queries match `predicate`. */
export const usePullToRefresh = (predicate: QueryPredicate) => {
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshQueries(queryClient, predicate);
        } finally {
            setRefreshing(false);
        }
    };

    return { refreshing, onRefresh };
};

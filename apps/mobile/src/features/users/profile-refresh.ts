import type { Query } from '@tanstack/react-query';

import { byUsername } from '@/utils/api/use-pull-to-refresh';

const keyBody = (query: Query) => {
    const [key] = query.queryKey;
    if (typeof key !== 'object' || key === null || !('body' in key)) {
        return undefined;
    }
    const { body } = key as { body?: unknown };
    return typeof body === 'object' && body !== null
        ? (body as Record<string, unknown>)
        : undefined;
};

/** Every query of a profile: `path.username`, plus `body.author` for the user's collections and articles. */
export const byProfile = (usernames: string[]) => {
    const byPath = byUsername(usernames);
    const names = usernames.map((name) => name.toLowerCase());

    return (query: Query) => {
        const author = keyBody(query)?.author;

        return (
            byPath(query) ||
            (typeof author === 'string' && names.includes(author.toLowerCase()))
        );
    };
};

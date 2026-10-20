import type { Query } from '@tanstack/react-query';

import { queryId } from '@hikka/core';

import { byUsername, keyBody } from '@/utils/api/use-pull-to-refresh';

const SESSION_IDS = new Set(['profile', 'profileUi']);

/**
 * Every query of a profile: `path.username`, plus `body.author` for the user's collections and articles.
 * The viewer's own profile also refreshes the session, whose keys carry no username.
 */
export const byProfile = (usernames: string[], own = false) => {
    const byPath = byUsername(usernames);
    const names = usernames.map((name) => name.toLowerCase());

    return (query: Query) => {
        const author = keyBody(query)?.author;

        return (
            byPath(query) ||
            (typeof author === 'string' &&
                names.includes(author.toLowerCase())) ||
            (own && SESSION_IDS.has(queryId(query.queryKey) ?? ''))
        );
    };
};

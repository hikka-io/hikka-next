import type { Query } from '@tanstack/react-query';

import { byUsername, keyBody } from '@/utils/api/use-pull-to-refresh';

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

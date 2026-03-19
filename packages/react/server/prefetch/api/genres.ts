import { genresOptions } from '@/options/api/genres';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';

/**
 * Prefetches all genres for server-side rendering
 */
export async function prefetchGenres({ ...rest }: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => genresOptions(client),
        ...rest,
    });
}

import type { QueryClient } from '@tanstack/react-query';

import type { Client } from '@hikka/api';

import { isServer } from '@/utils/is-server';

export type LoaderContext = {
    queryClient: QueryClient;
    apiClient: Client;
};

/** Pass only promises that never reject (`prefetchQuery`/`prefetchInfiniteQuery`): the client leaves them running. */
export async function awaitOnServer(
    prefetches: readonly Promise<unknown>[],
): Promise<void> {
    if (isServer()) await Promise.all(prefetches);
}

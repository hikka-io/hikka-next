import type { QueryClient } from '@tanstack/react-query';

import { type ProfileResponse, profileQueryKey } from '@hikka/api';

// Valid only in loaders under /_pages: its beforeLoad has already ensured the profile.
export function getSessionFromPagesCache(queryClient: QueryClient) {
    return queryClient.getQueryData<ProfileResponse>(profileQueryKey());
}

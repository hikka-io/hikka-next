import type { QueryClient } from '@tanstack/react-query';

import {
    HikkaApiError,
    type ProfileResponse,
    profileQueryKey,
} from '@hikka/api';

// Backend `_auth_token_or_abort` codes after which the auth cookie can never authenticate again.
const DEAD_SESSION_CODES = new Set([
    'auth:invalid_token',
    'auth:token_expired',
    'auth:user_not_found',
]);

export function isDeadSessionError(error: unknown) {
    return error instanceof HikkaApiError && DEAD_SESSION_CODES.has(error.code);
}

// Valid only in loaders under /_pages: its beforeLoad has already ensured the profile.
export function getSessionFromPagesCache(queryClient: QueryClient) {
    return queryClient.getQueryData<ProfileResponse>(profileQueryKey());
}

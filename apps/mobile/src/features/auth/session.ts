import { HikkaApiError } from '@hikka/api';

import { resetSessionUIWriter } from '@/services/session/session-ui-writer';
import { queryClient } from '@/utils/query-client';

import { storeAuthToken } from './auth-token';

const DEAD_TOKEN_CODES = new Set(['auth:invalid_token', 'auth:token_expired']);

// Every cached response may carry viewer state (watch status, follows), so both directions drop it all.
export async function signIn(token: string) {
    resetSessionUIWriter();
    await storeAuthToken(token);
    void queryClient.resetQueries();
}

export async function signOut() {
    resetSessionUIWriter();
    await storeAuthToken(undefined);
    void queryClient.resetQueries();
}

// The backend answers a revoked or expired token with 400 and an `auth:` code, not 401.
export const isDeadTokenError = (error: unknown) =>
    error instanceof HikkaApiError &&
    (error.status === 401 || DEAD_TOKEN_CODES.has(error.code));

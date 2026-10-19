import { queryClient } from '@/utils/query-client';

import { storeAuthToken } from './auth-token';

// Every cached response may carry viewer state (watch status, follows), so both directions drop it all.
export async function signIn(token: string) {
    await storeAuthToken(token);
    void queryClient.resetQueries();
}

export async function signOut() {
    await storeAuthToken(undefined);
    void queryClient.resetQueries();
}

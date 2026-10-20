import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { profileOptions } from '@hikka/api';

import { useAuthToken } from './auth-token';
import { isDeadTokenError, signOut } from './session';

export function useSession() {
    const token = useAuthToken();
    const query = useQuery({ ...profileOptions(), enabled: !!token });

    useEffect(() => {
        if (token && isDeadTokenError(query.error)) void signOut();
    }, [token, query.error]);

    // Named fields only: a spread reads every tracked field and re-renders each caller on every fetch-state change.
    return {
        hasToken: !!token,
        user: token ? query.data : undefined,
        isPending: query.isPending,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

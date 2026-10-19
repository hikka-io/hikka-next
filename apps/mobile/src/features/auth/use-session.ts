import { useQuery } from '@tanstack/react-query';

import { profileOptions } from '@hikka/api';

import { useAuthToken } from './auth-token';

export function useSession() {
    const token = useAuthToken();
    const query = useQuery({ ...profileOptions(), enabled: !!token });

    return { ...query, user: token ? query.data : undefined };
}

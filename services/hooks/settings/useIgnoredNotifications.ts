import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import getIgnoredNotifications, {
    Response,
} from '@/services/api/settings/getIgnoredNotifications';
import useAuth from '@/services/hooks/auth/useAuth';

const useIgnoredNotifications = (options?: UseQueryOptions<Response>) => {
    const { auth } = useAuth();

    return useQuery({
        ...options,
        queryKey: ['ignoredNotifications', { auth }],
        queryFn: () => getIgnoredNotifications({ auth: auth! }),
        enabled: !!auth,
    });
};

export default useIgnoredNotifications;

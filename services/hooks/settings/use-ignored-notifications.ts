import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import getIgnoredNotifications, {
    Response,
} from '@/services/api/settings/getIgnoredNotifications';

const useIgnoredNotifications = (options?: UseQueryOptions<Response>) => {
    return useQuery({
        ...options,
        queryKey: ['ignoredNotifications'],
        queryFn: () => getIgnoredNotifications(),
    });
};

export default useIgnoredNotifications;

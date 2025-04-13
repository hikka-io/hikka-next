import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import getIgnoredNotifications, {
    Response,
} from '../../api/settings/getIgnoredNotifications';

export const key = () => ['ignored-notifications'];

const useIgnoredNotifications = (options?: UseQueryOptions<Response>) => {
    return useQuery({
        ...options,
        queryKey: key(),
        queryFn: () => getIgnoredNotifications(),
    });
};

export default useIgnoredNotifications;

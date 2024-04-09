import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import changeIgnoredNotifications, {
    Response,
} from '@/services/api/settings/changeIgnoredNotifications';
import useAuth from '@/services/hooks/auth/useAuth';

type Variables = {
    ignored_notifications: API.NotificationType[];
};

const useChangeIgnoredNotifications = (
    options?: UseMutationOptions<Response, Error, Variables>,
) => {
    const { auth } = useAuth();

    return useMutation({
        ...options,
        mutationKey: ['ignoredNotifications', { auth }],
        mutationFn: ({ ignored_notifications }: Variables) =>
            changeIgnoredNotifications({ auth: auth!, ignored_notifications }),
    });
};

export default useChangeIgnoredNotifications;

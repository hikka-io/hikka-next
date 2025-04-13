import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import changeIgnoredNotifications, {
    Response,
} from '../../api/settings/changeIgnoredNotifications';

type Variables = {
    ignored_notifications: API.NotificationType[];
};

const useChangeIgnoredNotifications = (
    options?: UseMutationOptions<Response, Error, Variables>,
) => {
    return useMutation({
        ...options,
        mutationKey: ['ignoredNotifications'],
        mutationFn: ({ ignored_notifications }: Variables) =>
            changeIgnoredNotifications({
                params: {
                    ignored_notifications,
                },
            }),
    });
};

export default useChangeIgnoredNotifications;

import { useMutation, useQueryClient } from '@tanstack/react-query';

import seenNotification from '@/services/api/notifications/seenNotification';

const useSeenNotification = (secret: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reference }: { reference: string }) =>
            seenNotification({
                reference: reference,
                secret: secret,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', secret],
            });

            queryClient.invalidateQueries({
                queryKey: ['notificationsCount', secret],
            });
        },
    });
};

export default useSeenNotification;
